import { useEffect, useRef, useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

/**
 * Native (iOS / Android) version; needs a dev build, not Expo Go.
 * Streams words the same way as the web version. On web, Metro loads
 * Usespeechtotext.web.ts instead of this file.
 */
const FLUSH_MS = 350;

export function useSpeechToText(onWords: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cbRef = useRef(onWords);
  cbRef.current = onWords;
  const stoppedRef = useRef(false);
  const emittedRef = useRef(0);
  const flushRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const emit = (words: string[], upTo: number) => {
    if (upTo > emittedRef.current) {
      cbRef.current(words.slice(emittedRef.current, upTo).join(' '));
      emittedRef.current = upTo;
    }
  };

  const start = () =>
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: true });

  useSpeechRecognitionEvent('start', () => {
    emittedRef.current = 0;
    setListening(true);
  });
  useSpeechRecognitionEvent('end', () => {
    setListening(false);
    if (!stoppedRef.current) setTimeout(start, 250);
  });
  useSpeechRecognitionEvent('result', (ev) => {
    const text = ev.results[0]?.transcript;
    if (!text) return;
    if (flushRef.current) clearTimeout(flushRef.current);

    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length < emittedRef.current) emittedRef.current = 0; // a new segment started

    if (ev.isFinal) {
      emit(words, words.length);
      emittedRef.current = 0;
    } else {
      emit(words, words.length - 1);
      flushRef.current = setTimeout(() => emit(words, words.length), FLUSH_MS);
    }
  });
  useSpeechRecognitionEvent('error', (ev) => {
    if (ev.error === 'not-allowed') {
      stoppedRef.current = true;
      setError('Microphone or speech permission was denied. Enable it in Settings.');
    }
  });

  useEffect(() => {
    stoppedRef.current = false;
    (async () => {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        stoppedRef.current = true;
        setError('Microphone or speech permission was denied. Enable it in Settings.');
        return;
      }
      start();
    })();
    return () => {
      stoppedRef.current = true;
      if (flushRef.current) clearTimeout(flushRef.current);
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

  return { listening, error };
}