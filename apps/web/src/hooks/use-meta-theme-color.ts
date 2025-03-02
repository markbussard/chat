import { useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

import { META_THEME_COLORS } from "~/constants";

export const useMetaThemeColor = () => {
  const { resolvedTheme } = useTheme();

  const metaThemeColor = useMemo(() => {
    return resolvedTheme !== "dark"
      ? META_THEME_COLORS.LIGHT
      : META_THEME_COLORS.DARK;
  }, [resolvedTheme]);

  const setMetaThemeColor = useCallback((color: string) => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, []);

  return {
    metaThemeColor,
    setMetaThemeColor
  };
};
