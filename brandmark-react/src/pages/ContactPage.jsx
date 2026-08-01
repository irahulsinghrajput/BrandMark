import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageTransition } from '../components/PageTransition';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const ContactPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="Contact BrandMark Solutions | Let's Accelerate Your Growth" 
        description="Ready to scale? Connect with our team of technical SEO, performance marketing, and branding experts in Patna, Bihar."
      />
      <div className="bg-brand-bg-light min-h-screen pt-24 pb-20">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <span className="inline-block px-4 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-brand-orange/20">
            Start Your Journey
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy tracking-tight mb-6 leading-tight">
            Let’s Build Something <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#ff985c]">
              Extraordinary Together
            </span>
          </h1>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Whether you need a cutting-edge website, an aggressive SEO campaign, or a complete brand overhaul, we have the tools to make it happen.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-orange/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              
              <h3 className="text-2xl font-bold text-brand-navy mb-8 relative z-10">Direct Contact</h3>
              
              <div className="space-y-6 relative z-10">
                <a href="tel:+917091863003" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-bg-light transition-colors group/link">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover/link:bg-brand-orange transition-colors">
                    <Phone className="w-5 h-5 text-brand-orange group-hover/link:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text-muted mb-1">Call Us Now</p>
                    <p className="font-bold text-brand-navy">+91 70918 63003</p>
                  </div>
                </a>

                <a href="mailto:info@brandmarksolutions.site" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-bg-light transition-colors group/link">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover/link:bg-brand-orange transition-colors">
                    <Mail className="w-5 h-5 text-brand-orange group-hover/link:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text-muted mb-1">Email Us</p>
                    <p className="font-bold text-brand-navy">info@brandmarksolutions.site</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-bg-light transition-colors group/link">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover/link:bg-brand-orange transition-colors">
                    <MapPin className="w-5 h-5 text-brand-orange group-hover/link:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text-muted mb-1">Headquarters</p>
                    <p className="font-bold text-brand-navy">Gangotri, Buddha colony,<br/>Patna, Bihar 800001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-brand-navy rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange rounded-bl-full -mr-16 -mt-16 opacity-20"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Not ready to talk?</h3>
              <ul className="space-y-4 relative z-10">
                <li>
                  <Link to="/services" className="flex items-center text-gray-300 hover:text-brand-orange transition-colors">
                    Explore our services <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </li>
                <li>
                  <Link to="/case-studies" className="flex items-center text-gray-300 hover:text-brand-orange transition-colors">
                    View our case studies <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="flex items-center text-gray-300 hover:text-brand-orange transition-colors">
                    Read our insights <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-8">
            <LeadCaptureForm />
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
