import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { NotFound } from './NotFound';
import { serviceContent, serviceNames } from '../data/serviceContent';
import blogs from '../data/blogs.json';

gsap.registerPlugin(ScrollTrigger);

const SITE = 'https://www.brandmarksolutions.site';

export const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = serviceContent[serviceId];

  useEffect(() => {
    if (!service) return;
    gsap.fromTo('.service-header',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    const boxes = gsap.utils.toArray('.bento-box');
    if (boxes.length > 0) {
      gsap.fromTo(boxes,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.bento-grid', start: 'top 80%' }
        }
      );
    }
  }, [service]);

  if (!service) return <NotFound />;

  const url = `${SITE}/services/${serviceId}`;
  const articles = service.blogs.map((slug) => blogs.find((b) => (b.slug || b.id) === slug)).filter(Boolean);

  return (
    <PageTransition>
      <SEO
        title={service.seoTitle}
        description={service.seoDescription}
        canonicalUrl={url}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${url}#service`,
            name: service.h1,
            serviceType: service.title,
            description: service.seoDescription,
            url,
            provider: { '@id': SITE },
            areaServed: [{ '@type': 'City', name: 'Patna' }, { '@type': 'State', name: 'Bihar' }]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
              { '@type': 'ListItem', position: 3, name: service.title, item: url }
            ]
          }
        ]}
      />
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen relative overflow-hidden">

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-brand-orange rounded-full filter blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <nav aria-label="Breadcrumb" className="text-sm text-brand-text-muted mb-10">
            <Link to="/" className="hover:text-brand-orange">Home</Link> <span aria-hidden="true">/</span>{' '}
            <Link to="/services" className="hover:text-brand-orange">Services</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-brand-navy font-semibold">{service.title}</span>
          </nav>

          <div className="service-header max-w-4xl mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-brand-navy leading-tight">
              {service.h1}
            </h1>
            <div className="w-20 h-2 bg-brand-orange mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-brand-text-body font-light leading-relaxed mb-8">
              {service.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="px-8 py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark transition-colors">Get a free quote</Link>
              <a href="tel:+917091863003" className="px-8 py-4 bg-white border border-brand-border-light text-brand-navy font-bold rounded-xl hover:border-brand-orange transition-colors">Call +91 70918 63003</a>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 mb-20">
            <div className="lg:col-span-7 space-y-5 text-lg text-brand-text-body leading-relaxed">
              {service.intro.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-border-light p-8 self-start">
              <h2 className="text-2xl font-bold text-brand-navy mb-5">Who we do this for</h2>
              <ul className="space-y-3">
                {service.forWho.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-brand-text-body">
                    <span className="mt-2 w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" aria-hidden="true"></span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-brand-navy mb-10">What&apos;s included</h2>
            <div className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`bento-box bg-white p-8 rounded-3xl border border-brand-border-light shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-300 ${
                    i === 0 || i === 3 ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-brand-bg-light' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-5 text-brand-orange text-xl font-bold" aria-hidden="true">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-3">{feature.title}</h3>
                  <p className="text-brand-text-muted leading-relaxed text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-brand-navy mb-10">How we work</h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step, i) => (
                <li key={step.title} className="bg-white rounded-3xl border border-brand-border-light p-7">
                  <span className="text-3xl font-extrabold text-brand-orange" aria-hidden="true">{i + 1}</span>
                  <h3 className="text-xl font-bold text-brand-navy mt-2 mb-2">{step.title}</h3>
                  <p className="text-brand-text-muted leading-relaxed">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-20 max-w-4xl">
            <h2 className="text-3xl font-bold text-brand-navy mb-8">Frequently asked questions</h2>
            <div className="space-y-4">
              {service.faqs.map((f) => (
                <details key={f.q} className="group bg-white rounded-2xl border border-brand-border-light p-6">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-brand-navy text-lg">
                    {f.q}
                    <span className="text-brand-orange text-2xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 text-brand-text-muted leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-4">Related services</h2>
              <ul className="space-y-2">
                {service.related.map((id) => (
                  <li key={id}><Link to={`/services/${id}`} className="text-brand-orange hover:underline">{serviceNames[id]}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-4">Areas we serve</h2>
              <ul className="space-y-2">
                <li><Link to="/locations/patna" className="text-brand-orange hover:underline">Digital marketing agency in Patna</Link></li>
                <li><Link to="/locations/bihar" className="text-brand-orange hover:underline">Digital marketing agency in Bihar</Link></li>
                <li><Link to="/portfolio" className="text-brand-orange hover:underline">See our work</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-4">Helpful reading</h2>
              <ul className="space-y-2">
                {articles.map((b) => (
                  <li key={b.id || b.slug}><Link to={`/blog/${b.slug || b.id}`} className="text-brand-orange hover:underline">{b.title}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-brand-navy rounded-3xl p-10 md:p-16 text-center shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Talk to our Patna team</h2>
            <p className="text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto">
              Tell us what you need and we will reply with clear next steps. Office: Gangotri, Buddha Colony, Patna 800001.
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-5 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-orange transition-all duration-300 shadow-xl"
            >
              Start a Project
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
