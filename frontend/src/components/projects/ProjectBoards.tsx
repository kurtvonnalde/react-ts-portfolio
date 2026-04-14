import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import type { BoardResponse, StatusColumn, ProjectCard } from "../../types/board";
import { computeSparseOrder } from "../../utils/order";
import { moveProject } from "../../api/projectsApi";

function flattenIds(cards: ProjectCard[]) {
  return cards.map(c => c.id);
}

function SortableCard({ card }: { card: ProjectCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "transparent",
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ddd",
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ fontWeight: 600 }}>{card.title}</div>
      {card.techStack?.length ? (
        <div style={{ fontSize: 12, color: "#666" }}>
          {card.techStack.join(" • ")}
        </div>
      ) : null}
    </div>
  );
}

function DroppableColumn({ 
  feature, 
  col, 
  cards 
}: { 
  feature: string; 
  col: StatusColumn; 
  cards: ProjectCard[] 
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${feature}-${col}`,
  });

  return (
    <div 
      ref={setNodeRef}
      style={{ 
        background: isOver ? "#f0f8ff" : "transparent", 
        padding: 10, 
        borderRadius: 8, 
        minHeight: 160,
        border: isOver ? "2px dashed #007bff" : "1px solid #ddd",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{col}</div>

      <SortableContext items={flattenIds(cards)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 100 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <div style={{ 
              color: "#999", 
              fontSize: 14, 
              textAlign: "center", 
              padding: 20,
              border: "1px dashed #ccc",
              borderRadius: 4
            }}>
              Drop here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({
  data,
  adminMode,
  onRefresh,
}: {
  data: BoardResponse;
  adminMode: boolean;
  onRefresh: () => void;
}) {
  // Local working copy (so we can optimistic update)
  const [board, setBoard] = useState(data.board);

  // Update local state when data prop changes
  useEffect(() => {
    setBoard(data.board);
  }, [data.board]);

  // Keep fixed columns from backend
  const columns = data.columns;

  // Helper: get list for a lane+column
  function getList(feature: string, col: StatusColumn) {
    return board?.[feature]?.[col] ?? [];
  }

  // NOTE: For simplicity, we only allow drag when adminMode = true.
  async function onDragEnd(e: DragEndEvent) {
    console.log('Drag end event fired:', { active: e.active.id, over: e.over?.id });

    if (!adminMode) {
      console.log('Admin mode not enabled, ignoring drag');
      return;
    }

    const activeId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId) return;

    console.log('Drag end:', { activeId, overId });

    // Find the active card
    let fromFeature: string | null = null;
    let fromCol: StatusColumn | null = null;
    let activeCard: ProjectCard | null = null;

    for (const feat of Object.keys(board)) {
      for (const col of columns) {
        const list = getList(feat, col);
        const found = list.find(x => x.id === activeId);
        if (found) {
          fromFeature = feat;
          fromCol = col;
          activeCard = found;
          break;
        }
      }
      if (activeCard) break;
    }

    if (!activeCard || !fromFeature || !fromCol) return;

    // Determine target feature and column
    let toFeature: string = '';
    let toCol: StatusColumn;

    // Check if overId is a column droppable (format: "feature-col")
    if (overId.includes('-')) {
      // Find which feature-col this droppable id corresponds to
      let found = false;
      for (const feat of Object.keys(board)) {
        for (const col of columns) {
          if (`${feat}-${col}` === overId) {
            toFeature = feat;
            toCol = col;
            console.log('Dropping on column:', { toFeature, toCol });
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        console.log('Invalid droppable id:', overId);
        return;
      }
    } else {
      // overId is a card ID - find its feature and column
      toCol = 'Planned'; // Default fallback
      
      for (const feat of Object.keys(board)) {
        for (const col of columns) {
          const list = getList(feat, col);
          const found = list.find(x => x.id === overId);
          if (found) {
            toFeature = feat;
            toCol = col;
            console.log('Dropping on card:', { toFeature, toCol, cardId: overId });
            break;
          }
        }
        if (toFeature) break;
      }
    }

    if (!toFeature || !toCol) {
      console.log('No valid target found');
      return;
    }

    // If dropping in same position, do nothing
    if (fromFeature === toFeature && fromCol === toCol) {
      // Check if it's the same card or just same column
      const targetList = getList(toFeature, toCol);
      const activeIndex = targetList.findIndex(x => x.id === activeId);
      if (activeIndex >= 0) return; // Already in correct position
    }

    // Remove from source
    const fromList = [...getList(fromFeature, fromCol)];
    const oldIndex = fromList.findIndex(x => x.id === activeId);
    fromList.splice(oldIndex, 1);

    // Add to target
    const toList = [...getList(toFeature, toCol)];
    
    // If dropping on a card, insert at that position
    let newIndex = toList.length; // Default to end
    if (!overId.includes('-')) {
      // Dropping on a card
      newIndex = toList.findIndex(x => x.id === overId);
      if (newIndex < 0) newIndex = toList.length;
    }
    // If dropping on empty column or end, append to end

    // Compute new order
    const before = toList[newIndex - 1]?.order ?? null;
    const after = toList[newIndex]?.order ?? null;
    const newOrder = computeSparseOrder(before ?? undefined, after ?? undefined);

    const updatedCard: ProjectCard = {
      ...activeCard,
      feature: toFeature,
      status: toCol,
      order: newOrder,
    };

    // Insert at new position
    toList.splice(newIndex, 0, updatedCard);

    // Optimistic update
    setBoard(prev => {
      const next = structuredClone(prev);
      next[fromFeature!][fromCol!] = (fromFeature === toFeature && fromCol === toCol) ? toList : fromList;
      if (!(fromFeature === toFeature && fromCol === toCol)) {
        next[toFeature!][toCol!] = toList;
      }
      return next;
    });

    // Persist to backend
    try {
      console.log('Making API call:', { activeId, toFeature, toStatus: toCol, toOrder: newOrder });
      await moveProject(activeId, {
        toFeature,
        toStatus: toCol,
        toOrder: newOrder,
      });
      console.log('API call successful');
    } catch (err) {
      console.error("Failed to persist move", err);
      // rollback by refreshing from server
      onRefresh();
    }
  }

  // Render lanes + columns
  return (
    <DndContext 
      onDragEnd={onDragEnd} 
      collisionDetection={closestCenter}
      onDragStart={(e) => console.log('Drag started:', e.active.id)}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.keys(board).map((feature) => (
          <div key={feature} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: "0 0 12px 0" }}>{feature}</h3>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 12 }}>
              {columns.map((col) => (
                <DroppableColumn 
                  key={`${feature}-${col}`}
                  feature={feature}
                  col={col}
                  cards={getList(feature, col)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}