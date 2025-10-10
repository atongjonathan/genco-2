import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

interface TableProps {
  data: Record<string, any>[];
  title: string;
  columns: ColumnDef<Record<string, any>>[];
  loading?: boolean;
  searchable?: boolean;
  pageSize?: number;
  dateFilter?: boolean;
  dateColumnKey?: string; // NEW: key for filtering date column
  setData?: React.Dispatch<React.SetStateAction<Row<Record<string, any>>[]>>;
}

const Table = ({
  data = [],
  title,
  columns,
  loading = false,
  searchable = true,
  dateFilter = true,
  dateColumnKey,
  pageSize = 5,
  setData,
}: TableProps) => {
  const [sorting, setSorting] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('all');

  // Custom global filter: apply only to selected column or all columns
  function customGlobalFilter(row: any, filterValue: string) {
    if (!filterValue) return true;

    if (searchColumn === 'all') {
      return row
        .getAllCells()
        .some((cell: any) =>
          String(cell.getValue())
            .toLowerCase()
            .includes(filterValue.toLowerCase()),
        );
    }

    const value = row.getValue(searchColumn);
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  }

  // Filter data based on date range if applicable
  const filteredData = useMemo(() => {
    if (!dateFilter || !dateColumnKey || (!fromDate && !toDate)) return data;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return data.filter((row) => {
      const rawDate = row[dateColumnKey];
      if (!rawDate) return false;

      // Try parsing: expect something like "26 Sept 2025"
      const parsedDate = new Date(rawDate);

      if (isNaN(parsedDate.getTime())) return false;

      if (from && parsedDate < from) return false;
      if (to && parsedDate > to) return false;

      return true;
    });
  }, [data, dateFilter, dateColumnKey, fromDate, toDate]);

  // Add row numbering
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
    data: filteredData,
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

  useEffect(() => {
    if (setData) {
      setData(table.getFilteredRowModel().rows);
    }
  }, [globalFilter, sorting]);

  return (
    <div className="card card-outline card-secondary mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h3 className="card-title mb-0">{title}</h3>
        <div className="flex gap-2 d-flex align-items-center">
          {searchable && (
            <div className="card-tools me-2 d-flex align-items-center gap-2">
              <select
                title="Column"
                className="form-select form-select-sm me-2"
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                style={{ width: 150 }}
              >
                <option value="all">All Columns</option>
                {columns.map((col) => {
                  if (
                    'accessorKey' in col &&
                    typeof col.accessorKey === 'string'
                  ) {
                    return (
                      <option key={col.accessorKey} value={col.accessorKey}>
                        {typeof col.header === 'string'
                          ? col.header
                          : col.accessorKey}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>

              <div
                className="input-group input-group-sm"
                style={{ width: 180 }}
              >
                <input
                  type="text"
                  className="form-control float-right"
                  placeholder={`Search...`}
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    title="Clear"
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

          {dateFilter && dateColumnKey && (
            <>
              <input
                type="date"
                className="form-control form-control-sm me-2"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                title="From Date"
              />
              <input
                type="date"
                className="form-control form-control-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                title="To Date"
              />
            </>
          )}
        </div>
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

      <div className="card-footer clearfix">
        <ul className="pagination pagination-sm m-0 float-right">
          <li
            className={`page-item ${!table.getCanPreviousPage() ? 'disabled' : ''}`}
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
          Showing {table.getRowModel().rows.length} of {filteredData.length}{' '}
          entries
        </div>
      </div>
    </div>
  );
};

export default Table;
