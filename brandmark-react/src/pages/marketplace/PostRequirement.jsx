import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { mp } from '../../lib/marketplaceApi';
import { Shell, Card, Label, Input, Textarea, Select, Button, ErrorBox } from './ui';

const empty = { category: '', city: 'Patna', locality: '', pincode: '', description: '', budget: '', timeline: '', name: '', phone: '', email: '', consent: false, website_url: '' };

export const PostRequirement = () => {
  const [opts, setOpts] = useState(null);
  const [form, setForm] = useState(empty);
  const [step, setStep] = useState('form'); // form | otp | done
  const [reqId, setReqId] = useState(null);
  const [notice, setNotice] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [code, setCode] = useState('');
  const [manageToken, setManageToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { mp('/options').then(setOpts).catch((e) => setError(e.message)); }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const data = await mp('/requirements', { method: 'POST', body: form });
      setReqId(data.requirementId); setNotice(data.message); setDevOtp(data.devOtp || ''); setStep('otp');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const data = await mp(`/requirements/${reqId}/verify`, { method: 'POST', body: { code } });
      setManageToken(data.manageToken); setStep('done');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const resend = async () => {
    setError('');
    try {
      const data = await mp(`/requirements/${reqId}/resend-otp`, { method: 'POST', body: {} });
      setNotice(data.message); setDevOtp(data.devOtp || '');
    } catch (err) { setError(err.message); }
  };

  const manageUrl = manageToken ? `${window.location.origin}/leads/manage/${manageToken}` : '';

  return (
    <>
      <SEO title="Post Your Requirement | BrandMark Connect" description="Tell us the service you need. With your consent, up to 4 verified local businesses can contact you." canonicalUrl="https://www.brandmarksolutions.site/leads/post" />
      <Shell narrow>
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-2">Post your requirement</h1>
        <p className="text-brand-text-muted mb-8">Free for customers. Takes about a minute.</p>

        {step === 'form' && (
          <Card>
            <form onSubmit={submit} className="space-y-5" noValidate>
              <div>
                <Label htmlFor="category">What service do you need? *</Label>
                <Select id="category" value={form.category} onChange={set('category')} required>
                  <option value="">Choose a category</option>
                  {opts?.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </Select>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select id="city" value={form.city} onChange={set('city')}>
                    {opts?.cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="locality">Area / locality</Label>
                  <Input id="locality" value={form.locality} onChange={set('locality')} placeholder="e.g. Boring Road" maxLength={80} />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" value={form.pincode} onChange={set('pincode')} inputMode="numeric" maxLength={6} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Describe what you need *</Label>
                <Textarea id="description" rows={4} value={form.description} onChange={set('description')} maxLength={1000} placeholder="e.g. Need a photographer for a wedding on 14 December, about 200 guests." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Select id="budget" value={form.budget} onChange={set('budget')}>
                    <option value="">Select</option>
                    {opts?.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeline">When do you need it?</Label>
                  <Select id="timeline" value={form.timeline} onChange={set('timeline')}>
                    <option value="">Select</option>
                    {opts?.timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
              </div>
              <hr className="border-brand-border-light" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your name *</Label>
                  <Input id="name" value={form.name} onChange={set('name')} autoComplete="name" maxLength={80} />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile number *</Label>
                  <Input id="phone" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              </div>
              {/* Honeypot: hidden from people, bots fill it */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_url">Website</label>
                <input id="website_url" tabIndex={-1} autoComplete="off" value={form.website_url} onChange={set('website_url')} />
              </div>
              <label className="flex gap-3 items-start rounded-xl bg-brand-bg-light p-4 border border-brand-border-light cursor-pointer">
                <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 h-5 w-5 accent-brand-orange" />
                <span className="text-sm text-brand-text-body">
                  {opts?.consentText || 'Loading consent text…'}{' '}
                  <Link to="/privacy-policy" className="text-brand-orange underline">Privacy policy</Link>
                </span>
              </label>
              <ErrorBox>{error}</ErrorBox>
              <Button type="submit" disabled={busy || !opts || !form.consent} className="w-full">
                {busy ? 'Sending…' : 'Continue — verify my number'}
              </Button>
            </form>
          </Card>
        )}

        {step === 'otp' && (
          <Card>
            <form onSubmit={verify} className="space-y-5">
              <h2 className="text-xl font-bold text-brand-navy">Verify your mobile number</h2>
              <p className="text-brand-text-muted">{notice} Your request goes live only after this step.</p>
              {devOtp && (
                <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-900">
                  Local test mode: no SMS is sent. Your code is <strong className="tracking-widest">{devOtp}</strong>
                </div>
              )}
              <div>
                <Label htmlFor="otp">6-digit code</Label>
                <Input id="otp" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="tracking-[0.4em] text-lg" />
              </div>
              <ErrorBox>{error}</ErrorBox>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Verify and publish'}</Button>
                <Button type="button" variant="ghost" onClick={resend}>Send a new code</Button>
              </div>
            </form>
          </Card>
        )}

        {step === 'done' && (
          <Card className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Your request is live</h2>
            <p className="text-brand-text-muted mb-6">
              Up to {opts?.shareLimit || 4} verified businesses can now contact you. Save your private link. You can use it to see who has your details, or to withdraw or delete your request.
            </p>
            <div className="rounded-xl bg-brand-bg-light border border-brand-border-light p-3 text-sm break-all text-brand-navy mb-4" data-testid="manage-link">{manageUrl}</div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button type="button" variant="ghost" onClick={() => navigator.clipboard?.writeText(manageUrl)}>Copy link</Button>
              <Link to={`/leads/manage/${manageToken}`} className="rounded-xl bg-brand-navy text-white font-semibold px-5 py-2.5">Open my request</Link>
            </div>
          </Card>
        )}
      </Shell>
    </>
  );
};

export default PostRequirement;
