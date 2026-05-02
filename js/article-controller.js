/* ArticleController.js
* Manages the collection of articles and simulates database interactions.
* Architecture allows seamless transition from localStorage to backend API.
*/
class ArticleControllerClass {
    constructor() {
        this.articles = []; // Empty array to mock DB
        this.currentId = 0; // Tracks the global auto-increment
        this.isDatabaseReady = false; // TOGGLE when ready to swap from empty array to database
        this.apiUrl = '/api/articles'; // Backend API endpoint (future use)
        this.loadFromStorage();
    }

    // ────────────────────────────────────────────────────────────
    // MAIN CRUD OPERATIONS
    // ────────────────────────────────────────────────────────────

    // CREATE: Save article (routes to database or localStorage)
    async saveArticle(payload) {
        if (this.isDatabaseReady) {
            return await this.saveToDatabase(payload);
        } else {
            return this.saveToArray(payload);
        }
    }

    // READ: Get all articles
    getAllArticles() {
        return this.articles;
    }

    // READ: Get article by ID
    getArticleById(id) {
        return this.articles.find(a => a.id === parseInt(id));
    }

    // UPDATE: Update an existing article
    async updateArticle(id, payload) {
        const index = this.articles.findIndex(a => a.id === parseInt(id));
        if (index === -1) throw new Error(`Article with ID ${id} not found`);

        const updatedArticle = {
            ...this.articles[index],
            ...payload,
            updatedAt: new Date().toISOString()
        };

        this.articles[index] = updatedArticle;
        this.syncStorage();
        return updatedArticle;
    }

    // DELETE: Remove an article
    async deleteArticle(id) {
        const index = this.articles.findIndex(a => a.id === parseInt(id));
        if (index === -1) throw new Error(`Article with ID ${id} not found`);

        const deletedArticle = this.articles[index];
        this.articles.splice(index, 1);
        this.syncStorage();
        return deletedArticle;
    }

    // ────────────────────────────────────────────────────────────
    // STORAGE LAYER (localStorage vs Backend)
    // ────────────────────────────────────────────────────────────

    // Save to localStorage mock database
    saveToArray(payload) {
        this.currentId++;
        const newArticle = {
            id: this.currentId,
            ...payload,
            publishedDate: new Date().toLocaleDateString('en-SG'), // Singapore date format
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.articles.push(newArticle);
        this.syncStorage();
        return newArticle;
    }

    // Save to backend database (future use)
    async saveToDatabase(payload) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to save article to database');
        return await response.json();
    }

    // ────────────────────────────────────────────────────────────
    // UTILITY FUNCTIONS
    // ────────────────────────────────────────────────────────────

    // Logic for UI: Counts articles in a category to suggest the next "Local ID"
    getNextIdInCategory(category) {
        const categoryArticles = this.articles.filter(a => a.category === category);
        return categoryArticles.length + 1;
    }

    // Persist to localStorage
    syncStorage() {
        localStorage.setItem('sg_articles_db', JSON.stringify(this.articles));
        localStorage.setItem('sg_last_id', this.currentId.toString());
    }

    // Load from localStorage
    loadFromStorage() {
        const stored = localStorage.getItem('sg_articles_db');
        const lastId = localStorage.getItem('sg_last_id');
        if (stored) {
            this.articles = JSON.parse(stored);
            this.currentId = parseInt(lastId) || 0;
        }
    }

    // Clear all articles (useful for testing)
    clearAll() {
        this.articles = [];
        this.currentId = 0;
        this.syncStorage();
    }
}

// Create a global instance for use throughout the app
const ArticleController = new ArticleControllerClass();
ArticleController.loadFromStorage();

// Also create articleManager alias for backward compatibility
const articleManager = ArticleController;