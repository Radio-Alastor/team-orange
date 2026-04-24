export const CATEGORIES = {
  tech: { label: "Tech Tutorial", color: "blue" },
  skill: { label: "Skill Building", color: "green" },
  warning: { label: "Urgent Warning", color: "red" },
  scam: { label: "Scam Alert", color: "yellow" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const DEFAULT_META = {
  title: "Spotting Phishing Emails",
  category: "scam" as CategoryKey,
  subtitle: "",
  description: "Is that email really from your bank? We teach you how to check sender addresses and avoid suspicious links.",
  heroImage: "/imgs/phishing_alert.png",
};

export const DEFAULT_DATA = {
  blocks: [
    { type: "paragraph", data: { text: '"Phishing" (pronounced "fishing") is when a scammer sends you an email pretending to be someone you trust — your bank, Australia Post, myGov, or even a family member. Their goal is to trick you into clicking a link and entering your personal details.' } },
    { type: "header", data: { text: "The Tell-Tale Signs of a Phishing Email", level: 2 } },
    {
      type: "list",
      data: {
        style: "unordered", meta: {},
        items: [
          { content: "The sender's email address looks odd (e.g. support@amaz0n-help.net instead of @amazon.com)", meta: {}, items: [] },
          { content: 'It creates urgency — "Your account will be closed in 24 hours!"', meta: {}, items: [] },
          { content: "It asks you to click a link and log in to verify your details", meta: {}, items: [] },
          { content: 'The greeting is generic: "Dear Customer" instead of your name', meta: {}, items: [] },
          { content: "There are spelling mistakes or the logo looks slightly off", meta: {}, items: [] },
        ],
      },
    },
    { type: "quote", data: { text: "Think of it like a fake letter in your letterbox — it might look official, but if you hold it up to the light, the small details give it away.", caption: "" } },
    { type: "header", data: { text: "How to Check if an Email Is Real", level: 2 } },
    { type: "paragraph", data: { text: "Before clicking anything, try these quick checks:" } },
    {
      type: "list",
      data: {
        style: "ordered", meta: {},
        items: [
          { content: "Hover your mouse over any link (don't click!) and look at the web address that appears at the bottom of the screen", meta: {}, items: [] },
          { content: "Check the sender's full email address by clicking on their name", meta: {}, items: [] },
          { content: "Go directly to the company's website by typing the address into your browser yourself", meta: {}, items: [] },
          { content: "Call the company on their official number if you're still unsure", meta: {}, items: [] },
        ],
      },
    },
    { type: "warning", data: { title: "When in doubt, don't click", message: "Legitimate companies like your bank or myGov will never email you asking for your password or full credit card number. If an email asks for this, it is a scam." } },
    { type: "delimiter", data: {} },
    { type: "paragraph", data: { text: "If you think you've clicked a phishing link and entered your details, change your password immediately and call your bank." } },
  ],
};
