import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './Layout';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { ServicesHub } from './pages/ServicesHub';
import { ServiceDetail } from './pages/ServiceDetail';
import { Portfolio } from './pages/Portfolio';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Careers } from './pages/Careers';
import { Courses } from './pages/Courses';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentLogin } from './pages/StudentLogin';
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
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<ServicesHub />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/student-login" element={<StudentLogin />} />
            
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
        </AnimatePresence>
        {!isDashboard && <Footer />}
      </Layout>
    </ModalProvider>
    </HelmetProvider>
  );
}

export default App;
