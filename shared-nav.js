// Shared Navigation Component for BrandMark Website
// This file injects the navigation HTML into pages that include it

(function() {
    'use strict';
    
    const navHTML = `
    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300 bg-brand-navy shadow-lg" id="navbar" role="navigation" aria-label="Main navigation">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <!-- Logo Area -->
                <a href="index.html" class="flex-shrink-0 flex items-center cursor-pointer no-underline" aria-label="BrandMark Home">
                    <img src="new logoBrandMarkupdatedone.jpeg" alt="Brand Mark Logo" class="h-12 w-12 rounded-full object-cover mr-3">
                    <span class="text-2xl font-bold tracking-tighter text-white">
                        Brand<span class="font-light text-brand-orange">Mark</span><span class="text-xs align-top">®</span>
                    </span>
                </a>

                <!-- Desktop Menu -->
                <div class="hidden md:flex space-x-8 items-center">
                    <a href="index.html" class="nav-link text-gray-200 hover:text-brand-orange transition-colors text-sm font-medium tracking-wide">Home</a>
                    <a href="brandmarkAboutUs.html" class="nav-link text-gray-200 hover:text-brand-orange transition-colors text-sm font-medium tracking-wide">About Us</a>
                    <a href="brandmarkservices.html" class="nav-link text-gray-200 hover:text-brand-orange transition-colors text-sm font-medium tracking-wide">Services</a>
                    <a href="portfolio.html" class="nav-link text-gray-200 hover:text-brand-orange transition-colors text-sm font-medium tracking-wide">Portfolio</a>
                    <a href="brandmarkpersonalblogs.html" class="nav-link text-gray-200 hover:text-brand-orange transition-colors text-sm font-medium tracking-wide">Blog</a>
                    <a href="brandmarkcareers.html" class="nav-link text-gray-200 hover:text-brand-orange transition-colors text-sm font-medium tracking-wide">Careers</a>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-gray-300 hover:text-white focus:outline-none" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
                        <i class="fa-solid fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Panel -->
        <div id="mobile-menu" class="hidden md:hidden bg-brand-navy border-b border-brand-border-light absolute w-full">
            <div class="px-4 pt-2 pb-6 space-y-2">
                <a href="index.html" class="nav-link-mobile block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-brand-navy-dark">Home</a>
                <a href="brandmarkAboutUs.html" class="nav-link-mobile block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-brand-navy-dark">About Us</a>
                <a href="brandmarkservices.html" class="nav-link-mobile block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-brand-navy-dark">Services</a>
                <a href="portfolio.html" class="nav-link-mobile block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-brand-navy-dark">Portfolio</a>
                <a href="brandmarkpersonalblogs.html" class="nav-link-mobile block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-brand-navy-dark">Blog</a>
                <a href="brandmarkcareers.html" class="nav-link-mobile block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-brand-navy-dark">Careers</a>
            </div>
        </div>
    </nav>
    `;
    
    // Function to insert navigation
    function insertNavigation() {
        // Find the body tag or a designated container
        const body = document.body;
        if (body) {
            // Insert navigation at the very beginning of body
            body.insertAdjacentHTML('afterbegin', navHTML);
            
            // Highlight the current page in navigation
            highlightCurrentPage();
        }
    }
    
    // Function to highlight the current page link
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                // Desktop navigation
                if (link.classList.contains('nav-link')) {
                    link.classList.remove('text-gray-200');
                    link.classList.add('text-white', 'font-bold');
                    link.setAttribute('aria-current', 'page');
                }
                // Mobile navigation
                if (link.classList.contains('nav-link-mobile')) {
                    link.classList.add('bg-brand-navy-dark', 'text-white');
                }
            }
        });
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNavigation);
    } else {
        insertNavigation();
    }
})();
