import { useEffect, useRef, useState } from 'react';

/**
 * Web version (Chrome / Edge). Starts on mount and streams words as they are recognized:
 * every word except the newest is emitted immediately, and the newest one is emitted
 * once it has stayed unchanged for FLUSH_MS (or when the phrase is finalized).
 */
const FLUSH_MS = 350;

export function useSpeechToText(onWords: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cbRef = useRef(onWords);
  cbRef.current = onWords;

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError('Speech recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    let stopped = false;
    let restartTimer: ReturnType<typeof setTimeout> | undefined;
    let flushTimer: ReturnType<typeof setTimeout> | undefined;
    const emitted: Record<number, number> = {}; // result index -> words already sent

    const emit = (i: number, words: string[], upTo: number) => {
      const from = emitted[i] ?? 0;
      if (upTo > from) {
        cbRef.current(words.slice(from, upTo).join(' '));
        emitted[i] = upTo;
      }
    };

    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => {
      setListening(true);
      for (const k of Object.keys(emitted)) delete emitted[Number(k)];
    };

    rec.onresult = (e: any) => {
      if (flushTimer) clearTimeout(flushTimer);
      let last: { i: number; words: string[] } | null = null;

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const words = res[0].transcript.trim().split(/\s+/).filter(Boolean);
        if (res.isFinal) {
          emit(i, words, words.length);
        } else {
          emit(i, words, words.length - 1); // hold back the newest word: it may still change
          last = { i, words };
        }
      }

      if (last) {
        const { i, words } = last;
        flushTimer = setTimeout(() => emit(i, words, words.length), FLUSH_MS);
      }
    };

    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        stopped = true;
        setError('Microphone access is blocked. Allow it in the browser and reload.');
      }
    };

    const startSoon = (ms: number) => {
      restartTimer = setTimeout(() => {
        try {
          rec.start();
        } catch {
          if (!stopped) startSoon(1000); // couldn't start; keep trying instead of dying silently
        }
      }, ms);
    };

    rec.onend = () => {
      setListening(false);
      if (!stopped) startSoon(250);
    };

    startSoon(0);

    return () => {
      stopped = true;
      if (restartTimer) clearTimeout(restartTimer);
      if (flushTimer) clearTimeout(flushTimer);
      rec.onend = null;
      try {
        rec.abort();
      } catch {}
    };
  }, []);

  return { listening, error };
}