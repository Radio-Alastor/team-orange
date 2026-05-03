// ──For fetching url of image to be displayed in article ────────────────────────────
class SimpleImage {
    static get toolbox() {
        return {
            title: 'Image',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        };
    }
    render() {
        const input = document.createElement('input');
        input.placeholder = 'Paste image URL here...';
        input.className = 'form-control form-control-sm'; // Adds Bootstrap styling
        return input;
    }
    save(blockContent) {
        return {
            url: blockContent.value
        };
    }
}

// ── Category metadata ────────────────────────────────────────────
const CATEGORIES = {
    tech_tutorial: { label: 'Tech Tutorial', color: 'primary' },
    skill_building: { label: 'Skill Building', color: 'success' },
    urgent_warning: { label: 'Urgent Warning', color: 'danger' },
    scam_alert: { label: 'Scam Alert', color: 'warning' }
};

// Map categories to their UI Topic IDs in articles.html
const TOPIC_MAP = {
    'tech_tutorial': 'topic-tech-basics',
    'skill_building': 'topic-tech-basics',
    'urgent_warning': 'topic-stay-safe',
    'scam_alert': 'topic-stay-safe'
};

// ── Default template (used when no draft is saved) ───────────────
const DEFAULT_META = {
    title: 'Spotting Phishing Emails',
    category: 'scam_alert',
    description: 'Is that email really from your bank? We teach you how to check sender addresses and avoid suspicious links.',
    author: 'Admin',
    heroImage: './imgs/phishing_alert.png'
};

