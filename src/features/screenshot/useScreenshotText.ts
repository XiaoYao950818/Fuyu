import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n";
import { listenScreenshotText } from "./api";

const PEEK_MS = 8_000;

function oneLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function useScreenshotText() {
  const t = useTranslation();
  const [peek, setPeek] = useState<string | null>(null);

  useEffect(() => {
    let didCancel = false;
    let request = 0;
    let timer = 0;
    const stops: (() => void)[] = [];
    const keep = (stop: () => void) => (didCancel ? stop() : stops.push(stop));

    const show = (id: number, line: string) => {
      if (didCancel || id !== request) return;
      setPeek(line);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (id === request) setPeek(null);
      }, PEEK_MS);
    };

    void listenScreenshotText((event) => {
      const text = event.payload.trim();
      show(++request, text ? t.screenshot.textCopied(oneLine(text)) : t.screenshot.noText);
    }).then(keep).catch((error: unknown) => console.error("Failed to listen for screenshot text", error));

    return () => {
      didCancel = true;
      stops.forEach((stop) => stop());
      window.clearTimeout(timer);
    };
  }, [t]);

  return peek;
}
