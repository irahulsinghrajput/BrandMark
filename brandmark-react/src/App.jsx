import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './Layout';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { useLenis } from 'lenis/react';
import { ModalProvider } from './contexts/ModalContext';
import { StrategyModal } from './components/StrategyModal';
import { TalkToMarkVapi } from './components/TalkToMarkVapi';

import { ProtectedRoute } from './components/ProtectedRoute';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ChatBotWidget } from './components/ChatBotWidget';
import { ScrollToTopButton } from './components/ScrollToTopButton';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const AboutUs = lazy(() => import('./pages/AboutUs').then(module => ({ default: module.AboutUs })));
const ServicesHub = lazy(() => import('./pages/ServicesHub').then(module => ({ default: module.ServicesHub })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(module => ({ default: module.ServiceDetail })));
const Portfolio = lazy(() => import('./pages/Portfolio').then(module => ({ default: module.Portfolio })));
const BlogDirectory = lazy(() => import('./pages/BlogDirectory'));
const BlogPost = lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost || module.default })));
const AuthorPage = lazy(() => import('./pages/AuthorPage').then(module => ({ default: module.AuthorPage || module.default })));
const Careers = lazy(() => import('./pages/Careers').then(module => ({ default: module.Careers })));
const Courses = lazy(() => import('./pages/Courses').then(module => ({ default: module.Courses })));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const StudentLogin = lazy(() => import('./pages/StudentLogin').then(module => ({ default: module.StudentLogin })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const Industries = lazy(() => import('./pages/Industries').then(module => ({ default: module.Industries })));
const IndustryPage = lazy(() => import('./pages/IndustryPage').then(module => ({ default: module.IndustryPage })));
const CaseStudies = lazy(() => import('./pages/CaseStudies').then(module => ({ default: module.CaseStudies })));
const LocationPage = lazy(() => import('./pages/LocationPage').then(module => ({ default: module.LocationPage })));
const ClientProposalPortal = lazy(() => import('./pages/ClientProposalPortal').then(module => ({ default: module.ClientProposalPortal })));
const ClientPortal = lazy(() => import('./pages/ClientPortal').then(module => ({ default: module.ClientPortal })));
const ExecutiveDashboard = lazy(() => import('./pages/ExecutiveDashboard').then(module => ({ default: module.ExecutiveDashboard })));
const KnowledgeBaseAdmin = lazy(() => import('./pages/KnowledgeBaseAdmin').then(module => ({ default: module.KnowledgeBaseAdmin })));
const BrandMarkGPT = lazy(() => import('./pages/BrandMarkGPT').then(module => ({ default: module.BrandMarkGPT })));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-bg-light">
    <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const location = useLocation();
  const lenis = useLenis();

  // Scroll to top on route change (unless scrollTo param is present)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('scrollTo')) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname, location.search, lenis]);

  // Hide Navbar/Footer on dashboard route for immersive experience
  const isDashboard = location.pathname.startsWith('/dashboard');

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BrandMark Solutions Private Ltd.",
    "image": "https://www.brandmarksolutions.site/brandmark-logo-new.png.png",
    "@id": "https://www.brandmarksolutions.site",
    "url": "https://www.brandmarksolutions.site",
    "telephone": "+917091863003",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gangotri, Buddha colony",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "postalCode": "800001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.6186,
      "longitude": 85.1278
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/brandmarksolutions",
      "https://www.instagram.com/brandmarksolutions/",
      "https://www.linkedin.com/company/brandmarksolutions/"
    ]
  };

  return (
    <HelmetProvider>
      <ModalProvider>
        <Layout>
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(localBusinessSchema)}
            </script>
          </Helmet>
          
          {!isDashboard && <Navbar />}
          <StrategyModal />
          <TalkToMarkVapi />
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              className: 'font-outfit',
              style: {
                background: '#0B2C4D',
                color: '#fff',
              }
            }} 
          />
          {!isDashboard && <WhatsAppButton />}
          {!isDashboard && <ChatBotWidget />}
          {!isDashboard && <ScrollToTopButton />}
          <AnimatePresence mode="wait" initial={false}>
            <Suspense fallback={<PageLoader />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/services" element={<ServicesHub />} />
                <Route path="/services/:serviceId" element={<ServiceDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/blog" element={<BlogDirectory />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/authors/:slug" element={<AuthorPage />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/proposal/:id" element={<ClientProposalPortal />} />
                <Route path="/portal/:clientId" element={<ClientPortal />} />
                <Route path="/admin/dashboard" element={<ExecutiveDashboard />} />
                <Route path="/admin/knowledge" element={<KnowledgeBaseAdmin />} />
                <Route path="/admin/ai" element={<BrandMarkGPT />} />
                
                {/* New SEO Architecture Routes */}
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/industries/:industryId" element={<IndustryPage />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/locations/:city" element={<LocationPage />} />
                
                {/* Protected Dashboard Route */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </AnimatePresence>
        {!isDashboard && <Footer />}
      </Layout>
    </ModalProvider>
    </HelmetProvider>
  );
}

export default App;
