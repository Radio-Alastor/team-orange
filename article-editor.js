
// ── Category metadata ────────────────────────────────────────────
//  Populate categories dynamically with respect to backend categories 
const CATEGORIES = {
    tech:    { label: 'Tech Tutorial',  color: 'primary' },
    skill:   { label: 'Skill Building', color: 'success' },
    warning: { label: 'Urgent Warning', color: 'danger'  },
    scam:    { label: 'Scam Alert',     color: 'warning' }
};

// ── Default template (used when no draft is saved) ───────────────
const DEFAULT_META = {
    title:       'Spotting Phishing Emails',
    category:    'scam',
    description: 'Is that email really from your bank? We teach you how to check sender addresses and avoid suspicious links.',
    readingTime: '5',
    heroImage:   './imgs/phishing_alert.png'
};

const DEFAULT_DATA = {
    blocks: [
        {
            type: 'paragraph',
            data: { text: '"Phishing" (pronounced "fishing") is when a scammer sends you an email pretending to be someone you trust — your bank, Australia Post, myGov, or even a family member. Their goal is to trick you into clicking a link and entering your personal details.' }
        },
        {
            type: 'header',
            data: { text: 'The Tell-Tale Signs of a Phishing Email', level: 2 }
        },
        {
            type: 'list',
            data: {
                style: 'unordered',
                meta: {},
                items: [
                    { content: 'The sender\'s email address looks odd (e.g. support@amaz0n-help.net instead of @amazon.com)', meta: {}, items: [] },
                    { content: 'It creates urgency — "Your account will be closed in 24 hours!"', meta: {}, items: [] },
                    { content: 'It asks you to click a link and log in to verify your details', meta: {}, items: [] },
                    { content: 'The greeting is generic: "Dear Customer" instead of your name', meta: {}, items: [] },
                    { content: 'There are spelling mistakes or the logo looks slightly off', meta: {}, items: [] }
                ]
            }
        },
        {
            type: 'quote',
            data: { text: 'Think of it like a fake letter in your letterbox — it might look official, but if you hold it up to the light, the small details give it away.', caption: '' }
        },
        {
            type: 'header',
            data: { text: 'How to Check if an Email Is Real', level: 2 }
        },
        {
            type: 'paragraph',
            data: { text: 'Before clicking anything, try these quick checks:' }
        },
        {
            type: 'list',
            data: {
                style: 'ordered',
                meta: {},
                items: [
                    { content: 'Hover your mouse over any link (don\'t click!) and look at the web address that appears at the bottom of the screen — does it match the real company\'s website?', meta: {}, items: [] },
                    { content: 'Check the sender\'s full email address by clicking on their name', meta: {}, items: [] },
                    { content: 'Go directly to the company\'s website by typing the address into your browser yourself, rather than clicking the link in the email', meta: {}, items: [] },
                    { content: 'Call the company on their official number if you\'re still unsure', meta: {}, items: [] }
                ]
            }
        },
        {
            type: 'warning',
            data: { title: 'When in doubt, don\'t click', message: 'Legitimate companies like your bank or myGov will never email you asking for your password or full credit card number. If an email asks for this, it is a scam.' }
        },
        {
            type: 'delimiter',
            data: {}
        },
        {
            type: 'paragraph',
            data: { text: 'If you think you\'ve clicked a phishing link and entered your details, change your password immediately and call your bank. You can also report phishing emails to the Australian Cyber Security Centre at cyber.gov.au/report.' }
        }
    ]
};

// ── Initialise Editor.js ─────────────────────────────────────────
const draft = localStorage.getItem('articleEditorDraft');

if (!draft) {
    document.getElementById('articleTitle').value       = DEFAULT_META.title;
    document.getElementById('articleCategory').value    = DEFAULT_META.category;
    document.getElementById('articleDesc').value        = DEFAULT_META.description;
    document.getElementById('readingTime').value        = DEFAULT_META.readingTime;
    document.getElementById('heroImage').value          = DEFAULT_META.heroImage;
}

