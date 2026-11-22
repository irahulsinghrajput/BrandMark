import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { mp, fmtDate } from '../../lib/marketplaceApi';
import { Shell, Card, Button, ErrorBox, Pill } from './ui';

const statusTone = { live: 'green', withdrawn: 'gray', deleted: 'gray', rejected: 'red', pending_otp: 'orange' };

export const ManageRequirement = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => mp(`/manage/${token}`).then(setData).catch((e) => setError(e.message)), [token]);
  useEffect(() => { load(); }, [load]);

  const act = async (kind) => {
    const q = kind === 'delete'
      ? 'Delete your name, phone, email and description from BrandMark? This cannot be undone, and this link will stop working.'
      : 'Withdraw your request? Businesses will no longer see it.';
    if (!window.confirm(q)) return;
    setBusy(true); setError('');
    try {
      const res = await mp(`/manage/${token}/${kind}`, { method: 'POST', body: {} });
      setMessage(res.message);
      if (kind === 'delete') setData(null); else await load();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const r = data?.requirement;
  return (
    <>
      <Helmet><title>My Request | BrandMark Connect</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Shell narrow>
        <h1 className="text-3xl font-extrabold text-brand-navy mb-6">My request</h1>
        {message && <div className="rounded-xl bg-green-50 border border-green-200 text-green-900 px-4 py-3 mb-4">{message}</div>}
        <ErrorBox>{error}</ErrorBox>
        {!r && !error && !message && <p className="text-brand-text-muted">Loading…</p>}
        {!r && message && <Link to="/leads" className="text-brand-orange underline">Back to BrandMark Connect</Link>}
        {r && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-brand-navy">{r.categoryName} · {r.city}{r.locality ? `, ${r.locality}` : ''}</h2>
                <Pill tone={statusTone[r.status]}>{r.status === 'live' ? 'Live' : r.status}</Pill>
              </div>
              <p className="text-brand-text-body mb-4 whitespace-pre-line">{r.description}</p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-brand-text-muted">Name</dt><dd>{r.name}</dd>
                <dt className="text-brand-text-muted">Phone</dt><dd>{r.phone}</dd>
                <dt className="text-brand-text-muted">Email</dt><dd>{r.email || '—'}</dd>
                <dt className="text-brand-text-muted">Budget</dt><dd>{r.budget || '—'}</dd>
                <dt className="text-brand-text-muted">Timeline</dt><dd>{r.timeline || '—'}</dd>
                <dt className="text-brand-text-muted">Visible until</dt><dd>{fmtDate(r.expiresAt)}</dd>
              </dl>
            </Card>

            <Card>
              <h3 className="font-bold text-brand-navy mb-1">Who has your details ({r.unlockCount} of {r.shareLimit})</h3>
              {data.sharedWith.length === 0
                ? <p className="text-sm text-brand-text-muted">No business has unlocked your details yet.</p>
                : <ul className="divide-y divide-brand-border-light">
                    {data.sharedWith.map((s, i) => (
                      <li key={i} className="py-2 text-sm flex justify-between gap-3">
                        <span className="font-semibold text-brand-navy">{s.businessName}</span>
                        <span className="text-brand-text-muted">{s.phone} · {fmtDate(s.at)}</span>
                      </li>
                    ))}
                  </ul>}
            </Card>

            <Card>
              <h3 className="font-bold text-brand-navy mb-1">Your consent</h3>
              <p className="text-sm text-brand-text-muted mb-2">Given on {fmtDate(data.consent?.givenAt)} (version {data.consent?.consentVersion}){data.consent?.withdrawnAt ? `, withdrawn on ${fmtDate(data.consent.withdrawnAt)}` : ''}.</p>
              <p className="text-sm italic text-brand-text-body">“{data.consent?.consentText}”</p>
            </Card>

            <div className="flex flex-wrap gap-3">
              {r.status === 'live' && <Button variant="ghost" disabled={busy} onClick={() => act('withdraw')}>Withdraw my request</Button>}
              <Button variant="danger" disabled={busy} onClick={() => act('delete')}>Delete my data</Button>
            </div>
          </div>
        )}
      </Shell>
    </>
  );
};

export default ManageRequirement;
