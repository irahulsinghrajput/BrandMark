import React from 'react';
import { Link } from 'react-router-dom';
import locations from '../data/locations.json';
import industries from '../data/industries.json';

export const RelatedLinks = ({ currentType, currentId }) => {
  // Get a random selection of 2 locations and 2 industries to cross-link
  const locationKeys = Object.keys(locations).filter(k => k !== 'default' && k !== currentId);
  const industryKeys = Object.keys(industries).filter(k => k !== 'default' && k !== currentId);
  
  // Shuffle helper
  const shuffle = (array) => array.sort(() => 0.5 - Math.random());
  
  const selectedLocations = shuffle(locationKeys).slice(0, 2);
  const selectedIndustries = shuffle(industryKeys).slice(0, 2);

  const links = [
    ...selectedLocations.map(k => ({ title: `Digital Marketing in ${locations[k].name}`, url: `/locations/${k}` })),
    ...selectedIndustries.map(k => ({ title: `${industries[k].name} Marketing`, url: `/industries/${k}` })),
    { title: 'Our Core Services', url: '/services' },
    { title: 'View Case Studies', url: '/case-studies' }
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
