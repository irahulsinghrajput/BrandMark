# Google Analytics 4 (GA4) Setup Guide for BrandMark Website

## Quick Start Instructions

### Step 1: Create Google Analytics Account

1. **Go to**: https://analytics.google.com/
2. **Sign in** with your Google account
3. Click **"Start measuring"**
4. Enter your **Account name**: BrandMark Solutions
5. Click **"Next"**

### Step 2: Create Property

1. **Property name**: BrandMark Website
2. **Reporting time zone**: (GMT+05:30) India Standard Time
3. **Currency**: Indian Rupee (INR)
4. Click **"Next"**

### Step 3: About Your Business

1. **Industry category**: Marketing & Advertising
2. **Business size**: Small (1-10 employees)
3. **Business objectives**: Select all that apply:
   - Generate leads
   - Raise brand awareness
   - Examine user behavior
4. Click **"Create"**
5. Accept the **Terms of Service**

### Step 4: Set Up Data Stream

1. Choose **"Web"** as your platform
2. **Website URL**: https://brandmarksolutions.site
3. **Stream name**: BrandMark Main Website
4. Click **"Create stream"**

### Step 5: Get Your Measurement ID

After creating the stream, you'll see your **Measurement ID** (looks like `G-XXXXXXXXXX`)

**COPY THIS ID** - You'll need it for the next step!

---

## Implementation Instructions

### Replace Placeholder in All HTML Files

Find and replace `YOUR-GA-ID` with your actual Measurement ID in these files:

1. ✅ index.html
2. ✅ 404.html
3. ✅ privacy-policy.html
4. ✅ terms-of-service.html
5. ✅ portfolio.html
6. ✅ brandmarkservices.html
7. ✅ brandmarkAboutUs.html
8. ✅ brandmarkcareers.html
9. ✅ brandmarkpersonalblogs.html
10. ✅ All blog post pages

### Example Replacement

**Before:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-GA-ID');
</script>
```

**After** (example with ID `G-ABC123XYZ`):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ');
</script>
```

---

## Quick Find & Replace in VS Code

1. **Press**: `Ctrl + Shift + H` (Windows) or `Cmd + Shift + H` (Mac)
2. **Find**: `YOUR-GA-ID`
3. **Replace with**: Your actual Measurement ID (e.g., `G-ABC123XYZ`)
4. **Files to include**: `*.html`
5. Click **"Replace All"**

---

## Verify Installation

### Method 1: Real-Time Reports
1. Go to Google Analytics
2. Navigate to **Reports > Realtime**
3. Open your website in a new tab
4. You should see your visit appear in real-time (within 30 seconds)

### Method 2: Google Tag Assistant
1. Install **Google Tag Assistant Legacy** Chrome extension
2. Visit your website
3. Click the extension icon
4. Should show "Google Analytics (GA4) - Tag Firing"

### Method 3: Browser Console
1. Open your website
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Type: `dataLayer`
5. You should see data being collected

---

## Important Settings to Configure

### 1. Enhanced Measurement (Auto-Enabled)
Automatically tracks:
- Page views
- Scrolls
- Outbound clicks
- Site search
- File downloads
- Video engagement

### 2. Set Up Goals/Conversions

#### Contact Form Submission
1. In GA4, go to **Configure > Events**
2. Click **"Create event"**
3. **Event name**: `generate_lead`
4. **Conditions**: `event_name = form_submit` AND `form_id = contactForm`

#### Newsletter Sign-up
1. Create event: `newsletter_signup`
2. Condition: `event_name = form_submit` AND `form_id contains newsletter`

#### Career Application
1. Create event: `career_application`
2. Condition: `page_location contains /career`

### 3. Enable Google Signals
1. Go to **Admin > Data Settings > Data Collection**
2. Enable **Google signals data collection**
3. This allows demographics and remarketing features

---

## Key Metrics to Monitor

### Weekly Check:
- **Users**: Total visitors
- **Sessions**: Total visits
- **Bounce Rate**: % of single-page visits
- **Average Session Duration**: Time on site
- **Pages per Session**: Engagement level

### Monthly Review:
- **Top Landing Pages**: Where visitors enter
- **Traffic Sources**: Organic, Direct, Social, Referral
- **Device Category**: Mobile vs Desktop
- **Conversions**: Form submissions, newsletter signups
- **Top Performing Content**: Most viewed pages/blogs

---

## Advanced Features (Optional)

### Connect to Google Search Console
1. In GA4, go to **Admin > Property Settings**
2. Click **"Search Console Links"**
3. Click **"Link"**
4. Select your Search Console property
5. This shows search queries that bring visitors

### Set Up Custom Dashboards
1. Go to **Explore**
2. Click **"Blank"** template
3. Add metrics and dimensions relevant to your business
4. Save as template for weekly review

### E-commerce Tracking (If Selling Online)
1. Go to **Admin > Data Streams > [Your Stream]**
2. Click **"Enhanced measurement"**
3. Enable **E-commerce**
4. Add purchase event tracking to checkout pages

---

## Troubleshooting

### Problem: No Data Showing
**Solutions:**
1. Wait 24-48 hours for data to fully populate
2. Check real-time reports (shows immediately)
3. Verify Measurement ID is correct
4. Check ad blockers aren't blocking GA
5. Test in incognito mode

### Problem: Duplicate Tracking
**Solution:**
- Make sure GA code appears only ONCE in each page
- Check if using both GA and Tag Manager (only use one)

### Problem: Missing Page Views
**Solution:**
- Verify script is in `<head>` section, not `<body>`
- Check for JavaScript errors in console
- Ensure script loads before any other tracking

---

## Privacy & Compliance

### GDPR Compliance (If Applicable)
1. Update your **Privacy Policy** (✅ Already created)
2. Consider adding cookie consent banner
3. Enable IP anonymization (enabled by default in GA4)
4. Set data retention to 14 months

### Cookie Consent Banner (Optional)
Add this before GA script if needed:
```html
<!-- Simple Cookie Consent -->
<script>
if(!localStorage.getItem('cookieConsent')) {
    // Show banner logic here
    // After user accepts:
    localStorage.setItem('cookieConsent', 'accepted');
    // Then load GA
}
</script>
```

---

## Support Resources

- **GA4 Documentation**: https://support.google.com/analytics/answer/9304153
- **YouTube Academy**: https://skillshop.withgoogle.com/analytics
- **Community Forum**: https://support.google.com/analytics/community

---

## Next Steps After Setup

1. ✅ Replace YOUR-GA-ID with your actual Measurement ID
2. ✅ Deploy updated files to your live website
3. ✅ Verify tracking is working (Real-time reports)
4. ✅ Set up conversion events (form submissions)
5. ✅ Create weekly dashboard for key metrics
6. ✅ Schedule monthly analytics review meeting

---

**Need Help?** If you encounter any issues, contact the BrandMark team or reach out to Google Analytics support.

**Last Updated**: January 4, 2026
