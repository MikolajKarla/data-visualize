import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import Columns from "./Column";
import ChartArea from "./ChartArea";
import { FileText, ArrowLeft, Database, Save, Globe, Eye } from "lucide-react";
import { useAuth, authenticatedFetch } from "@/lib/auth";
import toast from "react-hot-toast";

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
  
  // Project form states
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  
  const { user } = useAuth();


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

  const handleSaveProject = async () => {
    if (!projectTitle.trim()) {
      toast.error("Proszę podać tytuł projektu");
      return;
    }

    if (!user) {
      toast.error("Musisz być zalogowany żeby zapisać projekt");
      return;
    }

    setSaving(true);
    try {
      const response = await authenticatedFetch('/projects/save', {
        method: 'POST',
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription || null,
          is_public: isPublic,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Projekt został zapisany pomyślnie!");
        console.log('Project saved:', result);
      } else {
        throw new Error('Nie udało się zapisać projektu');
      }
    } catch (error) {
      console.error('Save project error:', error);
      toast.error('Wystąpił błąd podczas zapisywania projektu');
    } finally {
      setSaving(false);
    }
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
          <div className="flex-1 px-4 lg:px-6 bg-gradient-to-br from-background to-secondary/5 ">
            <div className="h-screen">
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
                        
                {/* Project Save Form */}
                <div className="bg-card border border-border rounded-lg p-4 mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Save className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Zapisz Projekt
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Project Title */}
                    <div className="lg:col-span-2">
                      <label htmlFor="projectTitle" className="block text-sm font-medium text-foreground mb-2">
                        Tytuł projektu *
                      </label>
                      <input
                        type="text"
                        id="projectTitle"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Np. Analiza sprzedaży Q4"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    {/* Project Description */}
                    <div className="lg:col-span-2">
                      <label htmlFor="projectDescription" className="block text-sm font-medium text-foreground mb-2">
                        Opis projektu
                      </label>
                      <textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Opcjonalny opis projektu..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                    
                    {/* Privacy Setting */}
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        {isPublic ? (
                          <Globe className="w-5 h-5 text-green-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {isPublic ? "Projekt publiczny" : "Projekt prywatny"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isPublic ? "Widoczny dla wszystkich" : "Tylko dla Ciebie"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          isPublic ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isPublic ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Save Button */}
                    <div>
                      <Button
                        onClick={handleSaveProject}
                        disabled={saving || !projectTitle.trim()}
                        className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Zapisywanie...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Zapisz Projekt
                          </>
                        )}
                      </Button>
                    </div>
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