# BrandMark Codebase Instructions

## Project Overview
BrandMark is a static website for a branding and marketing services company targeting MSMEs (Micro, Small & Medium Enterprises). The site showcases services, team members, internship opportunities, and company information.

## Architecture

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Styling**: Tailwind CSS (CDN) + custom CSS for older pages
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Outfit family)
- **Design Pattern**: Multi-page static site with shared component patterns

### Page Structure
- **index.html** (main entry): Modern design using Tailwind, glassmorphism nav, smooth scroll
- **brandmarkservices.html**: Service offerings with card-based layout
- **brandmarkAboutUs.html**: Team/company information
- **brandmarkcareers.html**: Job/internship listings
- **brandmarkpersonalblogs.html**: Blog content
- **Career pages**: Specialized career pages (internphotographercareers.html, internUIUXcareer.html, etc.)
- **BrandmarkSolutions.html**: Secondary/landing page (structure matches About Us)

## Key Patterns & Conventions

### Design System
- **Color Palette**: Custom theme in index.html Tailwind config
  - `brand-black: #0a0a0a`, `brand-dark: #121212`, `brand-gray: #1f1f1f`
  - `brand-accent: #3b82f6` (blue accent)
- **Typography**: "Outfit" font family (300-700 weights)
- **Animations**: 
  - `.fade-in-up` class with Intersection Observer (brandmark.js)
  - `.glass-nav` for glassmorphism effect with backdrop blur
  - Staggered delays for sequential element animations

### Navigation Pattern
- **Consistent header** across pages with logo + menu links
- **Mobile-responsive**: Hidden menu on desktop (md:hidden), toggle button for mobile
- **Fixed positioning**: Navbar stays at top with scroll shadow effect
- **Links**: href patterns use page names in root directory (e.g., `href="brandmarkservices.html"`)

### Component Patterns
- **Mobile menu**: Controlled by JavaScript click handlers with `hidden` class toggle
- **Service cards**: Staggered list item animations on hover via JavaScript
- **Form handling**: `handleFormSubmit()` simulates form submission with loading state (brandmark.js)
- **Intersection Observer**: Used for scroll-triggered fade-in animations

## File Organization

### Core Files
- [index.html](index.html) - Main page with Tailwind/modern design (reference for new pages)
- [brandmark.css](brandmark.css) - Global styles: scrollbar, animations, glassmorphism
- [brandmark.js](brandmark.js) - Shared JavaScript: mobile menu, scroll effects, form handling, Intersection Observer
- [BrandmarkSolutions/](BrandmarkSolutions/) - Currently empty subdirectory

### Page-Specific Styles
Older pages (About Us, Services, Careers) embed `<style>` tags in HTML instead of using brandmark.css. New pages should follow index.html pattern (external CSS + Tailwind).

## Development Workflows

### Adding a New Page
1. Use [index.html](index.html) as template (Tailwind + external CSS approach)
2. Include: `<script src="https://cdn.tailwindcss.com"></script>` and logo/nav section from index
3. Add page link to navigation menus in existing pages and new page's nav
4. Use `.fade-in-up` class on elements that need scroll animations (auto-applied by brandmark.js)

### Styling Pages
- **Preferred**: Tailwind utility classes + custom CSS in [brandmark.css](brandmark.css)
- **Legacy**: Inline `<style>` tags (seen in older pages like brandmarkAboutUs.html)
- **Avoid**: Duplicating nav/header code—consider refactoring to shared template

### JavaScript Interactivity
- **Mobile menu**: Automatically handled by brandmark.js if using `id="mobile-menu-btn"` and `id="mobile-menu"`
- **Scroll animations**: Add `.fade-in-up` class to elements; Intersection Observer auto-applies `.visible`
- **Custom forms**: Use `handleFormSubmit()` pattern from brandmark.js

## Integration Points

### External Dependencies
- Tailwind CSS (CDN): `https://cdn.tailwindcss.com`
- Font Awesome (CDN): `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Google Fonts: "Outfit" family (loaded in head)

### Image Assets
Images stored in root directory: `Brandmarklogo.jpeg`, `DigitalMarketing.jpeg`, etc. Paths are relative in HTML files.

## Common Tasks

### Fix Mobile Menu Not Working
Ensure element IDs match: `id="mobile-menu-btn"` (button), `id="mobile-menu"` (menu container). JavaScript in brandmark.js handles the rest.

### Add Scroll Animation to Elements
1. Add class `fade-in-up` to element
2. Brandmark.js Intersection Observer automatically triggers `.visible` on scroll
3. Animation defined in [brandmark.css](brandmark.css)

### Update Navigation Links
Edit nav sections in each page's header. Consider creating a reusable nav component to reduce duplication.

### Customize Colors
- For Tailwind pages: Modify `brand.*` colors in `<script>` tag of index.html, then use `class="text-brand-accent"` etc.
- For older pages: Update hex colors in inline `<style>` tags

## Testing & Debugging

### Browser Compatibility
Tested on modern browsers (Chrome, Firefox, Safari). Mobile-first responsive design.

### Common Issues
- **Images not loading**: Check relative paths (images in root, referenced as `src="filename.jpeg"`)
- **Styles not applying**: Verify Tailwind CDN is loaded before custom CSS; inline styles override external
- **Mobile menu stuck**: Clear browser cache; ensure JavaScript console has no errors

---

**Last Updated**: December 2025 | For questions, reference the file structure and patterns in [index.html](index.html) and [brandmark.js](brandmark.js)
