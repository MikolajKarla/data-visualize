import React, { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import Columns from "./Column";
import ChartArea from "./ChartArea";
import { FileText, ArrowLeft, Database } from "lucide-react";

interface DataVisualizeProps {
  file: File;
  columns: string[];
  onDelete: () => void;
}

interface ChartColumns {
  [chartId: string]: string[];
}

const DataVisualize: React.FC<DataVisualizeProps> = ({ file, columns, onDelete }) => {
  const [chartColumns, setChartColumns] = useState<ChartColumns>({
    chart1: [],
    chart2: [],
    chart3: [],
    chart4: [],
  });
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null);


  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragItem(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setChartColumns((prev) => {
      const updatedChartColumns = { ...prev };
      if (over && over.id in updatedChartColumns && active) {
        const chartId = over.id as keyof ChartColumns;
        const activeId = active.id as string;

        if (
          updatedChartColumns[chartId].length < 4 &&
          !updatedChartColumns[chartId].includes(activeId)
        ) {
          updatedChartColumns[chartId] = [...updatedChartColumns[chartId], activeId];
        }
        return updatedChartColumns;
      }
      return prev;
    });
    
    // Reset active drag item
    setActiveDragItem(null);
  }, []);

  const handleDeleteColumn = (chartId: string, column: string) => {
    setChartColumns((prev) => ({
      ...prev,
      [chartId]: prev[chartId].filter((c) => c !== column),
    }));
  };

  const chartIds = Object.keys(chartColumns);

  return (
    <div className="w-full min-h-screen bg-background">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-card border-b lg:border-b-0 lg:border-r border-border flex flex-col max-h-[40vh] lg:max-h-none">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {file.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {columns.length} columns available
                  </p>
                </div>
              </div>
              <Button
                onClick={onDelete}
                variant="outline"
                className="w-full gap-2 hover:bg-accent border-border"
              >
                <ArrowLeft size={16} />
                Upload Different File
              </Button>
            </div>

            {/* Columns List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Available Columns
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Drag columns to chart areas to create visualizations
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
                {columns.map((element) => (
                  <Columns key={element} element={element} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-background to-secondary/5 min-h-[60vh] lg:min-h-0">
            <div className="h-full">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                  Data Visualization Dashboard
                </h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Create up to 4 different charts by dragging columns from above
                </p>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 min-h-[400px] lg:h-[calc(100%-100px)]">
                {chartIds.map((chartId) => (
                  <ChartArea
                    key={chartId}
                    id={chartId}
                    droppedColumns={chartColumns[chartId]}
                    onDeleteColumn={(column) => handleDeleteColumn(chartId, column)}
                    onModifyColumn={(column) => handleDeleteColumn(chartId, column)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DragOverlay>
          {activeDragItem ? (
            <div className="bg-accent border border-primary rounded-xl p-2 lg:p-3 shadow-2xl opacity-90 rotate-3">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1 lg:p-1.5 bg-primary/10 rounded-lg">
                  <Database size={14} className="text-primary lg:w-4 lg:h-4" />
                </div>
                <p className="font-medium text-foreground text-xs lg:text-sm">
                  {activeDragItem}
                </p>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DataVisualize;