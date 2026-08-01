import React from 'react';
import { Link } from 'react-router-dom';

export const RelatedLinks = ({ currentType, currentId }) => {
  // Simple logic to fetch related clusters based on current context
  const links = [
    { title: 'Digital Marketing in Patna', url: '/locations/patna' },
    { title: 'Web Development in Bihar', url: '/locations/bihar' },
    { title: 'Real Estate Marketing', url: '/industries/real-estate' },
    { title: 'Our Core Services', url: '/services' },
    { title: 'View Case Studies', url: '/case-studies' }
  ].filter(link => !link.url.includes(currentId));

  return (
    <div className="mt-16 pt-16 border-t border-brand-border-light">
      <h3 className="text-2xl font-bold text-brand-navy mb-6">Explore Related Services</h3>
      <div className="flex flex-wrap gap-4">
        {links.map((link, i) => (
          <Link 
            key={i} 
            to={link.url}
            className="px-6 py-3 bg-white border border-brand-border-light rounded-full text-brand-text-body hover:border-brand-orange hover:text-brand-orange transition-colors shadow-sm text-sm font-medium"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
