/**
 * BrandMark Lead Marketplace API — mounted at /api/marketplace
 *
 * Consent-based: customers post their own requirement, agree to share it with up to
 * SETTINGS.shareLimit businesses, and verify their phone by OTP. Businesses see masked
 * leads and spend credits to unlock contact details. Customers can withdraw or delete.
 */
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const { Requirement, ConsentRecord, OtpChallenge, Business, Unlock, CreditTxn } = require('../models/Marketplace');
const { CONSENT_VERSION, consentText, SETTINGS, CATEGORIES, CITIES, BUDGETS, TIMELINES } = require('../config/marketplace');

const router = express.Router();

const SECRET = () => process.env.JWT_SECRET || 'dev-only-marketplace-secret';
const DEV_OTP = () => process.env.NODE_ENV === 'development' && process.env.MARKETPLACE_DEV_OTP === 'true';
const CATEGORY_SLUGS = new Set(CATEGORIES.map(c => c.slug));
const CITY_SET = new Set(CITIES);

// ───────────── helpers ─────────────
const hmac = (value) => crypto.createHmac('sha256', SECRET()).update(String(value)).digest('hex');
const sha = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');
const clientIp = (req) => req.ip || req.headers['x-forwarded-for'] || '';

const normalisePhone = (raw) => {
    const digits = String(raw || '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || ''));
const fail = (res, status, message) => res.status(status).json({ success: false, message });

const maskName = (n) => (n ? `${n.trim()[0].toUpperCase()}***` : '—');
const maskPhone = (p) => (p ? `${p.slice(0, 2)}xxxxxx${p.slice(-2)}` : '—');
// Customers sometimes type contact details into the description; hide them until unlock.
const scrubContacts = (text) => String(text || '')
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[email hidden]')
    .replace(/(\+?\d[\d\s-]{6,}\d)/g, '[number hidden]');

const categoryName = (slug) => (CATEGORIES.find(c => c.slug === slug) || {}).name || slug;

const maskedLead = (r, unlockedIds = new Set()) => ({
    id: r._id,
    category: r.category,
    categoryName: categoryName(r.category),
    city: r.city,
    locality: r.locality,
    description: scrubContacts(r.description),
    budget: r.budget,
    timeline: r.timeline,
    name: maskName(r.name),
    phone: maskPhone(r.phone),
    email: r.email ? 'hidden until unlock' : 'not given',
    postedAt: r.createdAt,
    expiresAt: r.expiresAt,
    slotsLeft: Math.max(0, r.shareLimit - r.unlockCount),
    unlockedByMe: unlockedIds.has(String(r._id))
});

const fullLead = (r) => {
    const gone = r.status === 'withdrawn' || r.status === 'deleted';
    return {
        id: r._id,
        category: r.category,
        categoryName: categoryName(r.category),
        city: r.city,
        locality: r.locality,
        description: gone ? '' : r.description,
        budget: r.budget,
        timeline: r.timeline,
        name: gone ? null : r.name,
        phone: gone ? null : r.phone,
        email: gone ? null : (r.email || null),
        status: r.status,
        postedAt: r.createdAt,
        notice: gone ? 'The customer has withdrawn this request. Do not contact them about it.' : null
    };
};

const issueOtp = async (requirementId) => {
    const code = String(crypto.randomInt(100000, 1000000));
    await OtpChallenge.updateMany({ requirement: requirementId, used: false }, { used: true });
    const otp = await OtpChallenge.create({
        requirement: requirementId,
        codeHash: hmac(code),
        expiresAt: new Date(Date.now() + SETTINGS.otpTtlMinutes * 60 * 1000)
    });
    // TODO(production): send `code` by SMS through a DLT-registered provider (e.g. MSG91).
    if (DEV_OTP()) console.log(`[marketplace] DEV OTP for requirement ${requirementId}: ${code}`);
    return { otp, code };
};

const postLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 8, message: { success: false, message: 'Too many requests from this network. Please try again in an hour.' } });
const otpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, message: { success: false, message: 'Too many attempts. Please wait 15 minutes.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many attempts. Please wait 15 minutes.' } });

