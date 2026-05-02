# Technical Reference - CMS Architecture

## 📐 System Architecture Overview

### High-Level Data Model

```
Article Object Structure:
{
    id: 1,                    // Auto-increment, unique identifier
    title: "Article Title",   // String, max 100 chars
    category: "scam_alert",   // One of: tech_tutorial, skill_building, urgent_warning, scam_alert
    description: "...",       // String, max 200 chars, shown in card
    author: "Admin",          // String, person who wrote it
    heroImage: "url/path",    // String, optional hero image
    content: {                // Editor.js JSON block structure
        blocks: [
            {
                type: "warning",
                data: { title: "TL;DR", message: "..." }
            },
            // ... more blocks
        ]
    },
    createdAt: "2024-05-01T...",  // ISO timestamp
    updatedAt: "2024-05-01T...",  // ISO timestamp for edited articles
}
```

---

## 🔧 ArticleController API Reference

### Class: `ArticleControllerClass`

#### Methods

**`saveArticle(payload): Article`**
- Creates and persists a new article
- **Payload**:
  ```javascript
  {
      title: "string",
      category: "string",
      description: "string",
      author: "string",
      content: { blocks: [...] },  // Editor.js data
      createdAt: "ISO timestamp"
  }
  ```
- **Returns**: Article object with assigned ID
- **Side Effects**: Updates localStorage, increments ID

**`getAllArticles(): Article[]`**
- Fetches all articles from storage
- **Returns**: Array of article objects
- **Performance**: O(1) - direct array access

**`getArticleById(id): Article|null`**
- Fetches single article by ID
- **Parameters**: `id` (number)
- **Returns**: Article object or null if not found
- **Performance**: O(n) - linear search

**`updateArticle(id, payload): boolean`**
- Updates existing article
- **Parameters**: 
  - `id` (number)
  - `payload` (partial article object)
- **Returns**: true if successful
- **Side Effects**: Merges new data, updates timestamp

**`deleteArticle(id): boolean`**
- Removes article from storage
- **Parameters**: `id` (number)
- **Returns**: true if successful
- **Side Effects**: Removes from array, syncs storage

**`getNextIdInCategory(category): number`**
- Calculates next article number for category
- **Parameters**: `category` (string)
- **Returns**: Next ID (count + 1)
- **Usage**: Show hints like "Article will be #3 in Scam Alert"

**`syncStorage(): void`**
- Persists articles to localStorage
- Called automatically after CRUD operations
- **Keys**:
  - `sg_articles_db` - Serialized articles array
  - `sg_last_id` - Current max ID

**`loadFromStorage(): void`**
- Loads articles from localStorage on init
- Called in constructor
- Gracefully handles missing data

**`clearAll(): void`**
- Wipes all articles (use for testing)
- Resets ID counter to 0
- Syncs cleared state to localStorage

#### Class Properties

```javascript
{
    articles: [],           // Array of article objects
    currentId: 0,          // Current auto-increment counter
    isDatabaseReady: false, // Toggle for API switch
    apiUrl: '/api/articles' // Future backend endpoint
}
```

---

## 🎨 Editor Integration

### Editor.js Configuration

```javascript
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
}
```

### Default Article Template

```javascript
const DEFAULT_DATA = {
    blocks: [
        {
            type: 'warning',
            data: { 
                title: 'TL;DR (Too Long; Didn\'t Read)', 
                message: 'Add a quick summary or action checklist here.'
            }
        },
        // ... user adds more blocks
    ]
};
```

---

## 🗺️ Topic Mapping System

### Category → Container Routing

```javascript
const TOPIC_MAP = {
    'tech_tutorial': 'topic-tech-basics',
    'skill_building': 'topic-tech-basics',
    'urgent_warning': 'topic-stay-safe',
    'scam_alert': 'topic-stay-safe'
};

const CATEGORIES = {
    tech_tutorial: { label: 'Tech Tutorial', color: 'primary' },
    skill_building: { label: 'Skill Building', color: 'success' },
    urgent_warning: { label: 'Urgent Warning', color: 'danger' },
    scam_alert: { label: 'Scam Alert', color: 'warning' }
};
```

