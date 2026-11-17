import { useEffect, useState } from "react";
import { useLocale } from "../../i18n";
import { formatDockClock } from "./dock";

export function useDockClock() {
  const { locale } = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return formatDockClock(now, locale);
}