// ───────────── public: options ─────────────
router.get('/options', (req, res) => {
    res.json({
        success: true,
        categories: CATEGORIES,
        cities: CITIES,
        budgets: BUDGETS,
        timelines: TIMELINES,
        shareLimit: SETTINGS.shareLimit,
        consentVersion: CONSENT_VERSION,
        consentText: consentText(SETTINGS.shareLimit)
    });
});

// ───────────── customer: post a requirement ─────────────
router.post('/requirements', postLimiter, async (req, res) => {
    try {
        const b = req.body || {};
        if (b.website_url) return fail(res, 400, 'Request rejected.'); // honeypot: humans never fill this
        if (b.consent !== true) return fail(res, 400, 'Please tick the consent box so we can share your request with businesses.');
        if (!CATEGORY_SLUGS.has(b.category)) return fail(res, 400, 'Please choose a service category.');
        if (!CITY_SET.has(b.city)) return fail(res, 400, 'Please choose your city.');
        const description = String(b.description || '').trim();
        if (description.length < 15) return fail(res, 400, 'Please describe what you need in at least 15 characters.');
        const name = String(b.name || '').trim();
        if (name.length < 2) return fail(res, 400, 'Please enter your name.');
        const phone = normalisePhone(b.phone);
        if (!phone) return fail(res, 400, 'Please enter a valid 10-digit Indian mobile number.');
        const email = String(b.email || '').trim();
        if (email && !validEmail(email)) return fail(res, 400, 'Please enter a valid email or leave it blank.');
        if (b.budget && !BUDGETS.includes(b.budget)) return fail(res, 400, 'Invalid budget option.');
        if (b.timeline && !TIMELINES.includes(b.timeline)) return fail(res, 400, 'Invalid timeline option.');
        const pincode = String(b.pincode || '').trim();
        if (pincode && !/^\d{6}$/.test(pincode)) return fail(res, 400, 'Pincode must be 6 digits.');

        const phoneHash = hmac(phone);
        const since = new Date(Date.now() - SETTINGS.duplicateWindowHours * 3600 * 1000);
        const duplicate = await Requirement.findOne({ phoneHash, category: b.category, status: 'live', createdAt: { $gte: since } });
        if (duplicate) return fail(res, 409, 'You already posted a request for this service in the last 24 hours. Use your private link to manage it.');

        const ipHash = hmac(clientIp(req));
        const requirement = await Requirement.create({
            category: b.category, city: b.city, locality: String(b.locality || '').trim().slice(0, 80), pincode,
            description: description.slice(0, 1000), budget: b.budget, timeline: b.timeline,
            name: name.slice(0, 80), phone, email: email || undefined, phoneHash,
            shareLimit: SETTINGS.shareLimit, ipHash
        });

        await ConsentRecord.create({
            requirement: requirement._id,
            consentVersion: CONSENT_VERSION,
            consentText: consentText(SETTINGS.shareLimit),
            purpose: `Share this ${categoryName(b.category)} requirement with up to ${SETTINGS.shareLimit} matched businesses`,
            shareLimit: SETTINGS.shareLimit,
            phoneHash, ipHash,
            userAgent: String(req.get('user-agent') || '').slice(0, 200),
            events: [{ type: 'given' }]
        });

        const { code } = await issueOtp(requirement._id);
        res.status(201).json({
            success: true,
            requirementId: requirement._id,
            message: `We sent a 6-digit code to ${maskPhone(phone)}.`,
            ...(DEV_OTP() ? { devOtp: code } : {})
        });
    } catch (err) {
        console.error('[marketplace] post requirement:', err);
        fail(res, 500, 'Could not save your request. Please try again.');
    }
});

