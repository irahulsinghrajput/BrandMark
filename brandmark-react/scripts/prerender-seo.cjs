const fs = require('fs');
const path = require('path');

const { pathToFileURL } = require('url');
const { appRoutes } = require('./routes.cjs');

const SSR_ENTRY = path.join(__dirname, '../dist-ssr/entry-prerender.js');
const DIST_DIR = path.join(__dirname, '../dist');
const DATA_DIR = path.join(__dirname, '../src/data');
const BASE_URL = 'https://www.brandmarksolutions.site';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  if (!md) return '';
  // Strip frontmatter and stray YAML metadata lines
  let content = md.replace(/^---[\s\S]*?---/, '');
  content = content.replace(/cover_image:\s*["'][^"']*["']/g, '');
  content = content.replace(/schema_type:\s*\w+/g, '');
  content = content.replace(/^---$/gm, '<hr style="margin:2rem 0;border:0;border-top:1px solid #E2E8F0;" />');
  content = content.trim();
  content = content.replace(/\r\n/g, '\n');

  // Code blocks
  content = content.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre style="background:#0F172A;color:#E2E8F0;padding:1rem;border-radius:0.75rem;overflow-x:auto;"><code>${escapeHtml(code)}</code></pre>`;
  });

  // Blockquotes
  content = content.replace(/^\> (.*$)/gim, '<blockquote style="border-left:4px solid #f97316;padding-left:1rem;margin:1rem 0;color:#475569;font-style:italic;"><p>$1</p></blockquote>');

  // Headings
  content = content.replace(/^### (.*$)/gim, '<h3 style="font-size:1.35rem;font-weight:700;color:#0B2C4D;margin:1.75rem 0 0.75rem;">$1</h3>');
  content = content.replace(/^## (.*$)/gim, '<h2 style="font-size:1.75rem;font-weight:800;color:#0B2C4D;margin:2.25rem 0 1rem;border-bottom:1px solid #E2E8F0;padding-bottom:0.5rem;">$1</h2>');
  content = content.replace(/^# (.*$)/gim, '<h1 style="font-size:2.25rem;font-weight:900;color:#0B2C4D;margin:2rem 0 1rem;">$1</h1>');

  // Bold & Italic
  content = content.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Images
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:1rem;margin:1.5rem 0;box-shadow:0 4px 12px rgba(0,0,0,0.08);" loading="lazy" />');

  // Links
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#f97316;text-decoration:underline;font-weight:500;">$1</a>');

  // List items
  content = content.replace(/^\s*[-*]\s+(.*)$/gim, '<li style="margin-bottom:0.5rem;">$1</li>');

  // Group <li> into <ul>
  content = content.replace(/((?:<li style="margin-bottom:0.5rem;">.*?<\/li>\s*)+)/g, '<ul style="list-style-type:disc;padding-left:1.5rem;margin:1.25rem 0;color:#334155;">$1</ul>');

  // Paragraphs
  const blocks = content.split(/\n{2,}/);
  const htmlBlocks = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (
      block.startsWith('<h1') ||
      block.startsWith('<h2') ||
      block.startsWith('<h3') ||
      block.startsWith('<pre') ||
      block.startsWith('<ul') ||
      block.startsWith('<blockquote') ||
      block.startsWith('<img')
    ) {
      return block;
    }
    return `<p style="font-size:1.125rem;line-height:1.8;color:#334155;margin-bottom:1.5rem;">${block.replace(/\n/g, '<br />')}</p>`;
  });

  return htmlBlocks.join('\n');
}

function buildHtmlPage(templateHtml, {
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  publishedDate,
  author,
  category,
  schemas = [],
  bodyHtml = ''
}) {
  let html = templateHtml;

  // 1. Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // 2. Meta description
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${escapeHtml(description)}" />\n</head>`);
  }

  // 3. Canonical URL
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n</head>`);
  }

  // 4. OpenGraph & Twitter tags
  const ogTags = `
    <!-- Specific Page SEO Metadata -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:image" content="${escapeHtml(ogImage || `${BASE_URL}/brandmark-logo-new.png.webp`)}" />
    <meta property="og:site_name" content="BrandMark Media Solutions Pvt Ltd" />
    ${publishedDate ? `<meta property="article:published_time" content="${escapeHtml(publishedDate)}" />` : ''}
    ${author ? `<meta property="article:author" content="${escapeHtml(author)}" />` : ''}
    ${category ? `<meta property="article:section" content="${escapeHtml(category)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage || `${BASE_URL}/brandmark-logo-new.png.webp`)}" />
`;

  // 5. Injected Schemas
  const schemaScripts = schemas.map(s => `
    <script type="application/ld+json">
    ${JSON.stringify(s, null, 2)}
    </script>`).join('\n');

  html = html.replace('</head>', `${ogTags}\n${schemaScripts}\n</head>`);

  // 6. Body content inside <div id="root"></div>
  if (bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }

  return html;
}

