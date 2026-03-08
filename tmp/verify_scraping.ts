import { load } from 'cheerio';

function mockScrapeArticleContent(html: string) {
    const $ = load(html);

    // List of selectors to remove (navigation, ads, etc.)
    const selectorsToRemove = [
        'script', 'style', 'nav', 'header', 'footer', 'aside',
        '#nav', '#header', '#footer', '#sidebar',
        '.nav', '.navbar', '.header', '.footer', '.sidebar', '.menu',
        '.advertisement', '.ads', '.ad', '.social-share', '.related-posts',
        'div[class*="nav"]', 'div[class*="navbar"]', 'div[class*="menu"]',
        'nav[class*="nav"]', 'header[class*="header"]', 'footer[class*="footer"]'
    ];

    selectorsToRemove.forEach(selector => {
        $(selector).remove();
    });

    // Try to find the main content element
    let contentElement = $('article');
    if (contentElement.length === 0) {
        contentElement = $('main');
    }
    if (contentElement.length === 0) {
        // Fallback to div with common content classes
        contentElement = $('.article-content, .post-content, .entry-content, #content, .content');
    }
    if (contentElement.length === 0) {
        contentElement = $('body');
    }

    // Extract the content
    let content = contentElement.html() || '';

    // Clean up the content - remove extra whitespace and empty tags
    content = content.replace(/\s+/g, ' ').trim();
    content = content.replace(/<p>\s*<\/p>/g, '');
    content = content.replace(/<div>\s*<\/div>/g, '');

    return content;
}

const testHtml = `
<html>
<head><title>Test</title></head>
<body>
    <nav>This is a nav element</nav>
    <div class="navbar-top">This is a navbar div</div>
    <header class="main-header">Main Header</header>
    <main>
        <article>
            <h1>My Awesome Article</h1>
            <p>This is the content that should stay.</p>
            <div class="nav-links">Related links (should be removed)</div>
        </article>
    </main>
    <footer class="site-footer">Footer Content</footer>
</body>
</html>
`;

const result = mockScrapeArticleContent(testHtml);
console.log('--- Result ---');
console.log(result);
console.log('--- End ---');

if (result.includes('nav') || result.includes('navbar') || result.includes('Header') || result.includes('Footer')) {
    console.log('FAIL: Navigation elements found in result');
} else if (result.includes('content that should stay')) {
    console.log('SUCCESS: Content preserved and navigation removed');
} else {
    console.log('FAIL: Content not found');
}