router.post('/requirements/:id/verify', otpLimiter, async (req, res) => {
    try {
        const requirement = await Requirement.findById(req.params.id);
        if (!requirement || requirement.status !== 'pending_otp') return fail(res, 404, 'This request is not waiting for verification.');
        const otp = await OtpChallenge.findOne({ requirement: requirement._id, used: false }).sort({ createdAt: -1 });
        if (!otp || otp.expiresAt < new Date()) return fail(res, 400, 'The code has expired. Please request a new one.');
        if (otp.attempts >= SETTINGS.otpMaxAttempts) return fail(res, 429, 'Too many wrong codes. Please request a new one.');

        const given = String((req.body || {}).code || '').trim();
        const ok = given.length === 6 && crypto.timingSafeEqual(Buffer.from(hmac(given)), Buffer.from(otp.codeHash));
        if (!ok) {
            otp.attempts += 1;
            await otp.save();
            return fail(res, 400, `Wrong code. ${SETTINGS.otpMaxAttempts - otp.attempts} attempts left.`);
        }

        otp.used = true;
        await otp.save();
        const manageToken = crypto.randomBytes(24).toString('hex');
        requirement.phoneVerified = true;
        requirement.status = 'live';
        requirement.manageTokenHash = sha(manageToken);
        requirement.expiresAt = new Date(Date.now() + SETTINGS.leadLifetimeDays * 86400 * 1000);
        await requirement.save();
        await ConsentRecord.updateOne({ requirement: requirement._id }, {
            phoneVerifiedAt: new Date(), $push: { events: { type: 'verified' } }
        });
        // TODO(production): also email/SMS the manage link to the customer.
        res.json({ success: true, manageToken, message: 'Your request is live. Matched businesses can now contact you.' });
    } catch (err) {
        console.error('[marketplace] verify:', err);
        fail(res, 500, 'Verification failed. Please try again.');
    }
});

router.post('/requirements/:id/resend-otp', otpLimiter, async (req, res) => {
    try {
        const requirement = await Requirement.findById(req.params.id);
        if (!requirement || requirement.status !== 'pending_otp') return fail(res, 404, 'This request is not waiting for verification.');
        const last = await OtpChallenge.findOne({ requirement: requirement._id }).sort({ createdAt: -1 });
        const resends = last ? last.resends : 0;
        if (resends >= SETTINGS.otpMaxResends) return fail(res, 429, 'Maximum resends reached. Please post your request again later.');
        if (last && Date.now() - last.createdAt.getTime() < 30 * 1000) return fail(res, 429, 'Please wait 30 seconds before asking for a new code.');
        const { otp, code } = await issueOtp(requirement._id);
        otp.resends = resends + 1;
        await otp.save();
        res.json({ success: true, message: `New code sent to ${maskPhone(requirement.phone)}.`, ...(DEV_OTP() ? { devOtp: code } : {}) });
    } catch (err) {
        console.error('[marketplace] resend:', err);
        fail(res, 500, 'Could not send a new code.');
    }
});

// ───────────── customer: manage own request (private link) ─────────────
const findByToken = (token) => Requirement.findOne({ manageTokenHash: sha(String(token || '')) });

router.get('/manage/:token', async (req, res) => {
    const r = await findByToken(req.params.token);
    if (!r) return fail(res, 404, 'This link is not valid.');
    const unlocks = await Unlock.find({ requirement: r._id }).populate('business', 'businessName phone cities').sort({ createdAt: 1 });
    const consent = await ConsentRecord.findOne({ requirement: r._id }).select('consentVersion consentText givenAt phoneVerifiedAt withdrawnAt deletedAt');
    res.json({
        success: true,
        requirement: {
            ...fullLead(r),
            description: r.description, name: r.name, phone: r.phone, email: r.email,
            shareLimit: r.shareLimit, unlockCount: r.unlockCount, expiresAt: r.expiresAt
        },
        sharedWith: unlocks.map(u => ({
            businessName: u.business ? u.business.businessName : 'Business removed',
            phone: u.business ? u.business.phone : null,
            at: u.createdAt
        })),
        consent
    });
});

router.post('/manage/:token/withdraw', async (req, res) => {
    const r = await findByToken(req.params.token);
    if (!r) return fail(res, 404, 'This link is not valid.');
    if (r.status === 'deleted') return fail(res, 400, 'This request was already deleted.');
    r.status = 'withdrawn';
    await r.save();
    await ConsentRecord.updateOne({ requirement: r._id }, { withdrawnAt: new Date(), $push: { events: { type: 'withdrawn' } } });
    res.json({ success: true, message: 'Your request is withdrawn. No new business can see it, and businesses that already unlocked it are told not to contact you.' });
});