async function prerenderSeo() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`Dist index.html not found at ${indexHtmlPath}. Run vite build first.`);
    return;
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  let blogs = [];
  try {
    blogs = require(path.join(DATA_DIR, 'blogs.json'));
  } catch (e) {
    console.warn('Could not load blogs.json', e);
  }

  console.log(`Starting SSG Pre-rendering for ${blogs.length} blogs and core directory routes...`);

  // ------------------------------------------------------------------------
  // 1. PRERENDER EACH INDIVIDUAL BLOG POST
  // ------------------------------------------------------------------------
  blogs.forEach((blog) => {
    const slug = blog.slug || blog.id;
    const blogUrl = `${BASE_URL}/blog/${slug}`;
    const coverUrl = blog.cover_image
      ? (blog.cover_image.startsWith('http') ? blog.cover_image : `${BASE_URL}${blog.cover_image}`)
      : `${BASE_URL}/images/blogs/${slug}.jpg`;
    const authorName = blog.author || 'BrandMark Team';
    const pubDate = (blog.date_published || blog.date || new Date().toISOString()).split('T')[0];
    const modDate = (blog.date_modified || blog.date_published || blog.date || pubDate).split('T')[0];
    const desc = blog.description || blog.excerpt || `Read ${blog.title} by ${authorName} on the official BrandMark Media Solutions website.`;
    const pageTitle = `${blog.title} | BrandMark Media Solutions Pvt Ltd`;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": desc,
      "image": [coverUrl],
      "datePublished": pubDate,
      "dateModified": modDate,
      "author": {
        "@type": "Person",
        "name": authorName,
        "url": `${BASE_URL}/about`
      },
      "publisher": {
        "@type": "Organization",
        "name": "BrandMark Media Solutions Private Limited",
        "legalName": "BrandMark Media Solutions Private Limited",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/brandmark-logo-new.png.webp`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blogUrl
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${BASE_URL}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": blog.title,
          "item": blogUrl
        }
      ]
    };

    // Semantic HTML body for search engine crawlers & immediate first-paint
    const articleHtml = markdownToHtml(blog.content || desc);

    const relatedBlogs = blogs
      .filter(b => (b.slug || b.id) !== slug && (b.category === blog.category || !blog.category))
      .slice(0, 3);

    const relatedHtml = relatedBlogs.length > 0 ? `
      <section style="margin-top:4rem;padding-top:2.5rem;border-top:1px solid #E2E8F0;">
        <h3 style="font-size:1.5rem;font-weight:700;color:#0B2C4D;margin-bottom:1.5rem;">Recommended Articles</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:1.5rem;">
          ${relatedBlogs.map(r => `
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:1rem;padding:1.25rem;">
              <span style="font-size:0.75rem;font-weight:700;color:#f97316;text-transform:uppercase;">${escapeHtml(r.category || 'Article')}</span>
              <h4 style="font-size:1.1rem;font-weight:700;margin:0.5rem 0;color:#0B2C4D;">
                <a href="/blog/${escapeHtml(r.slug || r.id)}" style="color:#0B2C4D;text-decoration:none;">${escapeHtml(r.title)}</a>
              </h4>
              <p style="font-size:0.875rem;color:#64748B;line-height:1.5;">${escapeHtml((r.excerpt || r.description || '').substring(0, 110))}...</p>
            </div>
          `).join('')}
        </div>
      </section>
    ` : '';

    const bodyHtml = `
      <main style="min-height:100vh;background:#ffffff;padding-top:6rem;padding-bottom:5rem;font-family:system-ui,-apple-system,sans-serif;">
        <article style="max-width:850px;margin:0 auto;padding:0 1.5rem;">
          <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#64748B;margin-bottom:1.5rem;">
            <a href="/" style="color:#64748B;text-decoration:none;">Home</a> &gt; 
            <a href="/blog" style="color:#64748B;text-decoration:none;">Blog</a> &gt; 
            <span style="color:#0B2C4D;font-weight:600;">${escapeHtml(blog.category || 'Article')}</span>
          </nav>
          
          <header style="margin-bottom:2.5rem;">
            ${blog.category ? `<div style="display:inline-block;padding:0.35rem 1rem;background:rgba(249,115,22,0.1);color:#f97316;font-weight:700;font-size:0.875rem;border-radius:9999px;margin-bottom:1rem;">${escapeHtml(blog.category)}</div>` : ''}
            <h1 style="font-size:2.5rem;font-weight:900;line-height:1.2;color:#0B2C4D;margin-bottom:1.25rem;">
              ${escapeHtml(blog.title)}
            </h1>
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:1.5rem;color:#64748B;font-size:0.9rem;">
              <span>By <strong>${escapeHtml(authorName)}</strong></span>
              <span>Published on <strong>${escapeHtml(pubDate)}</strong></span>
            </div>
          </header>

          <div style="margin-bottom:2.5rem;border-radius:1rem;overflow:hidden;">
            <img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(blog.title)}" style="width:100%;height:auto;max-height:480px;object-fit:cover;border-radius:1rem;" />
          </div>

          <div class="blog-content" style="font-size:1.125rem;line-height:1.8;color:#334155;">
            ${articleHtml}
          </div>

          ${relatedHtml}
        </article>
      </main>
    `;

    const blogPageHtml = buildHtmlPage(templateHtml, {
      title: pageTitle,
      description: desc,
      canonicalUrl: blogUrl,
      ogImage: coverUrl,
      ogType: 'article',
      publishedDate: pubDate,
      author: authorName,
      category: blog.category,
      schemas: [articleSchema, breadcrumbSchema],
      bodyHtml
    });

    // Write to /blog/:slug/index.html
    const blogDir = path.join(DIST_DIR, 'blog', slug);
    fs.mkdirSync(blogDir, { recursive: true });
    fs.writeFileSync(path.join(blogDir, 'index.html'), blogPageHtml, 'utf8');

    // Also write /blog/:slug.html for fallback server matchers
    fs.writeFileSync(path.join(DIST_DIR, 'blog', `${slug}.html`), blogPageHtml, 'utf8');
  });

  // ------------------------------------------------------------------------
  // 2. PRERENDER /blog DIRECTORY PAGE
  // ------------------------------------------------------------------------
  const blogDirectoryTitle = "Digital Marketing, SEO & AI Growth Blog | BrandMark Media Solutions Pvt Ltd";
  const blogDirectoryDesc = "Explore all 27+ expert guides, case studies, and business growth strategies from BrandMark Media Solutions Private Limited (BrandMark Solutions) in Patna, Bihar.";
  const blogDirectoryUrl = `${BASE_URL}/blog`;

  const blogDirectorySchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "BrandMark Media Solutions Insights & Blog",
    "url": blogDirectoryUrl,
    "description": blogDirectoryDesc,
    "publisher": {
      "@type": "Organization",
      "name": "BrandMark Media Solutions Private Limited",
      "url": BASE_URL,
      "logo": `${BASE_URL}/brandmark-logo-new.png.webp`
    }
  };

  const blogDirectoryBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": blogDirectoryUrl
      }
    ]
  };

  const blogGridHtml = `
    <main style="min-height:100vh;background:#ffffff;padding-top:6rem;padding-bottom:5rem;font-family:system-ui,-apple-system,sans-serif;">
      <section style="background:#0B2C4D;color:#ffffff;padding:4rem 1.5rem;text-align:center;border-radius:1.5rem;max-width:1200px;margin:0 auto 3.5rem;">
        <h1 style="font-size:3rem;font-weight:900;margin-bottom:1rem;">Our Latest <span style="color:#f97316;">Insights</span></h1>
        <p style="font-size:1.25rem;color:#cbd5e1;max-width:750px;margin:0 auto;">
          Actionable strategies, case studies, and growth playbooks by BrandMark Media Solutions Private Limited.
        </p>
      </section>

      <section style="max-width:1200px;margin:0 auto;padding:0 1.5rem;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:2rem;">
          ${blogs.map(b => {
            const bSlug = b.slug || b.id;
            const bCover = b.cover_image
              ? (b.cover_image.startsWith('http') ? b.cover_image : `${BASE_URL}${b.cover_image}`)
              : `${BASE_URL}/images/blogs/${bSlug}.jpg`;
            return `
              <article style="background:#ffffff;border:1px solid #E2E8F0;border-radius:1.25rem;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);display:flex;flex-direction:column;">
                <div style="height:200px;background:#0B2C4D;overflow:hidden;">
                  <img src="${escapeHtml(bCover)}" alt="${escapeHtml(b.title)}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />
                </div>
                <div style="padding:1.5rem;flex:1;display:flex;flex-direction:column;">
                  <span style="font-size:0.75rem;font-weight:700;color:#f97316;text-transform:uppercase;margin-bottom:0.5rem;">${escapeHtml(b.category || 'Article')}</span>
                  <h2 style="font-size:1.25rem;font-weight:700;color:#0B2C4D;margin:0 0 0.75rem;line-height:1.35;">
                    <a href="/blog/${escapeHtml(bSlug)}" style="color:#0B2C4D;text-decoration:none;">${escapeHtml(b.title)}</a>
                  </h2>
                  <p style="font-size:0.95rem;color:#64748B;line-height:1.6;margin-bottom:1.5rem;flex:1;">
                    ${escapeHtml((b.excerpt || b.description || '').substring(0, 140))}...
                  </p>
                  <div style="font-size:0.875rem;color:#94A3B8;display:flex;justify-content:space-between;border-top:1px solid #F1F5F9;padding-top:1rem;">
                    <span>${escapeHtml(b.author || 'BrandMark Team')}</span>
                    <span>${escapeHtml((b.date_published || b.date || '').split('T')[0])}</span>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    </main>
  `;

  const blogIndexHtml = buildHtmlPage(templateHtml, {
    title: blogDirectoryTitle,
    description: blogDirectoryDesc,
    canonicalUrl: blogDirectoryUrl,
    ogType: 'website',
    schemas: [blogDirectorySchema, blogDirectoryBreadcrumb],
    bodyHtml: blogGridHtml
  });

  const blogRoot = path.join(DIST_DIR, 'blog');
  fs.mkdirSync(blogRoot, { recursive: true });
  fs.writeFileSync(path.join(blogRoot, 'index.html'), blogIndexHtml, 'utf8');

  // ------------------------------------------------------------------------
  // 3. RENDER EVERY OTHER PUBLIC PAGE FROM THE REACT APP
  // ------------------------------------------------------------------------
  const { render } = await import(pathToFileURL(SSR_ENTRY).href);
  const problems = [];

  for (const route of appRoutes) {
    const { html, errors } = await render(route);
    const { head, body } = splitHead(html);
    const title = /<title[^>]*>([^<]+)<\/title>/.test(head);
    const canonical = head.includes(`href="${BASE_URL}${route === '/' ? '' : route}"`);
    const words = body.replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    if (errors.length || !title || !canonical || words < 100 || /noindex/.test(head)) {
      problems.push(`${route}: title=${title} canonical=${canonical} words=${words} ${errors.map((e) => e.message).join('; ')}`);
    }
    const page = templateHtml
      // the page brings its own title, description, canonical, etc. (exactly one of each)
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/\s*<meta name="(description|keywords)"[^>]*>/gi, '')
      .replace(/\s*<link rel="canonical"[^>]*>/gi, '')
      .replace('</head>', () => `${head}\n</head>`)
      .replace('<div id="root"></div>', () => `<div id="root" hidden></div><div id="prerendered">${body}</div>`);
    const dir = path.join(DIST_DIR, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page, 'utf8');
  }

  // Empty app page for private/unknown URLs (dashboards, login, wrong links): never indexed,
  // and without the home page's canonical or content.
  const shell = templateHtml
    .replace(/\s*<link rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta name="(googlebot|bingbot)"[^>]*>/gi, '')
    .replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="noindex" />');
  fs.mkdirSync(path.join(DIST_DIR, 'app-shell'), { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'app-shell', 'index.html'), shell, 'utf8');

  if (problems.length) {
    throw new Error(`Prerender problems on ${problems.length} page(s):\n${problems.join('\n')}`);
  }
  console.log(`Pre-rendered ${appRoutes.length} app pages, ${blogs.length} blogs and the blog directory.`);
}

// React puts the page's title/meta/link tags at the very start of its output.
function splitHead(html) {
  const tags = [];
  let rest = html;
  let m;
  while ((m = rest.match(/^\s*(<title[^>]*>[\s\S]*?<\/title>|<meta[^>]*>|<link[^>]*>)/))) {
    if (!/rel="preload"/.test(m[1])) tags.push(m[1].replace(/^<(\w+)/, '<$1 data-prerender'));
    rest = rest.slice(m[0].length);
  }
  // animation start states (opacity:0) would hide the content until JavaScript runs
  const body = rest.replace(/opacity:0(?=[;"])/g, 'opacity:1');
  return { head: tags.join('\n'), body };
}

prerenderSeo().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
