import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Unlock, Phone, Mail, MapPin } from 'lucide-react';
import { mp, businessToken, fmtDate } from '../../lib/marketplaceApi';
import { Shell, Card, Select, Button, ErrorBox, Pill, Chips, Label } from './ui';

export const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [opts, setOpts] = useState(null);
  const [tab, setTab] = useState('search');
  const [filters, setFilters] = useState({ category: '', city: '' });
  const [result, setResult] = useState(null);
  const [unlocked, setUnlocked] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [profile, setProfile] = useState(null);

  const onAuthError = useCallback((e) => {
    if (e.status === 401) { businessToken.clear(); navigate('/business/login'); } else setError(e.message);
  }, [navigate]);

  useEffect(() => {
    if (!businessToken.get()) { navigate('/business/login'); return; }
    mp('/business/me', { business: true }).then((d) => { setMe(d.business); setProfile({ categories: d.business.categories, cities: d.business.cities }); }).catch(onAuthError);
    mp('/options').then(setOpts).catch(() => {});
  }, [navigate, onAuthError]);

  const search = useCallback(async () => {
    setError('');
    const q = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
    try { setResult(await mp(`/business/leads${q ? `?${q}` : ''}`, { business: true })); } catch (e) { onAuthError(e); }
  }, [filters, onAuthError]);

  const loadUnlocked = useCallback(async () => {
    try { setUnlocked((await mp('/business/unlocked', { business: true })).unlocked); } catch (e) { onAuthError(e); }
  }, [onAuthError]);

  useEffect(() => { if (me) { search(); loadUnlocked(); } }, [me]); // eslint-disable-line react-hooks/exhaustive-deps

  const unlock = async (lead) => {
    setError(''); setBusyId(lead.id);
    try {
      const d = await mp(`/business/leads/${lead.id}/unlock`, { method: 'POST', body: {}, business: true });
      setMe({ ...me, credits: d.credits });
      await Promise.all([search(), loadUnlocked()]);
      setTab('unlocked');
    } catch (e) { onAuthError(e); } finally { setBusyId(null); }
  };

  const report = async (u) => {
    const reason = window.prompt('What was wrong with this lead? (e.g. wrong number, not a real requirement)');
    if (!reason) return;
    try { const d = await mp(`/business/unlocked/${u.unlockId}/report`, { method: 'POST', body: { reason }, business: true }); window.alert(d.message); loadUnlocked(); } catch (e) { onAuthError(e); }
  };

  const saveProfile = async () => {
    setError('');
    try { const d = await mp('/business/me', { method: 'PUT', body: profile, business: true }); setMe(d.business); search(); setTab('search'); } catch (e) { onAuthError(e); }
  };

  const logout = () => { businessToken.clear(); navigate('/business/login'); };
  if (!me) return <Shell><p className="text-brand-text-muted">Loading…</p><ErrorBox>{error}</ErrorBox></Shell>;

  const catName = (slug) => opts?.categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <>
      <Helmet><title>Leads Dashboard | BrandMark Connect</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Shell>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy">{me.businessName}</h1>
            <p className="text-brand-text-muted text-sm">{me.categories.map(catName).join(', ')} · {me.cities.join(', ')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Pill tone={me.status === 'approved' ? 'green' : 'orange'}>{me.status === 'approved' ? 'Verified' : 'Awaiting verification'}</Pill>
            <span className="rounded-xl bg-white border border-brand-border-light px-4 py-2 font-bold text-brand-navy" data-testid="credits">{me.credits} credits</span>
            <Button variant="ghost" onClick={logout}>Log out</Button>
          </div>
        </div>

        {me.status !== 'approved' && (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 mb-6 text-sm">
            BrandMark is checking your business. You can browse masked leads now; you can unlock contact details once you are verified and have credits.
          </div>
        )}

        <div className="flex gap-2 mb-6" role="tablist">
          {[['search', 'Find leads'], ['unlocked', `My unlocked leads (${unlocked.length})`], ['profile', 'Categories & cities']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`rounded-xl px-4 py-2 font-semibold text-sm ${tab === k ? 'bg-brand-navy text-white' : 'bg-white border border-brand-border-light text-brand-navy'}`}>{l}</button>
          ))}
        </div>
        <div className="mb-4"><ErrorBox>{error}</ErrorBox></div>

        {tab === 'search' && (
          <>
            <Card className="mb-6">
              <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="f-cat">Category</Label>
                  <Select id="f-cat" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All my categories</option>
                    {me.categories.map((c) => <option key={c} value={c}>{catName(c)}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="f-city">City</Label>
                  <Select id="f-city" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
                    <option value="">All my cities</option>
                    {me.cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <Button onClick={search}>Search leads</Button>
              </div>
            </Card>
            {result && <p className="text-sm text-brand-text-muted mb-3">{result.total} matching lead{result.total === 1 ? '' : 's'}</p>}
            {result?.leads.length === 0 && <Card><p className="text-brand-text-muted">No open requests match yet. New customer requests appear here as soon as they are verified.</p></Card>}
            <div className="grid md:grid-cols-2 gap-4">
              {result?.leads.map((l) => (
                <Card key={l.id} className="flex flex-col" >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Pill tone="orange">{l.categoryName}</Pill>
                    <span className="text-xs text-brand-text-muted">Posted {fmtDate(l.postedAt)}</span>
                  </div>
                  <p className="text-brand-text-body mb-3 flex-1">{l.description}</p>
                  <div className="text-sm text-brand-text-muted space-y-1 mb-4">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" aria-hidden="true" />{l.city}{l.locality ? `, ${l.locality}` : ''}</p>
                    <p>Budget: {l.budget || 'Not given'} · Timeline: {l.timeline || 'Not given'}</p>
                    <p className="flex items-center gap-2"><Lock className="w-4 h-4" aria-hidden="true" />{l.name} · {l.phone} · email {l.email}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-brand-text-muted">{l.slotsLeft} of {opts?.shareLimit || 4} unlocks left</span>
                    {l.unlockedByMe
                      ? <Pill tone="green">Unlocked</Pill>
                      : <Button onClick={() => unlock(l)} disabled={busyId === l.id || me.status !== 'approved' || me.credits < 1}>
                          <Unlock className="w-4 h-4" aria-hidden="true" />{busyId === l.id ? 'Unlocking…' : 'Unlock for 1 credit'}
                        </Button>}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === 'unlocked' && (
          <div className="space-y-4">
            {unlocked.length === 0 && <Card><p className="text-brand-text-muted">You have not unlocked any leads yet.</p></Card>}
            {unlocked.map((u) => (
              <Card key={u.unlockId}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2"><Pill tone="orange">{u.categoryName}</Pill><span className="text-sm text-brand-text-muted">{u.city}{u.locality ? `, ${u.locality}` : ''}</span></div>
                  <span className="text-xs text-brand-text-muted">Unlocked {fmtDate(u.unlockedAt)}</span>
                </div>
                {u.notice
                  ? <p className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-800">{u.notice}</p>
                  : <>
                      <p className="mb-3">{u.description}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold text-brand-navy">
                        <span>{u.name}</span>
                        <a href={`tel:+91${u.phone}`} className="flex items-center gap-1 hover:text-brand-orange"><Phone className="w-4 h-4" aria-hidden="true" />{u.phone}</a>
                        {u.email && <a href={`mailto:${u.email}`} className="flex items-center gap-1 hover:text-brand-orange"><Mail className="w-4 h-4" aria-hidden="true" />{u.email}</a>}
                      </div>
                      <p className="text-xs text-brand-text-muted mt-2">Budget: {u.budget || 'Not given'} · Timeline: {u.timeline || 'Not given'}</p>
                    </>}
                <div className="mt-3">
                  {u.reportStatus === 'none'
                    ? <button className="text-xs text-red-700 underline" onClick={() => report(u)}>Report a fake or unreachable lead</button>
                    : <span className="text-xs text-brand-text-muted">Report: {u.reportStatus}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'profile' && profile && (
          <Card className="space-y-5">
            <div><Label>Services you offer</Label><Chips options={opts?.categories || []} value={profile.categories} onChange={(v) => setProfile({ ...profile, categories: v })} getKey={(c) => c.slug} getLabel={(c) => c.name} /></div>
            <div><Label>Cities you serve</Label><Chips options={opts?.cities || []} value={profile.cities} onChange={(v) => setProfile({ ...profile, cities: v })} /></div>
            <Button onClick={saveProfile}>Save</Button>
          </Card>
        )}
      </Shell>
    </>
  );
};

export default BusinessDashboard;
