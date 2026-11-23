import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { mp, businessToken } from '../../lib/marketplaceApi';
import { Shell, Card, Label, Input, Button, ErrorBox, Chips } from './ui';

export const BusinessAuth = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const isSignup = mode === 'signup';
  const [opts, setOpts] = useState(null);
  const [form, setForm] = useState({ businessName: '', ownerName: '', email: '', phone: '', password: '', gstin: '', website: '', categories: [], cities: ['Patna'], acceptTerms: false, website_url: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (isSignup) mp('/options').then(setOpts).catch((e) => setError(e.message)); }, [isSignup]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const body = isSignup ? form : { email: form.email, password: form.password };
      const data = await mp(isSignup ? '/business/register' : '/business/login', { method: 'POST', body });
      businessToken.set(data.token);
      navigate('/business/leads');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <>
      <Helmet><title>{isSignup ? 'Register Your Business' : 'Business Login'} | BrandMark Connect</title><meta name="robots" content="noindex" /></Helmet>
      <Shell narrow>
        <h1 className="text-3xl font-extrabold text-brand-navy mb-2">{isSignup ? 'Register your business' : 'Business login'}</h1>
        <p className="text-brand-text-muted mb-8">
          {isSignup ? 'Choose the services you offer and the cities you serve. BrandMark checks every business before it can unlock leads.' : 'See customer requests that match your business.'}
        </p>
        <Card>
          <form onSubmit={submit} className="space-y-5" noValidate>
            {isSignup && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label htmlFor="businessName">Business name *</Label><Input id="businessName" value={form.businessName} onChange={set('businessName')} /></div>
                <div><Label htmlFor="ownerName">Owner / contact name *</Label><Input id="ownerName" value={form.ownerName} onChange={set('ownerName')} /></div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} /></div>
              {isSignup && <div><Label htmlFor="phone">Mobile *</Label><Input id="phone" inputMode="tel" value={form.phone} onChange={set('phone')} /></div>}
              <div className={isSignup ? 'sm:col-span-2' : ''}>
                <Label htmlFor="password">Password *{isSignup ? ' (min 8 characters)' : ''}</Label>
                <Input id="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} />
              </div>
            </div>
            {isSignup && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="gstin">GSTIN (optional, speeds up verification)</Label><Input id="gstin" value={form.gstin} onChange={set('gstin')} maxLength={15} /></div>
                  <div><Label htmlFor="website">Website (optional)</Label><Input id="website" value={form.website} onChange={set('website')} /></div>
                </div>
                <div>
                  <Label>Services you offer *</Label>
                  <Chips options={opts?.categories || []} value={form.categories} onChange={(v) => setForm({ ...form, categories: v })} getKey={(c) => c.slug} getLabel={(c) => c.name} />
                </div>
                <div>
                  <Label>Cities you serve *</Label>
                  <Chips options={opts?.cities || []} value={form.cities} onChange={(v) => setForm({ ...form, cities: v })} />
                </div>
                <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={form.website_url} onChange={set('website_url')} /></div>
                <label className="flex gap-3 items-start rounded-xl bg-brand-bg-light p-4 border border-brand-border-light cursor-pointer">
                  <input type="checkbox" checked={form.acceptTerms} onChange={set('acceptTerms')} className="mt-1 h-5 w-5 accent-brand-orange" />
                  <span className="text-sm">
                    I will contact customers only about the requirement they posted, will not resell or share their details,
                    will not add them to marketing lists, and will stop contacting anyone who withdraws or asks me to stop.
                  </span>
                </label>
              </>
            )}
            <ErrorBox>{error}</ErrorBox>
            <Button type="submit" disabled={busy || (isSignup && (!form.acceptTerms || !opts))} className="w-full">
              {busy ? 'Please wait…' : isSignup ? 'Create business account' : 'Log in'}
            </Button>
            <p className="text-sm text-center text-brand-text-muted">
              {isSignup ? <>Already registered? <Link className="text-brand-orange underline" to="/business/login">Log in</Link></>
                : <>New here? <Link className="text-brand-orange underline" to="/business/signup">Register your business</Link></>}
            </p>
          </form>
        </Card>
      </Shell>
    </>
  );
};

export const BusinessSignup = () => <BusinessAuth mode="signup" />;
export const BusinessLogin = () => <BusinessAuth mode="login" />;
export default BusinessAuth;
