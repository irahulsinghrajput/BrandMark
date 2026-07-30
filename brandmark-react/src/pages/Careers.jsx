import React, { useEffect } from 'react';
import gsap from 'gsap';
import { PageTransition } from '../components/PageTransition';

export const Careers = () => {
  useEffect(() => {
    gsap.fromTo('.careers-content', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  const jobs = [
    {
      type: "Internship - Marketing",
      title: "Social Media Intern",
      desc: "Do you live on Instagram and dream in TikToks? We need a creative soul to manage engagement, craft viral copy, and keep our clients trending."
    },
    {
      type: "Internship - Creative",
      title: "Intern Photographer",
      desc: "We need an eye for detail. Responsibilities include event coverage, product shoots, and assisting our Art Directors on set."
    },
    {
      type: "Internship - Design",
      title: "Intern Web Designer",
      desc: "HTML and CSS should be your second language. Assist in building sleek, responsive layouts. You'll work closely with our dev team."
    },
    {
      type: "Internship - Product",
      title: "UI/UX Intern",
      desc: "Obsessed with user journeys? Help us map out intuitive interfaces. You'll be conducting user research and creating wireframes."
    }
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6 careers-content">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Join the <span className="text-brand-orange">Team</span>
            </h1>
            <p className="text-xl text-brand-text-muted font-light max-w-2xl mx-auto">
              We are looking for the misfits, the rebels, and the troublemakers who want to redefine digital marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs.map((job, i) => (
              <div key={i} className="bg-white border border-brand-border-light rounded-xl p-8 transition-all duration-300 hover:border-brand-orange hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-brand-bg-card text-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-wider mb-6 rounded-md">
                    {job.type}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">
                    {job.title}
                  </h2>
                  <p className="text-brand-text-muted leading-relaxed mb-8 font-light">
                    {job.desc}
                  </p>
                </div>
                <div className="pt-6 border-t border-brand-border-light flex justify-between items-center">
                  <a href={`mailto:jobs@brandmarksolutions.com?subject=Application for ${job.title}`} className="inline-block px-6 py-3 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-lg hover:bg-brand-orange-dark transition-colors text-sm">
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