router.post('/manage/:token/delete', async (req, res) => {
    const r = await findByToken(req.params.token);
    if (!r) return fail(res, 404, 'This link is not valid.');
    r.set({
        status: 'deleted', name: undefined, phone: undefined, email: undefined,
        description: '[deleted by customer]', locality: undefined, pincode: undefined,
        manageTokenHash: undefined, ipHash: undefined
    });
    await r.save();
    await OtpChallenge.deleteMany({ requirement: r._id });
    await ConsentRecord.updateOne({ requirement: r._id }, {
        deletedAt: new Date(), withdrawnAt: new Date(), $unset: { ipHash: 1, userAgent: 1 },
        $push: { events: { type: 'deleted' } }
    });
    res.json({ success: true, message: 'Your personal details have been deleted from BrandMark. This private link no longer works.' });
});

// ───────────── business auth ─────────────
const businessAuth = async (req, res, next) => {
    try {
        const token = (req.header('Authorization') || '').replace('Bearer ', '');
        const decoded = jwt.verify(token, SECRET());
        if (decoded.typ !== 'mp_business') throw new Error('wrong token type');
        const business = await Business.findById(decoded.bid);
        if (!business) throw new Error('not found');
        if (business.status === 'suspended') return fail(res, 403, 'This business account is suspended. Contact BrandMark.');
        req.business = business;
        next();
    } catch (e) {
        fail(res, 401, 'Please log in again.');
    }
};
const businessToken = (b) => jwt.sign({ bid: b._id, typ: 'mp_business' }, SECRET(), { expiresIn: '7d' });
const publicBusiness = (b) => ({
    id: b._id, businessName: b.businessName, ownerName: b.ownerName, email: b.email, phone: b.phone,
    categories: b.categories, cities: b.cities, gstin: b.gstin, website: b.website,
    status: b.status, credits: b.credits, createdAt: b.createdAt
});
const cleanLists = (categories, cities) => ({
    categories: [...new Set((Array.isArray(categories) ? categories : []).filter(c => CATEGORY_SLUGS.has(c)))],
    cities: [...new Set((Array.isArray(cities) ? cities : []).filter(c => CITY_SET.has(c)))]
});

router.post('/business/register', authLimiter, async (req, res) => {
    try {
        const b = req.body || {};
        if (b.website_url) return fail(res, 400, 'Request rejected.');
        if (b.acceptTerms !== true) return fail(res, 400, 'Please accept the lead usage terms.');
        const businessName = String(b.businessName || '').trim();
        const ownerName = String(b.ownerName || '').trim();
        if (businessName.length < 2 || ownerName.length < 2) return fail(res, 400, 'Please enter the business name and owner name.');
        const email = String(b.email || '').trim().toLowerCase();
        if (!validEmail(email)) return fail(res, 400, 'Please enter a valid email.');
        const phone = normalisePhone(b.phone);
        if (!phone) return fail(res, 400, 'Please enter a valid 10-digit mobile number.');
        if (String(b.password || '').length < 8) return fail(res, 400, 'Password must be at least 8 characters.');
        const { categories, cities } = cleanLists(b.categories, b.cities);
        if (!categories.length || !cities.length) return fail(res, 400, 'Choose at least one category and one city.');
        const gstin = String(b.gstin || '').trim().toUpperCase();
        if (gstin && !/^[0-9]{2}[A-Z0-9]{13}$/.test(gstin)) return fail(res, 400, 'GSTIN should be 15 characters, or leave it blank.');
        if (await Business.findOne({ email })) return fail(res, 409, 'An account with this email already exists. Please log in.');

        const business = await Business.create({
            businessName, ownerName, email, phone, categories, cities, gstin: gstin || undefined,
            website: String(b.website || '').trim().slice(0, 200) || undefined,
            passwordHash: await bcrypt.hash(String(b.password), 10),
            termsAcceptedAt: new Date()
        });
        res.status(201).json({ success: true, token: businessToken(business), business: publicBusiness(business) });
    } catch (err) {
        console.error('[marketplace] register:', err);
        fail(res, 500, 'Could not create the account.');
    }
});

