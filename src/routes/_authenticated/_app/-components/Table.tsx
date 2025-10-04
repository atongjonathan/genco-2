import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface TableProps {
  data: Record<string, any>[];
  title: string;
  columns: ColumnDef<Record<string, any>>[];
}

const Table = ({ data = [], title, columns }: TableProps) => {
  const [sorting, setSorting] = useState<any>([]);

  // Add numbering column as first column
  const numberedColumns: ColumnDef<Record<string, any>>[] = [
    {
      id: 'rowNumber',
      header: '#',
      cell: (info) => info.row.index + 1,
      enableSorting: false,
      size: 40,
    },
    ...columns,
  ];

  const table = useReactTable({
    data: data ?? [],
    columns: numberedColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body p-0">
        <table className="table table-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={
                      header.column.id === 'id'
                        ? { width: '10px' }
                        : header.column.id === 'label'
                          ? { width: '40px' }
                          : undefined
                    }
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={
                      header.column.getCanSort() ? 'cursor-pointer' : ''
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <span className="ms-1">
                        {header.column.getIsSorted() === 'asc' ? (
                          <i className="bi bi-sort-up" />
                        ) : (
                          ''
                        )}
                        {header.column.getIsSorted() === 'desc' ? (
                          <i className="bi bi-sort-down" />
                        ) : (
                          ''
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="align-middle">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
