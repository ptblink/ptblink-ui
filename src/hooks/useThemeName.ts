import { useEffect, useState } from "react";
import { getAppliedTheme, THEME_ATTRIBUTE, type ThemeName } from "../theme";

/**
 * The theme currently applied to the document, kept in sync with the
 * `data-theme` attribute (see applyTheme). SSR renders "dark" and corrects
 * on mount.
 */
export function useThemeName(): ThemeName {
  const [theme, setTheme] = useState<ThemeName>("dark");
  useEffect(() => {
    setTheme(getAppliedTheme());
    const observer = new MutationObserver(() => setTheme(getAppliedTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [THEME_ATTRIBUTE],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}
