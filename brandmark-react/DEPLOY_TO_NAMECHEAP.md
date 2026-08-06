# Deploying BrandMark to Namecheap Shared Hosting

Your project has been successfully prepared and compiled for Namecheap Shared Hosting. 

## What was done?
1. **Removed Localhost Dependencies:** Verified that all API and webhook endpoints strictly use environment variables (`VITE_SUPABASE_URL`, `VITE_API_URL`, etc.) with no hardcoded fallback to localhost.
2. **Generated Production Build:** Executed `npm run build` to generate the optimized, static production bundle in the `dist` folder.
3. **Configured Apache Routing:** Added a `.htaccess` file so that Namecheap's Apache server properly routes all traffic back to `index.html`. This ensures React Router (history mode) works correctly without throwing "404 Not Found" errors when users refresh the page.

---

## Exact Upload Instructions (cPanel)

Follow these steps exactly to get your site live on Namecheap:

### Step 1: Locate your compiled files
1. On your computer, navigate to your project folder: `brandmark-react/dist`.
2. Inside the `dist` folder, you will see `index.html`, `assets/`, `.htaccess`, and other static files.
3. **Zip the contents** of the `dist` folder (do not zip the folder itself, select all files *inside* the folder and compress them into `dist.zip`).

### Step 2: Upload to Namecheap
1. Log into your **Namecheap Account** and go to **cPanel**.
2. Open the **File Manager**.
3. Navigate to the root folder of your domain (usually `public_html` for your primary domain, or `yourdomain.com` for an addon domain).
4. Click **Upload** in the top menu and select your `dist.zip` file.
5. Once uploaded, return to the File Manager, right-click `dist.zip`, and select **Extract**.
6. Ensure that the files (`index.html`, `.htaccess`, etc.) sit directly inside `public_html`.

### Step 3: Verify the hidden `.htaccess` file
1. In the top right of the cPanel File Manager, click **Settings**.
2. Check the box for **"Show Hidden Files (dotfiles)"** and click Save.
3. Verify that the `.htaccess` file was successfully extracted. This file is critical for your page routing!

### Step 4: Add Environment Variables (If using Vercel/Netlify instead)
If you decide to deploy this static bundle to Vercel/Netlify/Hostinger later, you must configure the following in their dashboard. For Namecheap, these variables were already baked into your static files during the build process using your local `.env.local`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_N8N_WEBHOOK_URL`

Your application is now fully deployed! Visit your domain in the browser to verify.
