/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  ColumnSort,
  ColumnDef,
  TableOptions,
} from '@tanstack/react-table';
import prepareQueryParam from '@Utils/prepareQueryParam';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@Components/RadixComponents/Table';
import Icon from '@Components/common/Icon';
import Skeleton from '@Components/RadixComponents/Skeleton';
import useDebounceListener from '@Hooks/useDebounceListner';
import { FlexColumn, FlexRow } from '../Layouts';
import Pagination from './Pagination';

export interface ColumnData {
  header: string;
  accessorKey: string;
  cell?: any;
}

interface DataTableProps {
  columns: ColumnDef<ColumnData>[];
  queryKey: string;
  queryFn: (params: any) => Promise<any>;
  queryFnParams?: Record<string, any>;
  initialState?: any;
  searchInput?: string;
  wrapperStyle?: CSSProperties;
  sortingKeyMap?: Record<string, any>;
  withPagination?: boolean;
  tableOptions?: Partial<TableOptions<ColumnData>>;
  searchString?: string;
}

const defaultPaginationState = {
  paginationState: {
    pageIndex: 0,
    pageSize: 25,
  },
};

const testData = [
  {
    id: 1,
    username: 'laxman',
    designation: 'trainer',
    role_type: 'admin',
    is_active: true,
    date_modified: '2022-10-12',
  },
  {
    id: 2,
    username: 'laxman',
    designation: 'trainer',
    role_type: 'admin',
    is_active: true,
    date_modified: '2022-10-12',
  },
  {
    id: 3,
    username: 'laxman',
    designation: 'trainer',
    role_type: 'admin',
    is_active: true,
    date_modified: '2022-10-12',
  },
  {
    id: 4,
    username: 'laxman',
    designation: 'trainer',
    role_type: 'admin',
    is_active: true,
    date_modified: '2022-10-12',
  },
  {
    id: 5,
    username: 'laxman',
    designation: 'trainer',
    role_type: 'admin',
    is_active: true,
    date_modified: '2022-10-12',
  },
  {
    id: 6,
    username: 'laxman',
    designation: 'trainer',
    role_type: 'admin',
    is_active: true,
    date_modified: '2022-10-12',
  },
];

export default function DataTable({
  columns,
  queryKey,
  queryFn,
  initialState = { ...defaultPaginationState },
  searchInput,
  queryFnParams,
  wrapperStyle,
  sortingKeyMap,
  withPagination = true,
  tableOptions,
  searchString,
}: DataTableProps) {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const defaultData = React.useMemo(() => [], []);

  const debouncedValue = useDebounceListener(searchInput || '', 500);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
      ...initialState.paginationState,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      queryKey,
      pageIndex,
      pageSize,
      debouncedValue,
      queryFnParams,
      sorting,
    ],
    queryFn: () =>
      queryFn({
        page: pageIndex + 1,
        page_size: pageSize,
        search: debouncedValue,
        ...(queryFnParams ? prepareQueryParam(queryFnParams) : {}),
        ordering: sorting
          .map(s => {
            const sortingKey = sortingKeyMap?.[s.id] || s.id;
            return s.desc ? `-${sortingKey}` : sortingKey;
          })
          .join(','),
      }),
    select: response => response.data,
    // select: response => testData,
  });

  useEffect(() => {
    setPagination(prevPagination => ({
      ...prevPagination,
      pageIndex: 0,
    }));
  }, [searchInput]);

  // const dataList = useMemo(() => data || testData, [data]);
  const dataList = useMemo(() => data || testData, [data]);

  const pageCounts = (dataList?.count ?? 0) / pageSize;

  const table = useReactTable({
    data: Array.isArray(dataList) ? dataList : dataList?.results ?? defaultData,
    columns,
    pageCount: Number.isNaN(pageCounts) ? -1 : Number(Math.ceil(pageCounts)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: searchInput,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
    ...tableOptions,
  });

  // if (isError) {
  //   return (
  //     <div>{isError && <span>Error: {(error as Error).message}</span>}</div>
  //   );
  // }

  return (
    <div
      className="flex h-full flex-col justify-between"
      // style={wrapperStyle}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="bg-primary-500"
                >
                  {!header.isPlaceholder && (
                    <FlexRow className="cursor-pointer items-center justify-start">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* @ts-ignore */}
                      {header.column.columnDef.accessorKey.startsWith(
                        'icon',
                      ) ? null : (
                        <Icon
                          name={
                            header.column.getIsSorted()
                              ? 'arrow_drop_up'
                              : 'arrow_drop_down'
                          }
                          className="mt-1 text-white "
                        />
                      )}
                    </FlexRow>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 12 }).map((_, idx) => (
              <TableRow key={idx}>
                {columns.map(cell => {
                  return (
                    <TableCell
                      key={cell.id}
                      className={`${cell.header === '' ? 'w-[130px]' : ''} `}
                    >
                      <Skeleton className="my-1.5 h-4 w-8/12 bg-grey-400" />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => {
                  return (
                    <TableCell
                      key={cell.id}
                      className={`${
                        cell.column.columnDef.header === 'Email'
                          ? '!normal-case'
                          : ''
                      }`}
                    >
                      {cell.getValue() !== null
                        ? flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        : '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No Data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {withPagination && (
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalCount={dataList.count}
          pageSize={pageSize}
          table={table}
        />
      )}
    </div>
  );
}
