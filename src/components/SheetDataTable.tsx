import React from 'react';

interface SheetDataTableProps {
  headers: string[];
  data: any[];
}

const SheetDataTable: React.FC<SheetDataTableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        <div className="shadow-sm overflow-hidden border border-card-border rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-comerian-dark">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-comerian-gray uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card-bg divide-y divide-gray-700">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-comerian-dark/50 transition-colors">
                    {headers.map((header, colIndex) => (
                      <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-comerian-gray">
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
      <div className="mt-2 text-sm text-comerian-gray">
        {data.length} {data.length === 1 ? 'row' : 'rows'} loaded
      </div>
    </div>
  );
};

export default SheetDataTable;