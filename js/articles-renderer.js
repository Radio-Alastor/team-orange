/**
 * articles-renderer.js
 * Responsible for turning JSON data into visual cards on articles.html
 * Handles real-time updates when articles are published
 */

// Topic mapping - matches article categories to container IDs
const TOPIC_MAP = {
    'tech_tutorial': 'topic-tech-basics',
    'skill_building': 'topic-tech-basics',
    'urgent_warning': 'topic-stay-safe',
    'scam_alert': 'topic-stay-safe'
};

document.addEventListener('DOMContentLoaded', () => {
    renderAllArticles();

});

function renderAllArticles() {
    // 1. Get all articles from ArticleController
    const allArticles = ArticleController.getAllArticles();

    // 2. Get container references
    const techBasicsContainer = document.getElementById('topic-tech-basics');
    const staySafeContainer = document.getElementById('topic-stay-safe');

    if (!techBasicsContainer || !staySafeContainer) {
        console.warn('Article containers not found in DOM');
        return;
    }

    // 3. Clear both containers completely of all dynamic cards
    techBasicsContainer.innerHTML = '';
    staySafeContainer.innerHTML = '';

    if (allArticles.length === 0) {
        techBasicsContainer.innerHTML = '<p class="text-muted">No articles found.</p>';
        return;
    }

    // 4. Filter and render
    allArticles.forEach(article => {
        const cardHtml = createArticleCard(article);
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4'; // Standard Bootstrap grid sizing
        col.setAttribute('data-article-id', article.id);
        col.innerHTML = cardHtml;

        // Use the map to find the right container
        const containerId = TOPIC_MAP[article.category] || 'topic-tech-basics';
        const targetContainer = document.getElementById(containerId);

        if (targetContainer) {
            targetContainer.appendChild(col);
        }
    });

    // 3. Handle Empty States (Optional but recommended)
    if (techBasicsContainer.children.length === 0) {
        techBasicsContainer.innerHTML = '<p class="text-muted ps-3">No technology guides available yet.</p>';
    }
    if (staySafeContainer.children.length === 0) {
        staySafeContainer.innerHTML = '<p class="text-muted ps-3">No safety alerts available yet.</p>';
    }
}

function createArticleCard(article) {
    // Get category label and color
    const categoryKey = article.category;
    const categoryMap = {
        'tech_tutorial': { label: 'Tech Tutorial', color: 'primary' },
        'skill_building': { label: 'Skill Building', color: 'success' },
        'urgent_warning': { label: 'Urgent Warning', color: 'danger' },
        'scam_alert': { label: 'Scam Alert', color: 'warning' }
    };
    // displays image from editor's metadata field:heroImage
    const displayImg = article.heroImage || './imgs/default-placeholder.png';
    const cat = categoryMap[categoryKey] || { label: categoryKey, color: 'secondary' };

    return `
        <div class="card article-card shadow-sm border-0 h-100" onclick="viewArticle(${article.id})">
            <img src="${displayImg}" 
                 class="card-img-top" 
                 alt="${article.title}" 
                 style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column p-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-${cat.color}-subtle text-${cat.color} category-badge">
                        ${cat.label}
                    </span>
                    <small class="text-muted">${article.publishedDate}</small>
                </div>
                <h5 class="card-title fw-bold">${article.title}</h5>
                <p class="card-text text-muted flex-grow-1 mb-3" 
                   style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${article.description}
                </p>
                <small class="text-muted mb-3">By ${article.author}</small>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm flex-grow-1" 
                            onclick="viewArticle(${article.id})">
                        Read Article
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" 
                            onclick="editArticle(${article.id})" 
                            title="Edit">
                        ✏️
                    </button>
                    <button class="btn btn-outline-danger btn-sm" 
                            onclick="deleteArticle(${article.id})" 
                            title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ────────────────────────────────────────────────────────────────
// CRUD OPERATIONS
// ────────────────────────────────────────────────────────────────

function viewArticle(id) {
    window.location.href = `article-view.html?id=${id}`;
}

function editArticle(id) {
    // Store the article ID in localStorage so the editor knows which article to load
    localStorage.setItem('editingArticleId', id);
    window.location.href = 'article-editor.html';
}

function deleteArticle(id) {
    const article = ArticleController.getArticleById(id);
    if (!article) {
        alert('Article not found');
        return;
    }

    if (confirm(`Are you sure you want to delete "${article.title}"? This cannot be undone.`)) {
        try {  
            ArticleController.deleteArticle(id);
            alert('Article deleted successfully');
            renderAllArticles(); // Refresh the display
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting article');
        }
    }
}