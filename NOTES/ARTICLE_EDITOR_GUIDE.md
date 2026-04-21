# Silver Guide — Article Editor Guide

A complete guide for writing and publishing articles using the Silver Guide Article Editor. No coding knowledge required.

---

## Table of Contents

1. [What is the Article Editor?](#1-what-is-the-article-editor)
2. [Opening the Editor](#2-opening-the-editor)
3. [The Interface at a Glance](#3-the-interface-at-a-glance)
4. [Filling in Article Details](#4-filling-in-article-details)
5. [Writing Content with Blocks](#5-writing-content-with-blocks)
6. [Block Types Reference](#6-block-types-reference)
7. [Working with Blocks](#7-working-with-blocks)
8. [The Toolbar Buttons](#8-the-toolbar-buttons)
9. [Auto-Save and Drafts](#9-auto-save-and-drafts)
10. [Publishing Workflow](#10-publishing-workflow)
11. [Tips and Troubleshooting](#11-tips-and-troubleshooting)

---

## 1. What is the Article Editor?

The Article Editor is a page in the Silver Guide website (`article-editor.html`) that lets you write, format, and export articles without touching any code.

Under the hood it uses a library called **Editor.js**, which works differently from a traditional word processor. Instead of one big text document, you build articles out of individual **blocks** — one block per paragraph, heading, list, image, etc. This makes formatting consistent and clean every time.

When you're done writing, you click **Generate HTML** to produce a finished article page that matches the Silver Guide design exactly.

---

## 2. Opening the Editor

Open `article-editor.html` in your browser. You can do this by:

- Double-clicking the file in Finder, or
- If the project is running on a local server, navigating to `http://localhost/article-editor.html`

The editor loads with a sample article ("Spotting Phishing Emails") pre-filled so you can see immediately how everything works.

---

## 3. The Interface at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                         │
├─────────────────────────────────────────────────────────────────┤
│  Article Editor          [Load Example] [Log JSON]              │
│  Write and export…       [Save to Backend] [Generate HTML]      │
├─────────────────────────────────────────────────────────────────┤
│  ARTICLE DETAILS CARD                                           │
│  Title | Category | Short Description | Reading Time | Topic ID │
│  Hero Image URL                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ARTICLE CONTENT CARD                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Editor area — click here to start typing                 │  │
│  │                                                           │  │
│  │  + (add block button appears when you hover)              │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  BLOCK REFERENCE CARD  (quick reminder of what each block does) │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Filling in Article Details

Before writing content, fill in the **Article Details** card at the top.

| Field | What it's for | Example |
|---|---|---|
| **Title** | The article's main heading | `Spotting Phishing Emails` |
| **Category** | Controls the colour badge on the article card | `Scam Alert` |
| **Short Description** | The summary shown on the articles listing page | `Learn how to spot a fake email…` |
| **Reading Time** | Estimated minutes to read | `5` |
| **Topic ID** | Links the article to a topic category in the database (leave blank for now) | `3` |
| **Hero Image URL** | Path or URL for the large banner image | `./imgs/phishing_alert.png` |

### Category colours

| Category | Badge colour |
|---|---|
| Tech Tutorial | Blue |
| Skill Building | Green |
| Urgent Warning | Red |
| Scam Alert | Yellow |

---

## 5. Writing Content with Blocks

### Adding your first block

1. Click anywhere inside the white editor area.
2. A cursor appears. Start typing to create a **Paragraph** block automatically.
3. Press **Enter** to finish a paragraph and start a new one.

### Adding a different block type

1. Press **Tab**, or hover near the left edge of the editor and click the **`+`** button.
2. A toolbox pops up showing all available block types.
3. Click the block type you want to insert.

### The golden rule

> One block = one piece of content.
> A heading is its own block. A paragraph is its own block. A list is its own block.

---

## 6. Block Types Reference

### Paragraph
**What it is:** Regular body text.
**When to use it:** For all standard sentences and explanatory copy.
**Output:**
```html
<p>Your text here.</p>
```

---

### Header (H2)
**What it is:** A section heading with a yellow left border.
**When to use it:** To introduce a new section of the article. Use H2 for main sections, H3 for sub-sections.
**How to set the level:** After inserting a Header block, click the block settings (⚙) to choose H2, H3, or H4.
**Output:**
```html
<h2 class="section-title">Your Section Title</h2>
```

---

### List
**What it is:** A bullet list (unordered) or numbered list (ordered).
**When to use it:** For steps, tips, or collections of related items.
**How to switch between bullet/numbered:** Click the block settings (⚙) after inserting.
**How to add items:** Press **Enter** after each item. Press **Tab** to indent (create a sub-item).
**Output:**
```html
<ul>
    <li class="mb-2">First item</li>
    <li class="mb-2">Second item</li>
</ul>
```

---

### Quote
**What it is:** An italic analogy box with a dashed border.
**When to use it:** For analogies that explain a concept in simple terms (e.g. "Think of it like…").
**Fields:**
- **Quote text** — the analogy itself
- **Caption** — optional source or attribution (can be left blank)

**Output:**
```html
<div class="analogy mb-4">
    <p class="mb-0">Your analogy here.</p>
</div>
```

---

### Warning
**What it is:** A highlighted tip/safety box with a blue left border.
**When to use it:** For important safety reminders, key rules, or "don't forget" moments.
**Fields:**
- **Title** — short label (e.g. `Safety First`, `When in doubt, don't click`)
- **Message** — the body of the tip

**Output:**
```html
<div class="tip-box">
    <h5 class="fw-bold">Safety First</h5>
    <p class="mb-0">Your tip content here.</p>
</div>
```

---

### Image
**What it is:** An inline image placed within the article body.
**When to use it:** To illustrate a step or concept mid-article.
**How to add:** Insert an Image block and paste a URL into the field.

> **Note:** Images must be hosted somewhere already — either in the project's `imgs/` folder (use `./imgs/filename.png`) or at an external URL. There is no file upload yet.

**Output:**
```html
<img src="./imgs/example.png" alt="your caption" class="img-fluid rounded mb-4">
```

---

### Delimiter
**What it is:** A horizontal dividing line.
**When to use it:** To mark a clear break between two major sections, or before a closing paragraph.
**Output:**
```html
<hr class="my-5">
```

---

## 7. Working with Blocks

### Moving a block
Hover over the block until you see the **⠿ drag handle** on the left. Click and drag it to a new position.

### Deleting a block
Hover over the block, click the **⋮ menu** (three dots) that appears, then choose **Delete**.

### Duplicating a block
Hover over the block, click the **⋮ menu**, then choose **Copy** or **Duplicate** if available — or simply select all text in the block and copy/paste it into a new block of the same type.

### Moving between blocks
- **Enter** — creates a new block below
- **Backspace** on an empty block — deletes it and moves focus up
- **Arrow keys** — move the cursor within a block; press Up/Down at the top/bottom edge to jump to the adjacent block

---

## 8. The Toolbar Buttons

Four buttons sit in the top-right corner of the page.

### Load Example
Replaces the current editor content and metadata with the "Spotting Phishing Emails" sample article. Useful for:
- Seeing a fully worked example of every block type
- Starting fresh when you've accidentally broken the layout
- Demonstrating the editor to someone new

> A confirmation dialog appears first so you won't lose work accidentally.

---

### Log JSON (debug)
Saves the raw editor data to the **browser console** (press `F12` → Console tab). Useful for developers who need to inspect the exact data structure that Editor.js produces. Not needed for normal article writing.

---

### Save to Backend
Sends the article to the Silver Guide backend API (`POST /api/articles`). Requires you to be signed in — the editor reads your login token from the browser's local storage automatically.

> The backend endpoint is not live yet. When you click this button currently, it logs the payload to the console instead and shows a message. Once the backend is ready, this will save the article to the database.

---

### Generate HTML
The main export button. It:

1. Reads all the block content from the editor
2. Reads all the metadata fields (title, category, reading time, etc.)
3. Assembles a complete, standalone HTML article page
4. Shows the result in a modal popup

From the modal you can click **Copy to Clipboard** and paste the HTML into a new file (e.g. `phishing-emails.html`) in the project folder. Then update the matching article card link in `articles.html`.

---

## 9. Auto-Save and Drafts

The editor **automatically saves your work** to the browser's local storage every time you make a change. This means:

- If you accidentally close the tab, your work is still there when you reopen it.
- If the page crashes, your draft survives.
- The draft is specific to your browser on your computer — it won't appear on someone else's machine.

### Clearing the draft
If you want to start completely fresh (and reset to the example template), open the browser console (`F12`) and run:
```js
localStorage.removeItem('articleEditorDraft')
```
Then refresh the page. The example article will reload.

Alternatively, just click **Load Example** — it clears the draft and loads the template in one step.

---

## 10. Publishing Workflow

Here is the end-to-end process for creating a new article:

```
1. Open article-editor.html
2. Fill in Article Details (title, category, description, reading time, hero image)
3. Write your content using blocks
4. Click Generate HTML
5. Click Copy to Clipboard in the modal
6. Create a new file in the project folder (e.g. mobile-camera.html)
7. Paste the HTML and save the file
8. Open articles.html and update the matching card's href to point to the new file
9. Done — the article is live
```

### Article card link example
In `articles.html`, find the card for your article and change:
```html
<a href="#" class="btn btn-primary btn-read mt-3">Read Guide</a>
```
to:
```html
<a href="mobile-camera.html" class="btn btn-primary btn-read mt-3">Read Guide</a>
```

---

## 11. Tips and Troubleshooting

### The editor area is blank / unresponsive
- Hard refresh the page: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Check the browser console (`F12`) for red error messages

### A block shows "The block can not be displayed correctly"
This usually means saved draft data is in an older format. Clear the draft and reload:
```js
localStorage.removeItem('articleEditorDraft')
```
Then refresh.

### The Generate HTML button opens a blank modal
The editor may not have finished loading. Wait a moment after the page opens before clicking Generate HTML.

### My hero image isn't showing in the generated article
- Check the URL is correct and the image file exists at that path
- If using a local image, make sure it's inside the `imgs/` folder and the path starts with `./imgs/`

### How do I add a new category?
Open `article-editor.html` and find the `CATEGORIES` object near the top of the `<script>` block. Add a new entry following the same pattern:
```js
const CATEGORIES = {
    tech:    { label: 'Tech Tutorial',  color: 'primary' },
    skill:   { label: 'Skill Building', color: 'success' },
    warning: { label: 'Urgent Warning', color: 'danger'  },
    scam:    { label: 'Scam Alert',     color: 'warning' },
    newcat:  { label: 'My New Category', color: 'info'   }  // ← add here
};
```
Then add the matching `<option>` to the Category dropdown in the HTML form.

---

*Silver Guide Article Editor — built with [Editor.js](https://editorjs.io/)*
