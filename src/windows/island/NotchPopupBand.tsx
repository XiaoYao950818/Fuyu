import { MessageCircle, X } from "lucide-react";
import { useTranslation } from "../../i18n";

export function NotchPopupBand({ onCollapse }: {
  onCollapse: () => void;
}) {
  const t = useTranslation();
  return (
    <div className="island__notch-band">
      <span className="island__notch-band-start">
        <MessageCircle
          className="island__notch-band-icon"
          size={16}
          strokeWidth={1.8}
          absoluteStrokeWidth
          aria-hidden="true"
        />
        <span className="island__notch-band-label">{t.messages.title}</span>
      </span>
      <span className="island__notch-band-gap" aria-hidden="true" />
      <button
        className="icon-button island__notch-band-close"
        type="button"
        aria-label={t.island.collapseIsland}
        onClick={(event) => {
          event.stopPropagation();
          onCollapse();
        }}
      >
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
