import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface TableProps {
  data: Record<string, any>[];
  title: string;
  columns: ColumnDef<Record<string, any>>[];
  loading?: boolean;
  searchable?: boolean;
  pageSize?: number;
}

const Table = ({
  data = [],
  title,
  columns,
  loading = false,
  searchable = true,
  pageSize = 5,
}: TableProps) => {
  const [sorting, setSorting] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Add row numbering column as first column
  const numberedColumns: ColumnDef<Record<string, any>>[] = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: (info) =>
          info.row.index +
          1 +
          info.table.getState().pagination.pageIndex * pageSize,
        enableSorting: false,
        size: 40,
      },
      ...columns,
    ],
    [columns, pageSize],
  );

  const table = useReactTable({
    data: data ?? [],
    columns: numberedColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const hasData = table.getRowModel().rows.length > 0;

  return (
    <div className="card card-outline card-secondary mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        {/* <div className=""></div> */}
        <h3 className="card-title mb-0">{title}</h3>
        {searchable && (
          <div className="card-tools">
            <div className="input-group input-group-sm" style={{ width: 180 }}>
              <input
                type="text"
                className="form-control float-right"
                placeholder="Search..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setGlobalFilter('')}
                >
                  <i className="fas fa-xs fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card-body p-0 table-responsive">
        <table className="table table-hover table-sm mb-0">
          <thead className="thead-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={`${
                      header.column.getCanSort() ? 'cursor-pointer' : ''
                    }`}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <span className="ms-1">
                        {header.column.getIsSorted() === 'asc' ? (
                          <i className="fas fa-xs fa-sort-up"></i>
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <i className="fas fa-xs fa-sort-down"></i>
                        ) : (
                          <i className="fas fa-xs fa-sort text-muted"></i>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={numberedColumns.length}
                  className="text-center py-4"
                >
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : hasData ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={numberedColumns.length}
                  className="text-center py-3 text-muted"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="card-footer clearfix">
        <ul className="pagination pagination-sm m-0 float-right">
          <li
            className={`page-item ${
              !table.getCanPreviousPage() ? 'disabled' : ''
            }`}
          >
            <button
              className="page-link"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
          </li>
          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <li
              key={i}
              className={`page-item ${
                table.getState().pagination.pageIndex === i ? 'active' : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${!table.getCanNextPage() ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </li>
        </ul>
        <div className="float-left small text-muted">
          Showing {table.getRowModel().rows.length} of {data.length} entries
        </div>
      </div>
    </div>
  );
};

export default Table;
