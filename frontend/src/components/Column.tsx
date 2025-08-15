import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { GripVertical, Database } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

function Columns({ element }: { element: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-card border border-border rounded-xl p-2 lg:p-3 transition-all duration-200 ${
        isDragging 
          ? "cursor-grabbing shadow-lg scale-105 z-999  bg-accent border-primary" 
          : "cursor-grab hover:bg-accent/50 hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          <div className="p-1 lg:p-1.5 bg-primary/10 rounded-lg">
            <Database size={14} className="text-primary lg:w-4 lg:h-4" />
          </div>
          <p className="font-medium text-foreground truncate text-xs lg:text-sm">
            {element}
          </p>
        </div>
        
        <div
          className={`p-1 lg:p-1.5 rounded-lg transition-all duration-200 ${
            isDragging 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-accent group-hover:bg-accent"
          }`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} className="lg:w-4 lg:h-4" />
        </div>
      </div>
    </div>
  );
}

export default Columns;