const DEFAULT_DATA = {
    blocks: [
        {
            type: 'warning',
            data: { 
                title: 'TL;DR (Too Long; Didn\'t Read)', 
                message: 'Add a quick summary or action checklist here for quick learners.' 
            }
        },
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
                items: [
                    { content: 'The sender\'s email address looks odd (e.g. support@amaz0n-help.net instead of @amazon.com)' },
                    { content: 'It creates urgency — "Your account will be closed in 24 hours!"' },
                    { content: 'It asks you to click a link and log in to verify your details' },
                    { content: 'The greeting is generic: "Dear Customer" instead of your name' },
                    { content: 'There are spelling mistakes or the logo looks slightly off' }
                ]
            }
        },
        {
            type: 'quote',
            data: { text: 'Think of it like a fake letter in your letterbox — it might look official, but if you hold it up to the light, the small details give it away.' }
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
                items: [
                    { content: 'Hover your mouse over any link (don\'t click!) and look at the web address that appears at the bottom of the screen — does it match the real company\'s website?' },
                    { content: 'Check the sender\'s full email address by clicking on their name' },
                    { content: 'Go directly to the company\'s website by typing the address into your browser yourself, rather than clicking the link in the email' },
                    { content: 'Call the company on their official number if you\'re still unsure' }
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

// ── Editor.js Tools Configuration ────────────────────────────────
const EDITOR_TOOLS = {
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
};

// ── Saves progress if editor navigates or alt tab away from page ────────────────
window.addEventListener('beforeunload', (event) => {
    // If there is text in the title, warn the user before they leave
    const title = document.getElementById('articleTitle')?.value;
    if (title && title.length > 0) {
        event.preventDefault();
        event.returnValue = ''; 
    }
});

// ── Editor State & Lifecycle ────────────────────────────────────
let editor;
let editingArticleId = localStorage.getItem('editingArticleId') || null;

// On form load, initialize everything
window.addEventListener('DOMContentLoaded', async function() {
    // Check if we're editing an existing article
    if (editingArticleId) {
        await loadArticleForEditing(editingArticleId);
    } else {
        // Fresh editor - load defaults and any unsaved draft
        loadDraftIfExists();
        initializeEditor(DEFAULT_DATA);
    }
    
    // Add change listeners for live preview updates
    const titleEl = document.getElementById('articleTitle');
    const descEl = document.getElementById('articleDesc');
    const authorEl = document.getElementById('articleAuthor');
    const categoryEl = document.getElementById('articleCategory');
    
    if (titleEl) titleEl.addEventListener('input', updateTitlePreview);
    if (descEl) descEl.addEventListener('input', updateDescriptionPreview);
    if (authorEl) authorEl.addEventListener('input', updateAuthorPreview);
    if (categoryEl) categoryEl.addEventListener('change', showCategoryHint);
});

// Load article for editing
async function loadArticleForEditing(articleId) {
    try {
        const article = ArticleController.getArticleById(articleId);
        if (!article) {
            alert('Article not found.');
            editingArticleId = null;
            localStorage.removeItem('editingArticleId');
            return;
        }
        
        // Load metadata
        const titleEl = document.getElementById('articleTitle');
        const categoryEl = document.getElementById('articleCategory');
        const descEl = document.getElementById('articleDesc');
        const authorEl = document.getElementById('articleAuthor');
        
        if (titleEl) titleEl.value = article.title;
        if (categoryEl) categoryEl.value = article.category;
        if (descEl) descEl.value = article.description;
        if (authorEl) authorEl.value = article.author;
        
        // Initialize editor with article content
        initializeEditor(article.content);
        
    } catch (error) {
        console.error('Error loading article:', error);
        alert('Failed to load article for editing.');
        editingArticleId = null;
        localStorage.removeItem('editingArticleId');
    }
}

// Initialize the Editor.js instance
async function initializeEditor(data) {
    editor = new EditorJS({
        holder: 'editorjs',
        autofocus: true,
        onChange: onEditorChange,
        onReady: onEditorReady,
        tools: EDITOR_TOOLS,
        data: data || DEFAULT_DATA,
        placeholder: 'Let\'s start writing!',
    });
}

// Load unsaved draft from localStorage (only if not editing)
function loadDraftIfExists() {
    if (editingArticleId) return; // Don't load draft if editing
    
    const savedDraft = localStorage.getItem('article-draft');
    if (savedDraft) {
        try {
            const draft = JSON.parse(savedDraft);
            const titleEl = document.getElementById('articleTitle');
            const categoryEl = document.getElementById('articleCategory');
            const descEl = document.getElementById('articleDesc');
            const authorEl = document.getElementById('articleAuthor');
            
            if (titleEl && draft.meta.title) titleEl.value = draft.meta.title;
            if (categoryEl && draft.meta.category) categoryEl.value = draft.meta.category;
            if (descEl && draft.meta.description) descEl.value = draft.meta.description;
            if (authorEl && draft.meta.author) authorEl.value = draft.meta.author;
        } catch (e) {
            console.log('Could not load draft:', e.message);
        }
    }
}

// Live preview updates
function updateTitlePreview() {
    const titleEl = document.getElementById('articleTitle');
    if (titleEl) {
        // Could update a preview element if it existed
        console.log('Title updated:', titleEl.value);
    }
}

function updateDescriptionPreview() {
    const descEl = document.getElementById('articleDesc');
    if (descEl) {
        console.log('Description updated:', descEl.value);
    }
}

function updateAuthorPreview() {
    const authorEl = document.getElementById('articleAuthor');
    if (authorEl) {
        console.log('Author updated:', authorEl.value);
    }
}

// Show hint about article numbering based on category
function showCategoryHint() {
    const categoryEl = document.getElementById('articleCategory');
    const hintEl = document.getElementById('idHint');
    
    if (categoryEl && hintEl) {
        const category = categoryEl.value;
        const nextId = ArticleController.getNextIdInCategory(category);
        const categoryLabel = CATEGORIES[category]?.label || 'Unknown';
        hintEl.textContent = `Article will be assigned #${nextId} in ${categoryLabel}`;
    }
}

// Editor lifecycle callbacks
function onEditorReady() {
    console.log('Editor.js is ready to work!');
}

function onEditorChange(api) {
    if (!editor || editingArticleId) return; // DON'T save to the 'article-draft' key if we are editing a published article
    
    // Auto-save draft every change
    editor.save().then((data) => {
        const draft = {
            meta: {
                title: document.getElementById('articleTitle')?.value || '',
                category: document.getElementById('articleCategory')?.value || DEFAULT_META.category,
                description: document.getElementById('articleDesc')?.value || '',
                author: document.getElementById('articleAuthor')?.value || ''
            },
            data: data
        };
        localStorage.setItem('article-draft', JSON.stringify(draft));
    }).catch((e) => {
        console.error('Could not save draft:', e);
    });
}

// ── Publish/Update Workflow ─────────────────────────────────────
async function handlePublish() {
    // Validate form
    const title = document.getElementById('articleTitle')?.value?.trim();
    const category = document.getElementById('articleCategory')?.value;
    const description = document.getElementById('articleDesc')?.value?.trim();
    const author = document.getElementById('articleAuthor')?.value?.trim() || 'Admin';
    const heroImage = document.getElementById('heroImage')?.value?.trim() || './imgs/default-placeholder.png';

    if (!title || !description || !category) {
        alert('Please fill in all required fields (title, category, description).');
        return;
    }
    
    // Save editor content
    let editorData;
    try {
        editorData = await editor.save();
    } catch (e) {
        alert('Error saving editor content.');
        return;
    }
    
    // Check if editing or creating new
    if (editingArticleId) {
        // Update existing
        const confirmUpdate = confirm(
            `Update "${title}" and publish changes?`
        );
        
        if (confirmUpdate) {
            const updated = ArticleController.updateArticle(editingArticleId, {
                title,
                category,
                description,
                author,
                content: editorData,
                updatedAt: new Date().toISOString()
            });
            
            if (updated) {
                alert(`Article "${title}" updated successfully!`);
                clearEditorState();
                location.href = 'articles.html';
            } else {
                alert('Failed to update article.');
            }
        }
    } else {
        // Create new
        const confirmPublish = confirm(
            `Publish "${title}" to articles gallery?`
        );
        
        if (confirmPublish) {
            const payload = {
                title,
                category,
                description,
                author,
                heroImage,
                content: editorData,
                createdAt: new Date().toISOString()
            };
            
            const article = ArticleController.saveArticle(payload);
            if (article) {
                alert(`Article "${title}" published successfully! Article ID: ${article.id}`);
                clearEditorState();                
            } else {
                alert('Failed to publish article.');
            }
        }
    }
}

// Clear editing state and draft
function clearEditorState() {
    // 1. Remove tracking IDs and drafts
    editingArticleId = null;
    localStorage.removeItem('editingArticleId');
    localStorage.removeItem('article-draft');

    // 2. Clear HTML inputs
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleDesc').value = '';
    document.getElementById('articleAuthor').value = 'Admin';
    document.getElementById('heroImage').value = '';
    
    // 3. Clear the Editor.js blocks
    if (editor && typeof editor.blocks?.clear === 'function') {
        editor.blocks.clear();
    }
}

// Convert Editor.js blocks to article HTML (for display)
function blocksToHTML(blocks) {
    return blocks.map(block => {
        const d = block.data;
        switch (block.type) {
            case 'paragraph':
                return `<p>${escapeHtml(d.text)}</p>`;
            case 'header':
                const level = d.level || 2;
                return `<h${level} class="section-title">${escapeHtml(d.text)}</h${level}>`;
            case 'list':
                const tag = d.style === 'ordered' ? 'ol' : 'ul';
                const items = d.items.map(item => `<li>${escapeHtml(item.content || item)}</li>`).join('');
                return `<${tag}>${items}</${tag}>`;
            case 'quote':
                return `<blockquote class="analogy"><em>${escapeHtml(d.text)}</em></blockquote>`;
            case 'warning':
                return `<div class="tip-box"><strong>${escapeHtml(d.title)}</strong><p>${escapeHtml(d.message)}</p></div>`;
            case 'image':
                return `<img src="${escapeHtml(d.url || d.file?.url)}" alt="${escapeHtml(d.caption || '')}" style="max-width: 100%; height: auto;">`;
            case 'delimiter':
                return '<hr>';
            default:
                return '';
        }
    }).join('');
}

// XSS prevention - escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
