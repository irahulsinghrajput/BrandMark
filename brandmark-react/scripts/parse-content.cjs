const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../src/content/blogs');
const DATA_DIR = path.join(__dirname, '../src/data');

function parseContent() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log(`Created content directory: ${CONTENT_DIR}`);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
  
  const blogs = [];

  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, content } = matter(rawContent);
    
    // Create a slug from filename if not in frontmatter
    const slug = data.slug || file.replace(/\.md$/, '');
    
    blogs.push({
      ...data,
      slug,
      content, // we bundle the content so it's searchable and easily renderable without extra fetches
      file: file
    });
  }

  // Sort by date if available
  blogs.sort((a, b) => {
    const dateA = new Date(a.date || a.date_published || 0);
    const dateB = new Date(b.date || b.date_published || 0);
    return dateB - dateA;
  });

  fs.writeFileSync(
    path.join(DATA_DIR, 'blogs.json'),
    JSON.stringify(blogs, null, 2)
  );

  console.log(`Successfully parsed ${blogs.length} blog posts into blogs.json`);
}

parseContent();
