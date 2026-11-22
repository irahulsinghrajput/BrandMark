import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { mp, adminLogin, fmtDate } from '../../lib/marketplaceApi';
import { Shell, Card, Input, Label, Button, ErrorBox, Pill } from './ui';

const tone = { approved: 'green', pending: 'orange', suspended: 'red', live: 'green', pending_otp: 'orange', rejected: 'red', withdrawn: 'gray', deleted: 'gray' };

export const MarketplaceAdmin = () => {
  const [authed, setAuthed] = useState(null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [tab, setTab] = useState('businesses');
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async (which = tab) => {
    setError('');
    try {
      setStats((await mp('/admin/overview')).stats);
      const path = { businesses: '/admin/businesses', leads: '/admin/requirements', reports: '/admin/reports', consents: '/admin/consents' }[which];
      const d = await mp(path);
      setRows(d.businesses || d.requirements || d.reports || d.consents || []);
      setAuthed(true);
    } catch (e) {
      if (e.status === 401 || e.status === 403) setAuthed(false); else setError(e.message);
    }
  }, [tab]);

  useEffect(() => { load(tab); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const doLogin = async (e) => {
    e.preventDefault(); setError('');
    try { await adminLogin(login.email, login.password); await load(tab); } catch (err) { setError(err.message); }
  };

  const call = async (path, body) => {
    setError('');
    try { await mp(path, { method: 'POST', body }); await load(tab); } catch (e) { setError(e.message); }
  };

  if (authed === false) {
    return (
      <Shell narrow>
        <Helmet><title>Marketplace Admin | BrandMark</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <h1 className="text-3xl font-extrabold text-brand-navy mb-6">Marketplace admin</h1>
        <Card>
          <form onSubmit={doLogin} className="space-y-4">
            <div><Label htmlFor="a-email">Admin email</Label><Input id="a-email" type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /></div>
            <div><Label htmlFor="a-pass">Password</Label><Input id="a-pass" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /></div>
            <ErrorBox>{error}</ErrorBox>
            <Button type="submit" className="w-full">Log in</Button>
          </form>
        </Card>
      </Shell>
    );
  }
  if (authed === null) return <Shell><p className="text-brand-text-muted">Loading…</p></Shell>;

  return (
    <>
      <Helmet><title>Marketplace Admin | BrandMark</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Shell>
        <h1 className="text-3xl font-extrabold text-brand-navy mb-6">Marketplace admin</h1>
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {[['Live leads', stats.live], ['Awaiting OTP', stats.pending], ['Withdrawn/deleted', stats.withdrawn], ['Businesses', stats.businesses], ['To verify', stats.pendingBusinesses], ['Unlocks', stats.unlocks], ['Open reports', stats.openReports]].map(([l, v]) => (
              <Card key={l} className="!p-4"><p className="text-xs text-brand-text-muted">{l}</p><p className="text-2xl font-extrabold text-brand-navy">{v}</p></Card>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {[['businesses', 'Businesses'], ['leads', 'Leads'], ['reports', 'Reports'], ['consents', 'Consent log']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-xl px-4 py-2 font-semibold text-sm ${tab === k ? 'bg-brand-navy text-white' : 'bg-white border border-brand-border-light text-brand-navy'}`}>{l}</button>
          ))}
        </div>
        <div className="mb-4"><ErrorBox>{error}</ErrorBox></div>

        <div className="space-y-3">
          {rows.length === 0 && <Card><p className="text-brand-text-muted">Nothing here yet.</p></Card>}

          {tab === 'businesses' && rows.map((b) => (
            <Card key={b.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold text-brand-navy">{b.businessName} <Pill tone={tone[b.status]}>{b.status}</Pill></p>
                <p className="text-sm text-brand-text-muted">{b.ownerName} · {b.email} · {b.phone}{b.gstin ? ` · GSTIN ${b.gstin}` : ''}</p>
                <p className="text-sm text-brand-text-muted">{b.categories.join(', ')} · {b.cities.join(', ')} · joined {fmtDate(b.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-brand-navy mr-2">{b.credits} credits</span>
                <Button variant="ghost" onClick={() => call(`/admin/businesses/${b.id}/credits`, { amount: 5, note: 'Manual grant' })}>+5 credits</Button>
                {b.status !== 'approved' && <Button variant="navy" onClick={() => call(`/admin/businesses/${b.id}/status`, { status: 'approved' })}>Approve</Button>}
                {b.status !== 'suspended' && <Button variant="danger" onClick={() => call(`/admin/businesses/${b.id}/status`, { status: 'suspended' })}>Suspend</Button>}
              </div>
            </Card>
          ))}

          {tab === 'leads' && rows.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="font-bold text-brand-navy">{r.categoryName} · {r.city} <Pill tone={tone[r.status]}>{r.status}</Pill></p>
                <p className="text-sm my-1">{r.description}</p>
                <p className="text-sm text-brand-text-muted">{r.name || '—'} · {r.phone || '—'} · {r.email || '—'} · {r.phoneVerified ? 'phone verified' : 'not verified'} · {r.unlockCount}/{r.shareLimit} unlocks · posted {fmtDate(r.postedAt)}</p>
              </div>
              {r.status === 'live' && <Button variant="danger" onClick={() => call(`/admin/requirements/${r.id}/status`, { status: 'rejected' })}>Reject as spam</Button>}
              {r.status === 'rejected' && <Button variant="ghost" onClick={() => call(`/admin/requirements/${r.id}/status`, { status: 'live' })}>Restore</Button>}
            </Card>
          ))}

          {tab === 'reports' && rows.map((r) => (
            <Card key={r.unlockId} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold text-brand-navy">{r.business} reported a lead</p>
                <p className="text-sm">“{r.reason}”</p>
                <p className="text-sm text-brand-text-muted">{r.lead?.category} · {r.lead?.city} · {r.lead?.name || '—'} · {r.lead?.phone || '—'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="navy" onClick={() => call(`/admin/reports/${r.unlockId}/resolve`, { refund: true })}>Refund credit</Button>
                <Button variant="ghost" onClick={() => call(`/admin/reports/${r.unlockId}/resolve`, { refund: false })}>Decline</Button>
              </div>
            </Card>
          ))}

          {tab === 'consents' && rows.map((c) => (
            <Card key={c.id}>
              <p className="font-bold text-brand-navy text-sm">{c.purpose}</p>
              <p className="text-xs text-brand-text-muted mb-2">Lead {String(c.requirement)} · consent {c.consentVersion} · given {fmtDate(c.givenAt)}{c.withdrawnAt ? ` · withdrawn ${fmtDate(c.withdrawnAt)}` : ''}{c.deletedAt ? ` · deleted ${fmtDate(c.deletedAt)}` : ''}</p>
              <ol className="text-xs text-brand-text-body list-decimal list-inside">
                {c.events.map((e, i) => <li key={i}>{e.type}{e.business ? ` → ${e.business}` : ''} · {new Date(e.at).toLocaleString('en-IN')}</li>)}
              </ol>
            </Card>
          ))}
        </div>
      </Shell>
    </>
  );
};

export default MarketplaceAdmin;
