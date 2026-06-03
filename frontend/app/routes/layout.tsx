import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LanguageToolbar from "../components/LanguageToolbar";
import { I18nProvider } from "../i18n/I18nContext";

export default function Layout() {
  return (
    <I18nProvider>
      <LanguageToolbar />
      <Navbar />
      <Outlet />
      <Footer />
    </I18nProvider>
  );
}
