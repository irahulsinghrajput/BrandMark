import React from 'react';

// Shared building blocks for the marketplace pages (BrandMark navy/orange theme)
export const Shell = ({ children, narrow = false }) => (
  <div className="bg-brand-bg-light min-h-screen pt-28 pb-20">
    <div className={`${narrow ? 'max-w-2xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6`}>{children}</div>
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-brand-border-light shadow-sm p-6 ${className}`}>{children}</div>
);

export const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-brand-navy mb-1.5">{children}</label>
);

const field = 'w-full rounded-xl border border-brand-border-light bg-white px-4 py-2.5 text-brand-text-body focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange';

export const Input = (props) => <input {...props} className={`${field} ${props.className || ''}`} />;
export const Textarea = (props) => <textarea {...props} className={`${field} ${props.className || ''}`} />;
export const Select = ({ children, ...props }) => <select {...props} className={`${field} ${props.className || ''}`}>{children}</select>;

export const Button = ({ variant = 'primary', className = '', ...props }) => {
  const styles = {
    primary: 'bg-brand-orange hover:bg-brand-orange-dark text-white',
    navy: 'bg-brand-navy hover:bg-brand-navy-dark text-white',
    ghost: 'bg-white border border-brand-border-light text-brand-navy hover:border-brand-orange',
    danger: 'bg-white border border-red-300 text-red-700 hover:bg-red-50'
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
};

export const Pill = ({ children, tone = 'navy' }) => {
  const tones = {
    navy: 'bg-brand-navy/10 text-brand-navy',
    orange: 'bg-brand-orange/10 text-brand-orange',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700'
  };
  return <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${tones[tone]}`}>{children}</span>;
};

export const ErrorBox = ({ children }) =>
  children ? <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{children}</div> : null;

export const Chips = ({ options, value, onChange, getKey = (o) => o, getLabel = (o) => o }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => {
      const k = getKey(o);
      const on = value.includes(k);
      return (
        <button
          type="button" key={k} aria-pressed={on}
          onClick={() => onChange(on ? value.filter((v) => v !== k) : [...value, k])}
          className={`rounded-full border px-3 py-1 text-sm ${on ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-navy border-brand-border-light hover:border-brand-orange'}`}
        >
          {getLabel(o)}
        </button>
      );
    })}
  </div>
);