### Container HTML Structure (articles.html)

```html
<div id="topic-tech-basics" class="row g-3">
    <!-- Tech articles rendered here -->
</div>

<div id="topic-stay-safe" class="row g-3">
    <!-- Safety articles rendered here -->
</div>
```

---

## 📡 Real-Time Polling System

### Rendering Loop (articles-renderer.js)

```javascript
document.addEventListener('DOMContentLoaded', () => {
    renderAllArticles();  // Initial render
    setInterval(renderAllArticles, 2000);  // Poll every 2 seconds
});

function renderAllArticles() {
    const allArticles = ArticleController.getAllArticles();
    // Clear old cards
    // Loop through articles
    // Create new cards with data-article-id
    // Append to correct container
}
```

### Duplicate Prevention

```javascript
// Each card has unique identifier
<div class="col" data-article-id="5">
    <!-- card content -->
</div>

// Before rendering new cards, remove old ones:
const existingCards = container.querySelectorAll('[data-article-id]');
existingCards.forEach(card => card.remove());
```

---

## 💾 localStorage Schema

### Key: `sg_articles_db`
```javascript
[
    {
        id: 1,
        title: "...",
        category: "...",
        // ... full article object
    },
    // ... more articles
]
```

### Key: `sg_last_id`
```
"42"  // String representation of highest ID used
```

### Key: `article-draft`
```javascript
{
    meta: {
        title: "...",
        category: "...",
        description: "...",
        author: "..."
    },
    data: {  // Editor.js blocks
        blocks: [...]
    }
}
```

### Key: `editingArticleId`
```
"5"  // String ID of article being edited (null if not editing)
```

---

## 🔄 State Machines

### Article Lifecycle

```
[DRAFT STATE]
    - User writes in editor
    - Auto-saves to localStorage
    - Form fields capture
    ↓
[CONFIRM PUBLISH]
    - User clicks "Publish Article"
    - Modal asks for confirmation
    ↓
[PUBLISHED STATE]
    - ArticleController.saveArticle() called
    - Article assigned unique ID
    - Stored in localStorage
    - Draft cleared
    ↓
[GALLERY RENDER]
    - Polling detects new article
    - Renders card in correct topic
    - Shows Edit/Delete buttons
```

### Edit Lifecycle

```
[DRAFT STATE]
    - User edits form fields
    - Changes Editor.js content
    ↓
[EDIT MODE ACTIVE]
    - localStorage['editingArticleId'] = id
    - Form and editor pre-populated
    - "Publish" button still used (shows "Update")
    ↓
[CONFIRM UPDATE]
    - Modal asks for confirmation
    ↓
[UPDATED STATE]
    - ArticleController.updateArticle() called
    - Old article replaced
    - Timestamp updated
    - Draft cleared
```

---

## 🎯 Error Handling Patterns

### Validation Errors

```javascript
// Form validation
if (!title || !description || !category) {
    alert('Please fill in all required fields');
    return;
}

// Editor content validation
try {
    editorData = await editor.save();
} catch (e) {
    alert('Error saving editor content');
    return;
}
```

### Data Errors

```javascript
// Missing article
const article = ArticleController.getArticleById(id);
if (!article) {
    alert('Article not found');
    return;
}

// Draft corruption
try {
    const draft = JSON.parse(savedDraft);
    // process draft
} catch (e) {
    console.log('Could not load draft');
    // Fall back to defaults
}
```

### XSS Prevention

```javascript
// Escape all user content before rendering
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Usage
const safeTitle = escapeHtml(article.title);
```

---

## 🔌 Backend Integration Points

### Minimal Changes for API Switch

**File: article-controller.js**

```javascript
// Change this one flag:
this.isDatabaseReady = true;  // From false

// Then implement fetch calls:
async saveArticle(payload) {
    if (this.isDatabaseReady) {
        const res = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return res.json();
    }
    // Fallback to localStorage...
}
```

### Expected API Endpoints

