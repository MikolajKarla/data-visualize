import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Columns from "./Columns";
import ChartArea from "./ChartArea";
// Removed unused import of SortableContext
interface DataVisualizeProps {
  file: File;
  columns: string[];
  onDelete: () => void;
}

interface ChartColumns {
  chart1: string[];
  chart2: string[];
  chart3: string[];
  chart4: string[];
}



const DataVisualize: React.FC<DataVisualizeProps> = ({ file, columns, onDelete }) => {
  // Maintain dropped columns per chart.
  const [chartColumns, setChartColumns] = useState<ChartColumns>({
    chart1: [],
    chart2: [],
    chart3: [],
    chart4: [],
  });

  // onDragEnd will be called when a draggable item (a column) is dropped.
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && typeof over.id === "string" && chartColumns.hasOwnProperty(over.id)) {
        setChartColumns((prev) => {
          const newCols = { ...prev };
          if (!newCols[over.id as keyof ChartColumns].includes(active.id as string)) {
            if (newCols[over.id as keyof ChartColumns].length < 4) {
              newCols[over.id as keyof ChartColumns] = [
                ...newCols[over.id as keyof ChartColumns],
                active.id as string,
              ];
            }
          }
          return newCols;
        });
      }
    },
    [chartColumns] // Dodaj zależności, które funkcja wykorzystuje
  );

  return (
    <div className="flex w-full h-screen">
      {/* Left side: Scrollable list of draggable columns */}
          <DndContext onDragEnd={handleDragEnd}>
      <div className="w-1/5 bg-gray-800 bg-opacity-85 p-4 ">
        <h2 className="text-xl font-semibold text-white text-center">{file.name}<br />Columns</h2>
          {columns.map((element) => (
            <Columns key={element} element={element} />
          ))}
        <Button
          className="mt-4 px-6 py-2 dark:bg-gray-700 dark:hover:bg-gray-600 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all w-full"
          onClick={onDelete}
          >
          Upload Another File
        </Button>
      </div>

      {/* Right side: Chart areas with droppable zones */}
        <div className="w-4/5 px-4 flex items-center justify-center ">
            <div className="grid grid-cols-2 gap-3 w-full h-full  ">
            <ChartArea 
              id="chart1" 
              title="Chart 1" 
              droppedColumns={chartColumns.chart1} 
              onDeleteColumn={(column: string) =>
              setChartColumns((prev) => ({
                ...prev,
                chart1: prev.chart1.filter((c) => c !== column),
              }))
              }
            />
            <ChartArea 
              id="chart2" 
              title="Chart 2" 
              droppedColumns={chartColumns.chart2} 
              onDeleteColumn={(column: string) =>
              setChartColumns((prev) => ({
                ...prev,
                chart2: prev.chart2.filter((c) => c !== column),
              }))
              }
            />
            <ChartArea 
              id="chart3" 
              title="Chart 3" 
              droppedColumns={chartColumns.chart3} 
              onDeleteColumn={(column: string) =>
              setChartColumns((prev) => ({
                ...prev,
                chart3: prev.chart3.filter((c) => c !== column),
              }))
              }
            />
            <ChartArea 
              id="chart4" 
              title="Chart 4" 
              droppedColumns={chartColumns.chart4} 
              onDeleteColumn={(column: string) =>
              setChartColumns((prev) => ({
                ...prev,
                chart4: prev.chart4.filter((c) => c !== column),
              }))
              }
            />
            </div>
        </div>
      
          </DndContext>
    </div>
  );
};

export default DataVisualize;