const editor = new EditorJS({
    holder: 'editorjs',
    placeholder: 'Start writing your article… press Tab to add a block.',
    data: draft ? JSON.parse(draft) : DEFAULT_DATA,
    tools: {
        header: {
            class: Header,
            config: { levels: [2, 3, 4], defaultLevel: 2 }
        },
        list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: { defaultStyle: 'unordered' }
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
                quotePlaceholder: 'Enter analogy or quote…',
                captionPlaceholder: 'Source or caption (optional)'
            }
        },
        warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
                titlePlaceholder: 'Tip title (e.g. Safety First)',
                messagePlaceholder: 'Tip content…'
            }
        },
        image: SimpleImage,
        delimiter: Delimiter
    },
    onReady: () => { console.log('Editor.js ready'); },
    onChange: async (api) => {
        const data = await api.saver.save();
        localStorage.setItem('articleEditorDraft', JSON.stringify(data));
    }
});

// ── Convert Editor.js blocks to article HTML ─────────────────────
function blocksToHTML(blocks) {
    return blocks.map(block => {
        const d = block.data;
        switch (block.type) {
            case 'paragraph':
                return `            <p>${d.text}</p>`;

            case 'header': {
                const tag = `h${d.level}`;
                const cls = d.level === 2 ? ' class="section-title"' : '';
                return `            <${tag}${cls}>${d.text}</${tag}>`;
            }

            case 'list': {
                const tag = d.style === 'ordered' ? 'ol' : 'ul';
                // Handle both string items (older API) and { content } objects (newer API)
                const items = d.items
                    .map(i => `                <li class="mb-2">${i.content ?? i}</li>`)
                    .join('\n');
                return `            <${tag}>\n${items}\n            </${tag}>`;
            }

            case 'quote':
                return `            <div class="analogy mb-4">\n                <p class="mb-0">${d.text}</p>\n            </div>`;

            case 'warning':
                return `            <div class="tip-box">\n                <h5 class="fw-bold">${d.title}</h5>\n                <p class="mb-0">${d.message}</p>\n            </div>`;

            case 'image':
                return `            <img src="${d.url}" alt="${d.caption || ''}" class="img-fluid rounded mb-4">`;

            case 'delimiter':
                return `            <hr class="my-5">`;

            default:
                return '';
        }
    }).filter(Boolean).join('\n\n');
}

// ── Generate full article HTML ───────────────────────────────────
async function generateHTML() {
    const data        = await editor.save();
    const title       = document.getElementById('articleTitle').value || 'Article Title';
    const catKey      = document.getElementById('articleCategory').value;
    const cat         = CATEGORIES[catKey];
    const readingTime = document.getElementById('readingTime').value || '5';
    const heroImg     = document.getElementById('heroImage').value.trim();
    const content     = blocksToHTML(data.blocks);

    const heroTag = heroImg
        ? `\n            <img src="${heroImg}" class="article-header-img shadow-sm" alt="${title}">\n`
        : '';

    const html =
`<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Silver Guide - ${title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap"
rel="stylesheet">
<link rel="stylesheet" href="./css/styles.css">
<style>
.article-container { max-width: 900px; background-color: white; border-radius: 2rem; padding: 3rem; box-shadow: 0 1rem 3rem rgba(0,0,0,0.05); margin-bottom: 5rem; }
.article-header-img { width: 100%; height: 400px; object-fit: cover; border-radius: 1.5rem; margin-bottom: 2rem; }
.section-title { color: #1a1a1a; border-left: 5px solid #dfff6f; padding-left: 1rem; margin-top: 3rem; margin-bottom: 1.5rem; }
.tip-box { background-color: #f8f9fa; border-left: 5px solid #75adf6; padding: 1.5rem; border-radius: 0 1rem 1rem 0; margin: 2rem 0; }
.analogy { font-style: italic; color: #555; background-color: #fcfcfc; padding: 1rem; border-radius: 1rem; border: 1px dashed #dee2e6; }
</style>
</head>

<body>
<nav class="navbar sticky-top navbar-expand-lg navbar-light border-bottom" style="background-color: #f8f9fa;">
<div class="container">
    <a class="me-3" href="index.html">
        <img src="./imgs/logo.svg" alt="SilverGuide Logo" width="60" height="60" class="d-inline-block align-text-top">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-nav me-auto mb-2 mb-lg-0 collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="nav nav-underline align-items-center mx-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link active" href="articles.html">Learn</a></li>
            <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
        </ul>
        <div class="d-flex align-items-center">
            <a class="btn btn-outline-primary btn-sm me-2" href="login.html">Sign In</a>
            <a class="btn btn-primary btn-sm" href="register.html">Register</a>
        </div>
    </div>
</div>
</nav>

<main class="container py-5 d-flex justify-content-center">
<article class="article-container">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item"><a href="articles.html" class="text-decoration-none text-muted">Articles</a></li>
            <li class="breadcrumb-item active" aria-current="page">${title}</li>
        </ol>
    </nav>

    <span class="badge text-${cat.color} bg-${cat.color}-subtle mb-3 d-inline-block"
        style="font-size:0.9rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05rem;">${cat.label}</span>
    <h1 class="display-4 fw-bold mb-4">${title}</h1>
    <p class="text-muted mb-4">Estimated reading time: ${readingTime} minutes</p>
${heroTag}
${content}

    <div class="text-center mt-5">
        <a href="articles.html" class="btn btn-outline-secondary btn-lg rounded-pill px-5">Back to Articles</a>
    </div>
</article>
</main>

<footer class="py-5 border-top" style="background-color: #f8f9fa;">
<div class="container">
    <div class="row">
        <div class="col-md-6 text-start">
            <a class="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none" href="index.html">
                <img src="./imgs/logo.svg" alt="SilverGuide Logo" width="60" height="60" class="d-inline-block align-text-top">
            </a>
            <h6 class="text-body-secondary">Helping you navigate the digital world</h6>
            <p class="text-muted">&copy; 2026 The Silver Guide Website, All rights reserved.</p>
        </div>
        <div class="col-md-6 text-end">
            <ul class="list-unstyled mb-0">
                <li class="nav-item mb-2"><a href="#contact" class="nav-link p-0 text-body-secondary">Contact Us</a></li>
                <li class="nav-item mb-2"><a href="about.html" class="nav-link p-0 text-body-secondary">About Us</a></li>
                <li class="nav-item mb-2"><a href="#faq" class="nav-link p-0 text-body-secondary">FAQs</a></li>
            </ul>
        </div>
    </div>
</div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"><\/script>
</body>
</html>`;

    document.getElementById('outputHTML').textContent = html;
    new bootstrap.Modal(document.getElementById('outputModal')).show();
}

