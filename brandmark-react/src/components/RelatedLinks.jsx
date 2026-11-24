import React from 'react';
import { Link } from 'react-router-dom';
import locations from '../data/locations.json';
import industries from '../data/industries.json';

export const RelatedLinks = ({ currentId }) => {
  // Same links on every build: the main location pages first, then the next entries in the list
  const locationKeys = ['patna', 'bihar', 'muzaffarpur', 'gaya'].filter(k => locations[k] && k !== currentId);
  const industryKeys = Object.keys(industries).filter(k => k !== 'default' && k !== currentId);
  const start = Math.max(0, Object.keys(industries).filter(k => k !== 'default').indexOf(currentId));
  const selectedLocations = locationKeys.slice(0, 2);
  const selectedIndustries = [0, 1].map(i => industryKeys[(start + i) % industryKeys.length]);

  const links = [
    ...selectedLocations.map(k => ({ title: `Digital Marketing in ${locations[k].name}`, url: `/locations/${k}` })),
    ...selectedIndustries.map(k => ({ title: `${industries[k].name} Marketing`, url: `/industries/${k}` })),
    { title: 'Our Core Services', url: '/services' },
    { title: 'See Our Work', url: '/portfolio' }
  ];

  return (
    <div className="mt-16 pt-16 border-t border-brand-border-light">
      <h3 className="text-2xl font-bold text-brand-navy mb-6">Explore Related Areas</h3>
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
