/**
 * BrandMark Lead Marketplace — shared settings.
 * Consent-based only: every lead is a customer who asked to be contacted.
 */

const CONSENT_VERSION = 'v1-2026-11';

const consentText = (shareLimit) =>
    `I agree that BrandMark Media Solutions Pvt. Ltd. may share my name, phone number, email and this requirement ` +
    `with up to ${shareLimit} verified businesses that offer this service in my area, so that they can contact me ` +
    `about this requirement only. I can withdraw or delete my request at any time using my private link.`;

const SETTINGS = {
    shareLimit: 4,            // max businesses that can unlock one lead
    leadLifetimeDays: 30,     // lead hidden from search after this
    unlockCost: 1,            // credits per unlock
    otpTtlMinutes: 10,
    otpMaxAttempts: 5,
    otpMaxResends: 3,
    duplicateWindowHours: 24
};

const CATEGORIES = [
    { slug: 'digital-marketing', name: 'Digital Marketing' },
    { slug: 'website-development', name: 'Website Development' },
    { slug: 'graphic-design', name: 'Graphic Design & Branding' },
    { slug: 'photography', name: 'Photography' },
    { slug: 'videography', name: 'Videography' },
    { slug: 'wedding-planning', name: 'Wedding Planning' },
    { slug: 'event-management', name: 'Event Management' },
    { slug: 'catering', name: 'Catering' },
    { slug: 'interior-design', name: 'Interior Design' },
    { slug: 'home-construction', name: 'Home Construction' },
    { slug: 'electrician', name: 'Electrician' },
    { slug: 'plumber', name: 'Plumber' },
    { slug: 'carpenter', name: 'Carpenter' },
    { slug: 'painting', name: 'Painting' },
    { slug: 'ac-repair', name: 'AC & Appliance Repair' },
    { slug: 'packers-movers', name: 'Packers & Movers' },
    { slug: 'pest-control', name: 'Pest Control' },
    { slug: 'cleaning', name: 'Home & Office Cleaning' },
    { slug: 'tutoring', name: 'Tutoring & Coaching' },
    { slug: 'ca-accounting', name: 'CA, Accounting & GST' },
    { slug: 'legal', name: 'Legal Services' },
    { slug: 'real-estate', name: 'Real Estate' },
    { slug: 'travel', name: 'Travel & Tours' },
    { slug: 'car-rental', name: 'Car Rental' },
    { slug: 'beauty-salon', name: 'Beauty & Salon' },
    { slug: 'fitness', name: 'Fitness & Yoga' },
    { slug: 'healthcare', name: 'Clinics & Healthcare' },
    { slug: 'printing', name: 'Printing & Signage' },
    { slug: 'it-support', name: 'IT Support & Software' },
    { slug: 'other', name: 'Other Services' }
];

const CITIES = [
    'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai',
    'Katihar', 'Munger', 'Chhapra', 'Hajipur', 'Sasaram', 'Bihar Sharif', 'Motihari', 'Siwan',
    'Bettiah', 'Samastipur', 'Buxar', 'Nalanda', 'Ranchi', 'Kolkata', 'Delhi', 'Lucknow', 'Varanasi'
];

const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹50,000', '₹50,000 – ₹2 lakh', '₹2 lakh – ₹10 lakh', 'Above ₹10 lakh', 'Not sure yet'];
const TIMELINES = ['Immediately', 'Within 1 week', 'Within 1 month', 'In 1–3 months', 'Just exploring'];

module.exports = { CONSENT_VERSION, consentText, SETTINGS, CATEGORIES, CITIES, BUDGETS, TIMELINES };
