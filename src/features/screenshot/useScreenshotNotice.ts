import { fileShelfV1 } from "@fuyu/plugin-services";
import { useState, type PointerEvent } from "react";
import { useErrorText, useTranslation } from "../../i18n";
import { windowServices } from "../plugin-kernel/services";
import { dragScreenshot, type ScreenshotTaken } from "./api";
import { serviceFailed } from "./serviceErrors";
import type { ScreenshotCardState } from "./useScreenshotCard";

const shelf = windowServices.get(fileShelfV1);

export function useScreenshotNotice(card: ScreenshotCardState) {
  const t = useTranslation().screenshot;
  const errorText = useErrorText();
  const [message, setMessage] = useState<{ path: string; text: string } | null>(null);
  const taken: ScreenshotTaken | null = card.current;
  const report = (error: unknown) => taken && setMessage({ path: taken.path, text: errorText(error) });

  const shelve = () => {
    if (!taken) return;
    shelf.add({ paths: [taken.path] }).then(
      () => setMessage({ path: taken.path, text: t.card.shelved }),
      (error: unknown) => setMessage({ path: taken.path, text: serviceFailed(error, t.shelfOff, errorText) }),
    );
  };

  const drag = (event: PointerEvent) => {
    if (!taken || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    dragScreenshot(taken.path).then(() => card.dismiss(), report);
  };

  const text = taken && message?.path === taken.path ? message.text : taken?.saved ? t.card.saved : t.card.copied;
  return { taken, text, shelve, drag, card };
}

export type ScreenshotNoticeState = ReturnType<typeof useScreenshotNotice>;
