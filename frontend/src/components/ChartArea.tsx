import { useDroppable } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2, X, BarChart3, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth';

interface ChartAreaProps {
  id: string;
  droppedColumns: string[];
  onDeleteColumn: (col: string) => void;
  onModifyColumn: (col: string) => void;
}

const ChartArea: React.FC<ChartAreaProps> = ({ id, droppedColumns, onDeleteColumn }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [chartType, setChartType] = useState<string>('');
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleRemoveColumn = (col: string) => {
    onDeleteColumn(col);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setFullScreen(false);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);
  
  useEffect(() => {
    if (chartType !== '' && droppedColumns.length > 1) {
      setLoading(true);
      setChartError(null);
      setChartImageUrl(null);
      
      const columns = {
        x_column: [droppedColumns[0]],
        y_columns: droppedColumns.slice(1)
      };
      
      fetch(`http://127.0.0.1:8000/chart/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ chartType, columns })
      })
        .then(async response => {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('image')) {
            const blob = await response.blob();
            return { isImage: true, blob, text: '' };
          } else {
            const text = await response.text();
            return { isImage: false, blob: null, text };
          }
        })
        .then(result => {
          setLoading(false);
          if (result.isImage && result.blob) {
            const imageUrl = URL.createObjectURL(result.blob);
            setChartImageUrl(imageUrl);
          } else if (result.text) {
            try {
              const errorData = JSON.parse(result.text);
              setChartError(errorData.message);
            } catch {
              setChartError(result.text);
            }
          }
        })
        .catch(error => {
          setLoading(false);
          setChartError('Error fetching chart: ' + error.message);
        });
    } else {
      setChartImageUrl(null);
      setChartError(null);
    }
  }, [droppedColumns, chartType, id, token]);

  const getChartTitle = () => {
    const chartIndex = parseInt(id.replace('chart', ''));
    return `Chart ${chartIndex}`;
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-lg flex flex-col h-full min-h-[300px] lg:min-h-[400px]  card-hover">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <BarChart3 size={16} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{getChartTitle()}</h3>
            </div>
          </div>
          
          {/* Chart Type Selector */}
          <div className="relative">
            <select
              className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              value={chartType}
              onChange={e => setChartType(e.target.value)}
            >
              <option value="" disabled>Select chart type</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="area">Area Chart</option>
              <option value="radar">Radar Chart</option>
            </select>
            <ChevronDown 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>
        </div>

        {/* Droppable Area */}
        <div className="p-3 lg:p-4 border-b border-border">
          <div
            ref={setNodeRef}
            className={`min-h-[60px] lg:min-h-[80px] border-2 border-dashed rounded-xl p-3 transition-all duration-200 ${
              isOver 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            {droppedColumns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-2 lg:py-4">
                <div className="p-2 bg-muted rounded-lg mb-2">
                  <BarChart3 size={20} className="text-muted-foreground" />
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Drop columns here to create a chart
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Columns ({droppedColumns.length}/4)
                </div>
                <div className="flex flex-wrap gap-2">
                  {droppedColumns.map((col, index) => (
                    <div
                      key={col}
                      className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm font-medium group hover:bg-primary/20 transition-all duration-200"
                    >
                      <span className="text-xs text-primary/60">
                        {index === 0 ? 'X' : 'Y'}
                      </span>
                      <span className="truncate max-w-[80px] lg:max-w-[100px]">{col}</span>
                      <button
                        onClick={() => handleRemoveColumn(col)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-destructive"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Display Area */}
        <div className="flex-1 p-3 lg:p-4 bg-gradient-to-br from-background to-muted/20 min-h-[200px] lg:min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-6 lg:w-8 h-6 lg:h-8 animate-spin text-primary mb-3" />
              <p className="text-xs lg:text-sm text-muted-foreground">Generating chart...</p>
            </div>
          ) : chartError ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-3 bg-destructive/10 rounded-lg mb-3">
                <AlertCircle className="w-5 lg:w-6 h-5 lg:h-6 text-destructive" />
              </div>
              <p className="text-xs lg:text-sm text-destructive font-medium mb-1">Chart Error</p>
              <p className="text-xs text-muted-foreground">{chartError}</p>
            </div>
          ) : chartImageUrl ? (
            <div className="relative h-full group">
              <img 
                src={chartImageUrl} 
                alt="Generated Chart" 
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg" />
              
              {/* Maximize button on image */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                onClick={() => setFullScreen(true)}
              >
                <Maximize2 size={14} />
              </Button>
            </div>
          ) : droppedColumns.length > 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-3 bg-muted rounded-lg mb-3">
                <BarChart3 className="w-5 lg:w-6 h-5 lg:h-6 text-muted-foreground" />
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Select a chart type to generate visualization
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-3 bg-muted rounded-lg mb-3">
                <BarChart3 className="w-5 lg:w-6 h-5 lg:h-6 text-muted-foreground" />
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Chart will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && chartImageUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={chartImageUrl}
              alt="Chart Fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 rounded-full right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={() => setFullScreen(false)}
            >
              <Minimize2 size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChartArea;
