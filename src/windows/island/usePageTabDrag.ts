import { useCallback, useState, type DragEvent } from "react";
import type { IslandPage } from "./types";

export type PageTabDragHandle = {
  draggable: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
};

export type PageTabDrag = {
  dragging: boolean;
  draggedId: IslandPage | null;
  dropId: IslandPage | null;
  dropBefore: boolean;
  handleFor: (id: IslandPage) => PageTabDragHandle;
};

export function usePageTabDrag(tabs: readonly IslandPage[], onReorder: (draggedId: IslandPage, targetId: IslandPage | null) => void): PageTabDrag {
  const [draggedId, setDraggedId] = useState<IslandPage | null>(null);
  const [dropId, setDropId] = useState<IslandPage | null>(null);
  const [dropBefore, setDropBefore] = useState(true);

  const clear = useCallback(() => {
    setDraggedId(null);
    setDropId(null);
    setDropBefore(true);
  }, []);

  const handleFor = useCallback((id: IslandPage): PageTabDragHandle => {
    const before = (event: DragEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      return event.clientX < rect.left + rect.width / 2;
    };
    return {
      draggable: tabs.length > 1,
      onDragStart: (event) => {
        if (tabs.length < 2) return;
        event.dataTransfer.setData("text/plain", id);
        event.dataTransfer.effectAllowed = "move";
        setDraggedId(id);
        setDropId(null);
      },
      onDragOver: (event) => {
        if (draggedId === null || draggedId === id) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        const nextBefore = before(event);
        if (dropId !== id || dropBefore !== nextBefore) {
          setDropId(id);
          setDropBefore(nextBefore);
        }
      },
      onDragLeave: (event) => {
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        if (dropId === id) setDropId(null);
      },
      onDrop: (event) => {
        if (draggedId === null || draggedId === id) return;
        event.preventDefault();
        const nextBefore = before(event);
        const index = tabs.indexOf(id);
        const target = nextBefore ? id : (tabs[index + 1] ?? null);
        const dragged = draggedId;
        clear();
        onReorder(dragged, target);
      },
      onDragEnd: clear,
    };
  }, [tabs, draggedId, dropId, dropBefore, clear, onReorder]);

  return { dragging: draggedId !== null, draggedId, dropId, dropBefore, handleFor };
}
