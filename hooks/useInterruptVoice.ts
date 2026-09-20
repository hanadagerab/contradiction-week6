"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionEventLike = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const INTERRUPT_PHRASES = [
  "stop",
  "pause",
  "interrupt",
  "alto",
  "detener",
];

export function useInterruptVoice(
  enabled: boolean,
  onInterrupt: () => void
) {
  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition ??
      window.webkitSpeechRecognition;

    if (!Recognition) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new Recognition();

    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (
      event: SpeechRecognitionEventLike
    ) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript
          ?.toLowerCase()
          .trim() ?? "";

      const matched = INTERRUPT_PHRASES.some(
        (phrase) =>
          transcript.includes(phrase)
      );

      if (matched && enabled) {
        onInterrupt();
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [enabled, onInterrupt]);

  const startListening = () => {
    if (
      !enabled ||
      !supported ||
      listening ||
      !recognitionRef.current
    ) {
      return;
    }

    try {
      setListening(true);
      recognitionRef.current.start();
    } catch {
      setListening(false);
    }
  };

  return {
    supported,
    listening,
    startListening,
  };
}
