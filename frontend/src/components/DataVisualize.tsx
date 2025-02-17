import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Columns from "./Columns";
import ChartArea from "./ChartArea";

interface DataVisualizeProps {
  file: File;
  columns: string[];
  onDelete: () => void;
}

interface ChartColumns {
  [chartId: string]: string[]; // Use index signature for flexibility
}

const DataVisualize: React.FC<DataVisualizeProps> = ({ file, columns, onDelete }) => {
  const [chartColumns, setChartColumns] = useState<ChartColumns>({
    chart1: [],
    chart2: [],
    chart3: [],
    chart4: [],
  });

 
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setChartColumns((prev) => {
      const updatedChartColumns = { ...prev };
      // Add Logic (if over exists)
      if (over && over.id in updatedChartColumns && active) {
        const chartId = over.id as keyof ChartColumns;
        const activeId = active.id as string;

        if (
          updatedChartColumns[chartId].length < 4 &&
          !updatedChartColumns[chartId].includes(activeId)
        ) {
          updatedChartColumns[chartId] = [...updatedChartColumns[chartId], activeId];
        }
        return updatedChartColumns; //return the updated state
      }
      return prev; // Important: Return previous state if no changes are made
    });
  }, [chartColumns]);

  const handleDeleteColumn = (chartId: string, column: string) => {
    console.log(`Deleting column ${column} from chart ${chartId}`);
    setChartColumns((prev) => ({
        ...prev,
        [chartId]: prev[chartId].filter((c) => c !== column),
    }));
};
  const chartIds = Object.keys(chartColumns);


  return (
    <div className="flex w-full h-screen">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-1/5 bg-gray-800 bg-opacity-85 p-4">
          <h2 className="text-xl font-semibold text-white text-center">
            {file.name}
            <br />
            Columns
          </h2>
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

        <div className="w-4/5 px-4 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-3 w-full h-full">
          {chartIds.map((chartId) => (
              <ChartArea
                key={chartId}
                id={chartId}
                droppedColumns={chartColumns[chartId]}
                onDeleteColumn={(column) => handleDeleteColumn(chartId, column)} // Call handleDeleteColumn directly
                onModifyColumn={(column) => handleDeleteColumn(chartId, column)} // Call handleDeleteColumn directly

              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default DataVisualize;