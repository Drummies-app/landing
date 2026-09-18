import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Lang, Localized } from "../types";
import { LANGS } from "./copy";

const STORAGE_KEY = "drummies.lang";

interface LangValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (entry: { readonly en: string; readonly "pt-BR": string }) => string;
  tl: (entry: Localized) => string;
}

const LangContext = createContext<LangValue | null>(null);

function detect(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGS as string[]).includes(stored)) return stored as Lang;
  } catch {
    // Private mode or blocked storage: fall through to the browser hint.
  }
  const hint =
    typeof navigator !== "undefined"
      ? (navigator.languages?.[0] ?? navigator.language)
      : "";
  return hint?.toLowerCase().startsWith("pt") ? "pt-BR" : "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persisting is a convenience; the switch still works without it.
    }
  }, []);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      setLang,
      t: (entry) => entry[lang],
      tl: (entry) => entry[lang] || entry.en,
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside LangProvider");
  return value;
}
