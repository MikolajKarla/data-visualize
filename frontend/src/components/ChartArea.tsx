import { useDroppable } from '@dnd-kit/core';
import React, { useEffect } from 'react';
import { useSortable, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ChartAreaProps {
  id: string;
  title: string;
  droppedColumns: string[];
  onDeleteColumn: (col: string) => void;
}

const ChartArea: React.FC<ChartAreaProps> = ({ id, title, droppedColumns, onDeleteColumn }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  useEffect(() => {
    if (droppedColumns.length) {
      const newColumn = droppedColumns[droppedColumns.length - 1];
      console.log(`Chart ${id}, dropped column: ${newColumn}`);
    }
  }, [droppedColumns, id]);

  const handleRemoveColumn = (col: string) => {
    onDeleteColumn(col);
  };

  const SortableItem: React.FC<{ id: string; col: string }> = ({ id, col }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const threshold = 10;
    const displayText = col.length > threshold ? col.substring(0, threshold) + '..' : col;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center border border-gray-600 rounded-md  p-3 text-sm dark:hover:bg-gray-600"
      >
        {displayText}
        <button
          onClick={() => handleRemoveColumn(col)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 bg-opacity-85 p-4 rounded shadow-lg w-full">
      <div className="flex justify-between px-2">
        <select
          className="bg-gray-800 text-white p-2 py-4 rounded focus:outline-none"
          defaultValue=""
          onChange={(e) => console.log(`Selected chart: ${e.target.value}`)}
        >
          <option value="" disabled>
            Wybierz typ wykresu
          </option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
          <option value="scatter">Scatter</option>
          <option value="area">Area</option>
          <option value="radar">Radar</option>
        </select>
        <div
          ref={setNodeRef}
          className={`flex flex-wrap gap-2 w-full rounded-lg justify-center transition-colors ${isOver ? "bg-gray-500" : ""}`}
        >
          <SortableContext items={droppedColumns} strategy={horizontalListSortingStrategy}>
            {droppedColumns.map((col) => (
              <SortableItem key={col} id={col} col={col} />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default ChartArea;