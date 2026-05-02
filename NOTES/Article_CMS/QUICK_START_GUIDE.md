# Quick Start Guide - CMS Operations

## 🎯 Quick Reference for Using the System

### Publishing a New Article (3 Steps)
1. **Go to** `article-editor.html`
2. **Fill form**:
   - Title: "Understanding Email Phishing"
   - Category: "Scam Alert" 
   - Description: "Learn to identify phishing attempts..."
   - Author: "Your Name"
3. **Add content** in Editor.js editor (press Tab for new block)
4. **Click** "Publish Article" → Confirm → Done!

---

### Viewing an Article
1. **Go to** `articles.html` (gallery view)
2. **Click** "Read Article" button on any card
3. Article displays with full content in `article-view.html`

---

### Editing an Article
1. **From gallery** (articles.html) or **from article page**, click **✏️ Edit**
2. Form pre-populates with article data
3. Make changes in form or editor
4. **Click** "Publish Article" → Confirm → Done!

---

### Deleting an Article
1. **Click** 🗑️ **Delete** button (gallery or article page)
2. **Confirm** deletion dialog
3. Article removed immediately
4. Gallery updates within 2 seconds

---

## 📁 Files to Know

### User-Facing Pages
- `article-editor.html` - Create/edit articles
- `articles.html` - View gallery of all articles
- `article-view.html` - View single article

### Core JavaScript
- `article-controller.js` - Data management (CRUD)
- `article-editor.js` - Editor form logic
- `articles-renderer.js` - Gallery rendering
- `article-view.js` - Article display logic

### How They Connect
```
User visits article-editor.html
         ↓
article-editor.js initializes Editor.js
         ↓
User writes article, clicks Publish
         ↓
article-controller.js saves to localStorage
         ↓
articles-renderer.js polls every 2 seconds
         ↓
Gallery updates automatically!
```

---

## 🎨 What's a "Topic"?

Articles are organized into **topics** (containers in the gallery):

| Topic | Contains | Categories |
|-------|----------|-----------|
| **Technology Basics** | How-to guides and skill tutorials | Tech Tutorial, Skill Building |
| **Stay Safe Online** | Warnings and scam alerts | Urgent Warning, Scam Alert |

**Example**: If you publish a "Scam Alert" article, it automatically appears in the "Stay Safe Online" section.

---

## 💾 Data Storage

### Where Your Articles Are Stored
```
Browser localStorage
├── sg_articles_db → Array of all articles
├── sg_last_id → Current highest article ID
├── article-draft → Current unsaved editor draft
└── editingArticleId → Flag for edit mode
```

**What this means**: 
- ✅ Articles persist when you refresh the page
- ✅ Drafts auto-save as you type
- ⚠️ Data is cleared if you clear browser cache
- 🔮 Future: Will switch to backend database

---

## ⌨️ Editor.js Keyboard Shortcuts

| Action | How |
|--------|-----|
| Add new block | Press **Tab** or click **+** |
| Make heading | Type `/h2` or `/h3` then press Tab |
| Add bullet list | Type `/list` then press Tab |
| Add numbered list | Type `/ordered` then press Tab |
| Add quote | Type `/quote` then press Tab |
| Add warning box | Type `/warning` then press Tab |
| Add image | Type `/image` then press Tab |

---

## 🎯 Article ID Hints

When you select a category, you'll see a hint like:
> "Article will be assigned #3 in Scam Alert"

This means:
- **#3** = This will be the 3rd article in the Scam Alert category
- Automatically assigned when you publish
- Useful for organizing by topic

---

## 🔄 Editor Features

### TLDR Block
- Automatically included as first block
- Perfect for quick summary/action items
- Highlighted in blue with warning icon

### Drag & Drop Reordering
- Hover over block number
- Drag up/down to reorder content
- Auto-saves to draft

### Block Deletion
- Click the **trash icon** on any block
- Confirms deletion
- Auto-saves to draft

---

## 🚨 Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Please fill in all required fields" | Make sure Title, Category, and Description are filled |
| "Article not found" | Article was deleted or ID is invalid |
| "Error saving editor content" | Reload page and try again |
| Article not in gallery | Wait 2-3 seconds for gallery to refresh |

---

## 🔐 Data Safety

### What Happens When You...

**...refresh the page?**
- Article data stays (in localStorage)
- Unsaved draft loads automatically
- No data loss

**...close the browser?**
- Article data stays (localStorage persists)
- Next time you visit, everything is there

**...clear browser cache?**
- ⚠️ All articles deleted (localStorage cleared)
- This is intentional - use backup/export if needed

**...delete an article?**
- Immediately removed from database
- Cannot be undone (confirm before delete)

---

## 📊 Content Example

### A Phishing Article Looks Like:

**Front Matter:**
- Title: "Spotting Phishing Emails"
- Category: "Scam Alert"
- Author: "Admin"
- Description: "Learn to identify fake emails..."

**Content Blocks:**
1. TLDR block (auto) - "Quick tips: Check sender address..."
2. Paragraph - "Phishing is when a scammer..."
3. H2 Header - "The Tell-Tale Signs"
4. List - Bullet points of red flags
5. Quote - "Think of it like a fake letter..."
6. Warning - "When in doubt, don't click"
7. Delimiter - Visual break
8. Paragraph - "If you clicked, here's what to do..."

---

## 🎨 Styling Notes

### Rendered Styles in Gallery Cards
- **Category badge** - Colored based on category (danger/warning/primary/success)
- **Title** - Bold, easy to scan
- **Description** - Truncated to 2 lines
- **Author credit** - Small gray text
- **Action buttons** - Read (primary), Edit (secondary), Delete (danger)

### Article Page Styles
- **Section headings** - Yellow left border
- **Analogies** - Italic with dashed border
- **Tip boxes** - Blue-bordered highlighted boxes
- **Images** - Responsive sizing
- **Lists** - Indented with proper numbering

---

## 🚀 Future Enhancements

### Coming Soon (When Ready)
- [ ] Backend database instead of localStorage
- [ ] User authentication
- [ ] Article versioning/history
- [ ] Comments and engagement
- [ ] Analytics dashboard
- [ ] Export to PDF/email

### One-Flag Switch to Backend
When backend is ready, just change ONE line:
```javascript
this.isDatabaseReady = false; // Change to true
```

That's it! System automatically uses API instead of localStorage.

---

## 📞 Getting Help

### Check These First
1. Are all required fields filled? (Title, Category, Description)
2. Does the article exist? (Maybe it was deleted)
3. Is localStorage enabled in your browser?
4. Try refreshing the page

### Common Issues
- Article not showing in gallery → Wait 2-3 seconds for polling
- Draft disappeared → Check if you published (draft cleared on publish)
- Can't edit → Make sure you clicked Edit button, not just Read
- Deleted by mistake → Sorry, deletion is permanent in this version

---

**Happy publishing! 🎉**