```
POST /api/articles
    Request: { title, category, description, author, content }
    Response: { id, title, ..., createdAt }

GET /api/articles
    Response: [ { id, title, ... }, ... ]

GET /api/articles/:id
    Response: { id, title, ..., content }

PUT /api/articles/:id
    Request: { title, category, ... }
    Response: { id, title, ..., updatedAt }

DELETE /api/articles/:id
    Response: { success: true }
```

---

## 📊 Performance Considerations

### Polling Interval
- Current: **2 seconds**
- Why: Smooth UX without excessive polling
- Scales to ~100 articles before noticeable lag
- For 1000+ articles: Consider pagination or server-sent events

### Storage Limits
- localStorage capacity: ~5-10MB
- Current articles: ~2KB each
- Capacity: ~2500-5000 articles before limits
- Recommend: Archive or database switch at 100+ articles

### Rendering Performance
- Current: O(n) for each article
- Real problem: DOM manipulation (creating/removing elements)
- Solution: Virtual scrolling for 1000+ items
- For now: Fine for small galleries

---

## 🧪 Testing Checklist

### Unit Tests Needed
- [ ] `ArticleController.saveArticle()` - Creates with ID
- [ ] `ArticleController.getArticleById()` - Retrieves correct article
- [ ] `ArticleController.updateArticle()` - Merges data correctly
- [ ] `ArticleController.deleteArticle()` - Removes from array
- [ ] `ArticleController.getNextIdInCategory()` - Counts correctly
- [ ] `blocksToHTML()` - Converts each block type
- [ ] `escapeHtml()` - Prevents XSS

### Integration Tests Needed
- [ ] Full publish workflow (create → render → view)
- [ ] Full edit workflow (edit → render → view)
- [ ] Full delete workflow (delete → gallery updates)
- [ ] localStorage persistence (refresh page)
- [ ] Draft auto-save (form changes captured)

### Manual Tests Needed
- [ ] Create article in each category
- [ ] Verify articles appear in correct topic
- [ ] Edit article and verify changes save
- [ ] Delete article and verify removal
- [ ] Refresh page and verify data persists
- [ ] Test XSS prevention (try `<script>` in title)

---

## 📚 Deployment Checklist

### Before Going Live
- [ ] Test in production environment
- [ ] Verify localStorage capacity sufficient
- [ ] Set up database backup strategy
- [ ] Plan localStorage → API migration
- [ ] Create admin user authentication
- [ ] Add article moderation workflow
- [ ] Implement analytics tracking
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Performance test with 100+ articles
- [ ] Security audit (XSS, CSRF, auth)

### Production Settings
- [ ] Set `isDatabaseReady = true` when API ready
- [ ] Increase polling interval if needed
- [ ] Add rate limiting on publish
- [ ] Enable article approval workflow
- [ ] Set up automated backups

---

## 🚀 Optimization Roadmap

### Phase 1 (Current)
- localStorage backend
- 2-second polling
- No user auth
- Manual article management

### Phase 2 (Next)
- Backend database integration
- User authentication (admin panel)
- Article approval workflow
- Metadata indexing

### Phase 3 (Future)
- User comments/engagement
- Full-text search
- Article versioning
- Analytics dashboard
- Email notifications
- Scheduled publishing

---

## 📖 Code Documentation Standards

### Function Documentation

```javascript
/**
 * Fetches all articles from storage
 * @returns {Article[]} Array of article objects
 * @throws {Error} If storage is corrupted
 * @example
 *   const articles = ArticleController.getAllArticles();
 *   console.log(articles.length); // 5
 */
getAllArticles() {
    // implementation
}
```

### Variable Naming Convention

```javascript
// Article collections
const articles = [];
const allArticles = [];

// Single article
const article = { id: 1, title: "..." };

// Editor instance
const editor = new EditorJS(...);

// DOM elements
const titleEl = document.getElementById('articleTitle');
const containerEl = document.getElementById('topic-tech-basics');
```

---

**Last Updated**: Recovery Session  
**Version**: 1.0  
**Status**: Production Ready