router.post('/business/login', authLimiter, async (req, res) => {
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const business = await Business.findOne({ email });
    if (!business || !(await bcrypt.compare(String((req.body || {}).password || ''), business.passwordHash))) {
        return fail(res, 401, 'Wrong email or password.');
    }
    if (business.status === 'suspended') return fail(res, 403, 'This business account is suspended. Contact BrandMark.');
    res.json({ success: true, token: businessToken(business), business: publicBusiness(business) });
});

router.get('/business/me', businessAuth, (req, res) => res.json({ success: true, business: publicBusiness(req.business) }));

router.put('/business/me', businessAuth, async (req, res) => {
    const { categories, cities } = cleanLists((req.body || {}).categories, (req.body || {}).cities);
    if (!categories.length || !cities.length) return fail(res, 400, 'Choose at least one category and one city.');
    req.business.categories = categories;
    req.business.cities = cities;
    await req.business.save();
    res.json({ success: true, business: publicBusiness(req.business) });
});

// Search masked leads by category + city (defaults to the business's own choices)
router.get('/business/leads', businessAuth, async (req, res) => {
    const category = req.query.category && CATEGORY_SLUGS.has(req.query.category) ? [req.query.category] : req.business.categories;
    const city = req.query.city && CITY_SET.has(req.query.city) ? [req.query.city] : req.business.cities;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 20;
    const filter = {
        status: 'live',
        category: { $in: category },
        city: { $in: city },
        expiresAt: { $gt: new Date() },
        $expr: { $lt: ['$unlockCount', '$shareLimit'] }
    };
    const myUnlocks = await Unlock.find({ business: req.business._id }).select('requirement');
    const unlockedIds = new Set(myUnlocks.map(u => String(u.requirement)));
    const [total, leads] = await Promise.all([
        Requirement.countDocuments(filter),
        Requirement.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    ]);
    res.json({ success: true, total, page, pages: Math.ceil(total / limit), leads: leads.map(r => maskedLead(r, unlockedIds)) });
});

router.post('/business/leads/:id/unlock', businessAuth, async (req, res) => {
    const business = req.business;
    if (business.status !== 'approved') return fail(res, 403, 'Your account is waiting for BrandMark verification. You can unlock leads once it is approved.');
    if (business.credits < SETTINGS.unlockCost) return fail(res, 402, 'You have no credits left. Contact BrandMark to add credits.');

    const existing = await Unlock.findOne({ business: business._id, requirement: req.params.id });
    if (existing) {
        const r = await Requirement.findById(req.params.id);
        return res.json({ success: true, alreadyUnlocked: true, lead: fullLead(r), credits: business.credits });
    }

    // 1) reserve a share slot atomically (enforces the per-lead share limit)
    const reserved = await Requirement.findOneAndUpdate(
        { _id: req.params.id, status: 'live', expiresAt: { $gt: new Date() }, category: { $in: business.categories }, $expr: { $lt: ['$unlockCount', '$shareLimit'] } },
        { $inc: { unlockCount: 1 } },
        { new: true }
    );
    if (!reserved) return fail(res, 409, 'This lead is no longer available, has reached its share limit, or is outside your categories.');

    // 2) take a credit atomically; roll back the slot if that fails
    const charged = await Business.findOneAndUpdate(
        { _id: business._id, credits: { $gte: SETTINGS.unlockCost } },
        { $inc: { credits: -SETTINGS.unlockCost } },
        { new: true }
    );
    if (!charged) {
        await Requirement.updateOne({ _id: reserved._id }, { $inc: { unlockCount: -1 } });
        return fail(res, 402, 'You have no credits left. Contact BrandMark to add credits.');
    }

    try {
        const unlock = await Unlock.create({ business: business._id, requirement: reserved._id, creditsSpent: SETTINGS.unlockCost });
        await CreditTxn.create({ business: business._id, delta: -SETTINGS.unlockCost, reason: 'unlock', ref: unlock._id });
        await ConsentRecord.updateOne({ requirement: reserved._id }, { $push: { events: { type: 'shared', business: business._id } } });
        res.json({ success: true, lead: fullLead(reserved), credits: charged.credits });
    } catch (err) {
        // duplicate unlock race: undo both
        await Requirement.updateOne({ _id: reserved._id }, { $inc: { unlockCount: -1 } });
        await Business.updateOne({ _id: business._id }, { $inc: { credits: SETTINGS.unlockCost } });
        fail(res, 409, 'This lead is already unlocked on your account.');
    }
});

