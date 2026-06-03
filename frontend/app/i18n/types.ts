export type Language = "en" | "zh" | "ms" | "ta";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ms", label: "Melayu" },
  { code: "ta", label: "தமிழ்" },
];

export const STORAGE_KEY = "silverguide-language";

export const HTML_LANG: Record<Language, string> = {
  en: "en",
  zh: "zh-Hans",
  ms: "ms",
  ta: "ta",
};

export type TeamMemberId = "christine" | "ekhong" | "kelvin" | "kimshee";

export interface Translations {
  nav: {
    home: string;
    learn: string;
    about: string;
    editor: string;
    admin: string;
    helpLine: string;
    signIn: string;
    register: string;
    logOut: string;
    toggleNav: string;
    profile: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    contactUs: string;
    aboutUs: string;
    faqs: string;
  };
  home: {
    heroAlt: string;
    badge: string;
    title: string;
    lead: string;
    startLearning: string;
    emergencyHelpLine: string;
    latestArticles: string;
    latestArticlesLead: string;
    tabTech: string;
    tabScam: string;
    viewAllTech: string;
    viewAllScam: string;
    noGuidesTitle: string;
    noGuidesBody: string;
    emergencyBadge: string;
    emergencyTitle: string;
    emergencySubtitle: string;
    emergencyBody: string;
    getScamHelp: string;
  };
  about: {
    purposeBadge: string;
    purposeQuote: string;
    purposeLead: string;
    differentTitle: string;
    safeTitle: string;
    safeBody: string;
    simpleTitle: string;
    simpleBody: string;
    teamTitle: string;
    scrollHint: string;
    ctaTitle: string;
    ctaLead: string;
    ctaButton: string;
    readMore: string;
    readLess: string;
  };
  team: Record<
    TeamMemberId,
    { name: string; role: string; bio: string }
  >;
  emergency: {
    title: string;
    lead: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step2Call: string;
    step2Availability: string;
    step3Title: string;
    step3Body: string;
    step3Button: string;
    backHome: string;
  };
  login: {
    backHome: string;
    welcomeBack: string;
    signInSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signIn: string;
    signingIn: string;
    noAccount: string;
    registerLink: string;
    close: string;
    errors: {
      invalidCredentials: string;
      generic: string;
      network: string;
    };
    info: {
      expired: string;
      unauthorized: string;
    };
  };
  register: {
    backHome: string;
    createAccount: string;
    joinSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHint: string;
    confirmLabel: string;
    confirmPlaceholder: string;
    createButton: string;
    creating: string;
    hasAccount: string;
    signInLink: string;
    close: string;
    errors: {
      nameRequired: string;
      emailInvalid: string;
      passwordMin: string;
      confirmMismatch: string;
      emailExists: string;
      checkInput: string;
      generic: string;
      network: string;
    };
  };
  toolbar: {
    ariaLabel: string;
  };
}