// ── Load example template ────────────────────────────────────────
function loadExample() {
    if (!confirm('This will replace the current content with the example article. Continue?')) return;
    editor.render(DEFAULT_DATA);
    document.getElementById('articleTitle').value    = DEFAULT_META.title;
    document.getElementById('articleCategory').value = DEFAULT_META.category;
    document.getElementById('articleDesc').value     = DEFAULT_META.description;
    document.getElementById('readingTime').value     = DEFAULT_META.readingTime;
    document.getElementById('heroImage').value       = DEFAULT_META.heroImage;
    localStorage.removeItem('articleEditorDraft');
}

// ── Log raw JSON to console (debug) ─────────────────────────────
async function saveJSON() {
    const data = await editor.save();
    const output = {
        title:       document.getElementById('articleTitle').value,
        category:    document.getElementById('articleCategory').value,
        description: document.getElementById('articleDesc').value,
        readingTime: document.getElementById('readingTime').value,
        heroImage:   document.getElementById('heroImage').value,
        content:     data
    };
    console.log('Article JSON:', JSON.stringify(output, null, 2));
    alert('Article data logged to console (F12 → Console).');
}

// ── Save article to backend ──────────────────────────────────────
async function saveToBackend() {
    const editorData = await editor.save();
    const payload = {
        title:     document.getElementById('articleTitle').value,
        summary:   document.getElementById('articleDesc').value,
        imageUrl:  document.getElementById('heroImage').value,
        content:   JSON.stringify(editorData),
        topicId:   parseInt(document.getElementById('articleTopic').value) || null,
        published: false
    };

    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be signed in to save articles.');
        return;
    }

    try {
        const res = await fetch('/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (res.status === 401) { alert('Session expired — please sign in again.'); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const article = await res.json();
        localStorage.removeItem('articleEditorDraft');
        alert(`Article saved (id: ${article.id})`);
    } catch (err) {
        console.warn('Backend not available, payload logged:', payload);
        alert('Backend not available. Payload logged to console (F12).');
    }
}

// ── Copy generated HTML to clipboard ────────────────────────────
function copyHTML() {
    navigator.clipboard.writeText(document.getElementById('outputHTML').textContent)
        .then(() => alert('Copied to clipboard!'))
        .catch(() => alert('Copy failed — please select all and copy manually.'));
}