router.get('/business/unlocked', businessAuth, async (req, res) => {
    const unlocks = await Unlock.find({ business: req.business._id }).populate('requirement').sort({ createdAt: -1 }).limit(200);
    res.json({
        success: true,
        unlocked: unlocks.filter(u => u.requirement).map(u => ({
            unlockId: u._id, unlockedAt: u.createdAt, reportStatus: u.reportStatus, ...fullLead(u.requirement)
        }))
    });
});

router.post('/business/unlocked/:unlockId/report', businessAuth, async (req, res) => {
    const reason = String((req.body || {}).reason || '').trim();
    if (reason.length < 5) return fail(res, 400, 'Please say what was wrong with this lead.');
    const unlock = await Unlock.findOne({ _id: req.params.unlockId, business: req.business._id });
    if (!unlock) return fail(res, 404, 'Unlock not found.');
    if (unlock.reportStatus !== 'none') return fail(res, 400, 'You already reported this lead.');
    unlock.reported = true;
    unlock.reportReason = reason.slice(0, 300);
    unlock.reportStatus = 'open';
    await unlock.save();
    res.json({ success: true, message: 'Thanks. BrandMark will review it and refund the credit if the lead was fake or unreachable.' });
});

// ───────────── admin (existing BrandMark admin accounts) ─────────────
// Token login so the admin panel works when the website and API are on different domains
// (cookies set by the API domain are not sent cross-site). The shared `auth` middleware accepts Bearer tokens.
router.post('/admin/login', authLimiter, async (req, res) => {
    const Admin = require('../models/Admin');
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const found = email ? await Admin.findOne({ email }) : null;
    if (!found || !found.isActive || !(await found.comparePassword(String((req.body || {}).password || '')))) {
        return fail(res, 401, 'Wrong email or password.');
    }
    if (!['admin', 'superadmin'].includes(found.role)) return fail(res, 403, 'Admin access required.');
    found.lastLogin = Date.now();
    await found.save();
    const token = jwt.sign(
        { id: found._id, email: found.email, role: found.role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production', // same fallback as middleware/auth.js
        { expiresIn: '12h' }
    );
    res.json({ success: true, token, admin: { name: found.name, email: found.email, role: found.role } });
});

const admin = [auth, isAdmin];

router.get('/admin/overview', admin, async (req, res) => {
    const [live, pending, withdrawn, businesses, pendingBusinesses, unlocks, openReports] = await Promise.all([
        Requirement.countDocuments({ status: 'live' }),
        Requirement.countDocuments({ status: 'pending_otp' }),
        Requirement.countDocuments({ status: { $in: ['withdrawn', 'deleted'] } }),
        Business.countDocuments({}),
        Business.countDocuments({ status: 'pending' }),
        Unlock.countDocuments({}),
        Unlock.countDocuments({ reportStatus: 'open' })
    ]);
    res.json({ success: true, stats: { live, pending, withdrawn, businesses, pendingBusinesses, unlocks, openReports } });
});

router.get('/admin/businesses', admin, async (req, res) => {
    const filter = req.query.status ? { status: req.query.status } : {};
    const list = await Business.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, businesses: list.map(publicBusiness) });
});

router.post('/admin/businesses/:id/status', admin, async (req, res) => {
    const status = (req.body || {}).status;
    if (!['pending', 'approved', 'suspended'].includes(status)) return fail(res, 400, 'Invalid status.');
    const b = await Business.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!b) return fail(res, 404, 'Business not found.');
    res.json({ success: true, business: publicBusiness(b) });
});

router.post('/admin/businesses/:id/credits', admin, async (req, res) => {
    const amount = parseInt((req.body || {}).amount, 10);
    if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 1000) return fail(res, 400, 'Amount must be a whole number between -1000 and 1000.');
    const b = await Business.findOneAndUpdate(
        { _id: req.params.id, ...(amount < 0 ? { credits: { $gte: -amount } } : {}) },
        { $inc: { credits: amount } }, { new: true }
    );
    if (!b) return fail(res, 400, 'Business not found, or not enough credits to remove.');
    await CreditTxn.create({ business: b._id, delta: amount, reason: 'admin_grant', note: String((req.body || {}).note || '').slice(0, 200), by: req.admin.email });
    res.json({ success: true, business: publicBusiness(b) });
});

