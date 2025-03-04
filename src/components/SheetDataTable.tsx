import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface SheetDataTableProps {
  headers: string[];
  data: any[];
  isLoading?: boolean;
}

const SheetDataTable: React.FC<SheetDataTableProps> = ({ 
  headers, 
  data,
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({});
  
  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  // Get current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  
  // Change page
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Toggle column expansion
  const toggleColumnExpansion = (header: string) => {
    setExpandedColumns(prev => ({
      ...prev,
      [header]: !prev[header]
    }));
  };
  
  // Get column class based on expansion state
  const getColumnClass = (header: string) => {
    return expandedColumns[header] 
      ? "max-w-none" 
      : "max-w-[150px] truncate";
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-comerian-teal mb-4"></div>
        <p className="text-comerian-gray text-lg font-medium">Loading Leads...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Table container with horizontal scroll */}
      <div className="overflow-x-auto flex-grow mb-4">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow-sm overflow-hidden border border-card-border rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-comerian-dark">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-comerian-gray uppercase tracking-wider ${expandedColumns[header] ? 'min-w-[300px]' : 'w-[150px]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{header}</span>
                        <button 
                          onClick={() => toggleColumnExpansion(header)}
                          className="ml-2 p-1 rounded-md text-comerian-teal hover:bg-comerian-teal/20 transition-colors"
                          title={expandedColumns[header] ? "Collapse column" : "Expand column"}
                        >
                          {expandedColumns[header] ? 
                            <Minimize2 className="h-3.5 w-3.5" /> : 
                            <Maximize2 className="h-3.5 w-3.5" />
                          }
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card-bg divide-y divide-gray-700">
                {currentRows.length > 0 ? (
                  currentRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-comerian-dark/50 transition-colors">
                      {headers.map((header, colIndex) => (
                        <td 
                          key={`${rowIndex}-${colIndex}`} 
                          className={`px-6 py-4 text-sm text-comerian-gray ${getColumnClass(header)}`}
                          title={row[header] || ''}
                        >
                          {row[header] || ''}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="px-6 py-4 text-center text-sm text-comerian-gray">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Pagination controls - now in a fixed position at the bottom with spacing */}
      {data.length > 0 && (
        <div className="pt-4 pb-2 border-t border-gray-700 bg-card-bg sticky left-0 right-0 bottom-0 flex items-center justify-between">
          <div className="flex items-center text-sm text-comerian-gray">
            <span>
              Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, data.length)} of {data.length} {data.length === 1 ? 'row' : 'rows'}
            </span>
            <div className="ml-4 flex items-center">
              <span className="mr-2">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="bg-comerian-dark border border-card-border rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-comerian-teal"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-comerian-teal hover:bg-comerian-teal/20'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-comerian-gray">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-1 rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-comerian-teal hover:bg-comerian-teal/20'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetDataTable;