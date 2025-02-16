import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { IoMdSettings } from "react-icons/io";
import { useDraggable } from "@dnd-kit/core";

function Columns({ element }: { element: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element,
  });

  // Stylizacja elementu z uwzględnieniem stanu przeciągania
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-900 rounded-md w-full mt-2 pl-4 pr-2 dark:hover:bg-gray-600 py-2 flex items-center justify-between ${
        isDragging ? "cursor-grabbing" : "cursor-grab"} 
        position-${  isDragging ? "relative" : "inherit"}
        z-${isDragging ? "50" : "auto"
      }`}
    >
      <p>{element}</p>
      <div className="flex gap-3">
        <div className="settings my-auto">
          <IoMdSettings size={16} />
        </div>
        <div
          className="handle my-auto cursor-grab"
          {...attributes}
          {...listeners}
        >
          <RxDragHandleDots2 size={22} />
        </div>
      </div>
    </div>
  );
}

export default Columns;