router.get('/admin/requirements', admin, async (req, res) => {
    const filter = req.query.status ? { status: req.query.status } : {};
    const list = await Requirement.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({
        success: true,
        requirements: list.map(r => ({
            ...fullLead(r), name: r.name, phone: r.phone, email: r.email, description: r.description,
            phoneVerified: r.phoneVerified, unlockCount: r.unlockCount, shareLimit: r.shareLimit, expiresAt: r.expiresAt
        }))
    });
});

router.post('/admin/requirements/:id/status', admin, async (req, res) => {
    const status = (req.body || {}).status;
    if (!['live', 'rejected'].includes(status)) return fail(res, 400, 'Admins can set a lead to live or rejected.');
    const r = await Requirement.findOne({ _id: req.params.id, status: { $in: ['live', 'rejected'] } });
    if (!r) return fail(res, 404, 'Lead not found, or it is withdrawn/deleted/unverified.');
    r.status = status;
    await r.save();
    await ConsentRecord.updateOne({ requirement: r._id }, { $push: { events: { type: status === 'rejected' ? 'rejected' : 'restored', note: req.admin.email } } });
    res.json({ success: true });
});

router.get('/admin/reports', admin, async (req, res) => {
    const list = await Unlock.find({ reportStatus: 'open' }).populate('business', 'businessName email').populate('requirement', 'category city name phone').sort({ updatedAt: -1 });
    res.json({
        success: true,
        reports: list.map(u => ({
            unlockId: u._id, reason: u.reportReason, at: u.updatedAt,
            business: u.business && u.business.businessName,
            lead: u.requirement && { id: u.requirement._id, category: categoryName(u.requirement.category), city: u.requirement.city, name: u.requirement.name, phone: u.requirement.phone }
        }))
    });
});

router.post('/admin/reports/:unlockId/resolve', admin, async (req, res) => {
    const refund = (req.body || {}).refund === true;
    const unlock = await Unlock.findOneAndUpdate({ _id: req.params.unlockId, reportStatus: 'open' }, { reportStatus: refund ? 'refunded' : 'declined' }, { new: true });
    if (!unlock) return fail(res, 404, 'Open report not found.');
    if (refund) {
        await Business.updateOne({ _id: unlock.business }, { $inc: { credits: unlock.creditsSpent } });
        await CreditTxn.create({ business: unlock.business, delta: unlock.creditsSpent, reason: 'refund', ref: unlock._id, by: req.admin.email });
    }
    res.json({ success: true });
});

router.get('/admin/consents', admin, async (req, res) => {
    const list = await ConsentRecord.find({}).sort({ givenAt: -1 }).limit(200).populate('events.business', 'businessName');
    res.json({
        success: true,
        consents: list.map(c => ({
            id: c._id, requirement: c.requirement, consentVersion: c.consentVersion, purpose: c.purpose,
            givenAt: c.givenAt, phoneVerifiedAt: c.phoneVerifiedAt, withdrawnAt: c.withdrawnAt, deletedAt: c.deletedAt,
            events: c.events.map(e => ({ type: e.type, at: e.at, business: e.business && e.business.businessName }))
        }))
    });
});

// Reject malformed ids early with a clear 404 instead of a database cast error
const mongoose = require('mongoose');
['id', 'unlockId'].forEach(p => router.param(p, (req, res, next, value) =>
    (mongoose.isValidObjectId(value) ? next() : fail(res, 404, 'Not found.'))));

// Express 4 does not catch errors from async handlers; forward them to the error handler.
router.stack.forEach(layer => layer.route && layer.route.stack.forEach(l => {
    const handle = l.handle;
    if (handle.length >= 4) return;
    l.handle = (req, res, next) => {
        try {
            const out = handle(req, res, next);
            if (out && typeof out.catch === 'function') out.catch(next);
        } catch (e) { next(e); }
    };
}));

module.exports = router;
