import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useI18n } from "../i18n/I18nContext";
import { LANGUAGES, type Language } from "../i18n/types";

const HOVER_ZONE_WIDTH = 300;
const HOVER_ZONE_HEIGHT = 160;

export default function LanguageToolbar() {
  const { pathname } = useLocation();
  const { language, setLanguage, t } = useI18n();
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [nearHover, setNearHover] = useState(false);

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isHiddenRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/editor");

  const handleScroll = useCallback(() => {
    setHiddenByScroll(true);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const near =
      e.clientX >= window.innerWidth - HOVER_ZONE_WIDTH && e.clientY <= HOVER_ZONE_HEIGHT;
    setNearHover(near);
  }, []);

  useEffect(() => {
    if (isHiddenRoute) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHiddenRoute, handleScroll, handleMouseMove]);

  if (isHiddenRoute) return null;

  const visible = !hiddenByScroll || nearHover;

  return (
    <div
      className={`language-toolbar${visible ? " language-toolbar--visible" : ""}`}
      role="group"
      aria-label={t.toolbar.ariaLabel}
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`language-toolbar__btn${language === code ? " language-toolbar__btn--active" : ""}`}
          onClick={() => setLanguage(code as Language)}
          aria-pressed={language === code}
          aria-label={label}
          title={label}
        >
          <span className="language-toolbar__label">{label}</span>
        </button>
      ))}
    </div>
  );
}
