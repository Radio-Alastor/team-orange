/**
 * article-view.js
 * Handles loading and displaying individual articles
 * Supports edit and delete operations
 */

// Extract article ID from URL query parameter
function getArticleIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Escape HTML to prevent XSS
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

// Convert Editor.js blocks to HTML
function blocksToHTML(blocks) {
    if (!Array.isArray(blocks)) return '';

    return blocks.map(block => {
        if (!block || !block.data) return '';

        const d = block.data;
        switch (block.type) {
            case 'paragraph':
                return `<p>${escapeHtml(d.text)}</p>`;

            case 'header':
                const level = d.level || 2;
                return `<h${level} class="section-title">${escapeHtml(d.text)}</h${level}>`;

            case 'list':
                const tag = d.style === 'ordered' ? 'ol' : 'ul';
                const items = (d.items || []).map(item => {
                    const content = typeof item === 'string' ? item : (item.content || '');
                    return `<li>${escapeHtml(content)}</li>`;
                }).join('');
                return `<${tag}>${items}</${tag}>`;

            case 'quote':
                return `<blockquote class="analogy"><em>${escapeHtml(d.text)}</em></blockquote>`;

            case 'warning':
                return `<div class="tip-box"><strong>${escapeHtml(d.title)}</strong><p>${escapeHtml(d.message)}</p></div>`;

            case 'image':
                // Prioritize d.url which matches SimpleImage save() method
                const imgSource = d.url || d.imageUrl || d.file?.url || '';
                // If there's no source, prevents render an empty broken image tag
                if (!imgSource) return '';
                // Define the "safe" variables by processing the raw data
                const safeUrl = escapeHtml(imgSource);
                const safeAlt = escapeHtml(d.caption || 'Article image');
                //Uses variables in the HTML string
                return `
        <div class="text-center my-4">
            <img src="${safeUrl}" alt="${safeAlt}" class="img-fluid rounded-3 shadow-sm">
            ${d.caption ? `<p class="text-muted small mt-2">${escapeHtml(d.caption)}</p>` : ''}
        </div>`;

            case 'delimiter':
                return '<hr>';

            default:
                return '';
        }
    }).join('');
}

// Get category display info
function getCategoryInfo(category) {
    const categoryMap = {
        'tech_tutorial': { label: 'Tech Tutorial', color: 'bg-primary' },
        'skill_building': { label: 'Skill Building', color: 'bg-success' },
        'urgent_warning': { label: 'Urgent Warning', color: 'bg-danger' },
        'scam_alert': { label: 'Scam Alert', color: 'bg-warning' }
    };
    return categoryMap[category] || { label: category, color: 'bg-secondary' };
}

// Load and render the article
async function loadAndRenderArticle() {
    const articleId = getArticleIdFromUrl();

    if (!articleId) {
        showError();
        return;
    }

    try {
        // Fetch the article
        const article = ArticleController.getArticleById(parseInt(articleId));

        if (!article) {
            showError();
            return;
        }

        // Render the article
        renderArticle(article);

    } catch (error) {
        console.error('Error loading article:', error);
        showError();
    }
}

// Render article to the page
function renderArticle(article) {
    if (!article) {
        showError();
        return;
    }

    // Hide loading, show article
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('article-container').style.display = 'block';

    // Set page title
    document.title = `${article.title} - Silver Guide`;

    // Set breadcrumb title
    document.getElementById('breadcrumb-title').textContent = article.title;

    // Set article title
    document.getElementById('article-title').textContent = article.title;

    // Set category badge
    const categoryInfo = getCategoryInfo(article.category);
    document.getElementById('article-category').className = `badge ${categoryInfo.color}`;
    document.getElementById('article-category').textContent = categoryInfo.label;

    // Set hero image
    const heroImg = document.getElementById('article-hero');
    heroImg.src = article.heroImage || './imgs/default-placeholder.png';
    heroImg.alt = article.title;

    // Set metadata
    document.getElementById('article-author').textContent = article.author || 'Admin';
    document.getElementById('article-date').textContent = formatDate(article.createdAt);
    document.getElementById('article-description').textContent = article.description;

    // Separate TLDR from main content
    const blocks = article.content?.blocks || [];
    const tldrBlock = blocks.find(b => b.type === 'warning' && b.data?.title?.toLowerCase().includes('tldr'));
    const mainContentBlocks = blocks.filter(b => !(b.type === 'warning' && b.data?.title?.toLowerCase().includes('tldr')));

    // Render TLDR section at the top
    let tldrHtml = '';
    if (tldrBlock) {
        tldrHtml = `
            <div class="mb-5 p-4 rounded-3" style="background-color: #e3f2fd; border-left: 4px solid #1976d2;">
                <div class="d-flex align-items-start">
                    <span class="me-3 fs-4">⭐</span>
                    <div class="flex-grow-1">
                        <h3 class="fw-bold mb-3" style="color: #1565c0;">${escapeHtml(tldrBlock.data.title)}</h3>
                        <p class="mb-0" style="color: #333;">${escapeHtml(tldrBlock.data.message)}</p>
                    </div>
                </div>
            </div>`;
    }

    // Render main content from remaining blocks
    const contentHtml = blocksToHTML(mainContentBlocks);

    // Render emergency help button at the END if article is in scam alert or urgent warning category
    const isScamRelated = article.category === 'scam_alert' || article.category === 'urgent_warning';
    let panicButtonHtml = '';

    if (isScamRelated) {
        panicButtonHtml = `
            <div class="mt-5 p-4 rounded-3 border-0 shadow-sm" style="background-color: #ffebee;">
                <div class="d-flex align-items-center">
                    <div class="me-4 fs-1">🚨</div>
                    <div class="flex-grow-1">
                        <h4 class="fw-bold mb-2" style="color: #d32f2f;">Think you've been scammed?</h4>
                        <p class="mb-3" style="color: #c62828;">Don't wait. Every minute counts when protecting your money.</p>
                        <a href="emergency.html" class="btn btn-danger fw-bold rounded-pill px-4">GET HELP NOW</a>
                    </div>
                </div>
            </div>`;
    }

    // Inject TLDR + content + panic button (in that order)
    document.getElementById('article-content').innerHTML = tldrHtml + contentHtml + panicButtonHtml;

    // Setup action buttons
    setupActionButtons(article.id);
}


// Setup edit and delete button handlers
function setupActionButtons(articleId) {
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    if (editBtn) {
        editBtn.addEventListener('click', () => editArticleFromView(articleId));
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteArticleFromView(articleId));
    }
}

// Edit article
function editArticleFromView(articleId) {
    // Store the article ID so the editor loads this article
    localStorage.setItem('editingArticleId', articleId);
    window.location.href = 'article-editor.html';
}

// Delete article
function deleteArticleFromView(articleId) {
    const article = ArticleController.getArticleById(articleId);

    if (!article) {
        alert('Article not found.');
        return;
    }

    if (confirm(`Are you sure you want to delete "${article.title}"? This cannot be undone.`)) {
        try {
            ArticleController.deleteArticle(articleId);
            alert('Article deleted successfully.');
            window.location.href = 'articles.html';
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article.');
        }
    }
}

// Show error state
function showError() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('article-container').style.display = 'none';
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadAndRenderArticle();
});