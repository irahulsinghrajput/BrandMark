import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const NotFound = () => (
  <>
    <Helmet><title>Page not found | BrandMark Solutions</title><meta name="robots" content="noindex" /></Helmet>
    <div className="min-h-screen bg-brand-bg-light pt-40 px-6 text-center">
      <h1 className="text-4xl font-extrabold text-brand-navy mb-4">Page not found</h1>
      <p className="text-brand-text-muted mb-8">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="inline-block rounded-xl bg-brand-orange text-white font-semibold px-6 py-3">Go to the home page</Link>
    </div>
  </>
);

export default NotFound;
