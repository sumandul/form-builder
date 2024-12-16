import { useState } from 'react';
import type { Table } from '@tanstack/react-table';
import usePagination, {
  DOTS,
} from '@Components/common/DataTable/Pagination/usePagination';
import { Button } from '@Components/RadixComponents/Button';
import { FlexRow } from '@Components/common/Layouts';
import { Input, Select } from '@Components/common/FormUI';
import prepareDropdownOptions from '@Utils/prepareDropdownOptions';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { ColumnData } from '..';

interface IPaginationProps {
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  table: Table<ColumnData>;
}

function Pagination({
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  table,
}: IPaginationProps) {
  const [pageSizeState, setPageSizeState] = useState(pageSize);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const options = [10, 25, 50, 100];

  const handleSelect = (selectedValue: any) => {
    table.setPageSize(selectedValue);
    setPageSizeState(selectedValue);
    table.setPageIndex(0);
  };

  return (
    <FlexRow
      className="flex w-full
       items-center justify-between gap-4 bg-white px-6  py-4
      "
    >
      <FlexRow className="w-full items-center justify-between gap-2  md:w-[78%]">
        <FlexRow gap={4} className="items-center">
          <p className="text-sm font-bold">Row per page</p>
          <Select
            key={table.getState().pagination.pageSize}
            options={prepareDropdownOptions(options)}
            onChange={handleSelect}
            selectedOption={pageSizeState}
            placeholder="Select"
            direction="top"
            className="h-9 !w-[64px] rounded-lg border md:!w-20"
          />
        </FlexRow>
        <FlexRow gap={2}>
          <FlexRow className="items-center gap-4">
            <p className="text-sm font-bold">Go to page</p>
            <Input
              type="number"
              defaultValue={currentPage}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              min={1}
              max={100}
              className="w-14 border px-1 py-0"
            />
          </FlexRow>
        </FlexRow>
      </FlexRow>

      <FlexRow>
        <Button
          variant="ghost"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <FlexRow className="items-center justify-center gap-3">
          {paginationRange.map(pageNumber => {
            if (pageNumber === DOTS) {
              return <span key={pageNumber}>&#8230;</span>;
            }
            return (
              <Button
                size="sm"
                key={pageNumber}
                variant={currentPage === pageNumber ? 'default' : 'outline'}
                onClick={() => table.setPageIndex(+pageNumber - 1)}
              >
                {pageNumber}
              </Button>
            );
          })}
        </FlexRow>
        <Button
          variant="ghost"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </FlexRow>
    </FlexRow>
  );
}
export default hasErrorBoundary(Pagination);
