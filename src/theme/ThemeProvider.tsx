import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  applyThemeToDocument,
  getThemePreference,
  resolveTheme,
  setThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from "./theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const cycleOrder: ThemePreference[] = ["system", "dark", "light"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    getThemePreference(),
  );
  const resolved = useMemo(() => resolveTheme(preference), [preference]);

  useEffect(() => {
    applyThemeToDocument(resolved);
  }, [resolved]);

  useEffect(() => {
    if (preference !== "system") return;
    if (!window.matchMedia) return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeToDocument(resolveTheme("system"));

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // Safari fallback
    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(onChange);
    // eslint-disable-next-line deprecation/deprecation
    return () => mql.removeListener(onChange);
  }, [preference]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      preference,
      resolved,
      setPreference: (pref) => {
        setPreferenceState(pref);
        setThemePreference(pref);
      },
      cyclePreference: () => {
        const idx = cycleOrder.indexOf(preference);
        const next = cycleOrder[(idx + 1) % cycleOrder.length] ?? "system";
        setPreferenceState(next);
        setThemePreference(next);
      },
    };
  }, [preference, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

