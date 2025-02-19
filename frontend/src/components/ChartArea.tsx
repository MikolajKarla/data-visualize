import { useDroppable } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import { useSortable, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SlSizeFullscreen, SlSizeActual } from "react-icons/sl";

interface ChartAreaProps {
  id: string;
  droppedColumns: string[];
  onDeleteColumn: (col: string) => void;
  onModifyColumn: (col: string) => void;
}

const ChartArea: React.FC<ChartAreaProps> = ({ id, droppedColumns, onDeleteColumn, onModifyColumn }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [chartType, setChartType] = useState<string>('');
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const handleRemoveColumn = (col: string) => {
    onDeleteColumn(col);
  };

  const handleModifyColumn = (col: string) => {
    onModifyColumn(col);
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
      console.log(chartType, columns);
      fetch(`http://127.0.0.1:8000/chart/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartType, columns })
      })
        .then(response => {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('image')) {
            return response.blob().then(blob => ({ isImage: true, blob }));
          } else {
            return response.text().then(text => ({ isImage: false, text }));
          }
        })
        .then(result => {
          setLoading(false);
          if (result.isImage) {
            const imageUrl = URL.createObjectURL(result.blob);
            console.log('Received chart image URL:', imageUrl);
            setChartImageUrl(imageUrl);
          } else {
            console.error('Error fetching chart image:', result.text);
              const errorData = JSON.parse(result.text);
              setChartError(errorData.message);
          }
        })
        .catch(error => console.error('Error fetching chart image:', error));
    } else {
      setChartImageUrl(null);
    }
  }, [droppedColumns, chartType, id]);

  const SortableItem: React.FC<{ id: string; col: string }> = ({col }) => {
    const threshold = 10;
    const displayText = col.length > threshold ? col.substring(0, threshold) + '..' : col;
    return (
      <div className="flex items-center border border-gray-600 bg-gray-800 rounded-md p-3 text-sm dark:hover:bg-gray-600">
        {displayText}
        <button onClick={() => handleRemoveColumn(col)} className="ml-2 text-red-500 hover:text-red-700">
          X
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 bg-opacity-85 flex flex-col  p-4 rounded shadow-lg w-full">
      <div className="flex justify-between text-center px-2">
        <select
          className="bg-gray-800 text-white p-2 py-4 rounded focus:outline-none"
          defaultValue=""
          onChange={e => setChartType(e.target.value)}
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
          className={`flex flex-wrap gap-2 w-full rounded-lg items-center justify-center transition-colors ${isOver ? 'bg-gray-500' : ''}`}
        >
          {droppedColumns.map(col => (
            <SortableItem key={col} id={col} col={col} />
          ))}
          {droppedColumns.length === 0 && <h2 className="text-sm opacity-80">(Drop columns here)</h2>}
        </div>
      </div>
      <div className="chart flex justify-center
       h-full items-center mx-auto ">
        {loading ? (
          <div className="flex items-center mt-4 text-white">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Loading...
          </div>
        ) : null}
        {chartImageUrl ? (
  <div className="relative">
    <img src={chartImageUrl} alt="Chart" className="w-full h-full object-contain" />
    <div className="absolute top-0 right-0 p-1 cursor-pointer z-50 flex items-center justify-center">
      <SlSizeFullscreen onClick={()=>setFullScreen(true)} className="text-4xl text-white bg-black bg-opacity-65 rounded-md p-2" />
    </div>
  </div>
) : null}
        <div className="text-red-500 mt-4">
          {chartError }
        </div>

      </div>
  {isFullScreen ? (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <img
      src={chartImageUrl ?? ""}
      alt="Chart Fullscreen"
      style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
    />
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        cursor: 'pointer',
        zIndex: 1001,
      }}
      onClick={() => setFullScreen(false)}
    >
      <SlSizeActual className="text-4xl text-white" />
    </div>
  </div>
  ) : null}

    </div>
  );
};

export default ChartArea;
