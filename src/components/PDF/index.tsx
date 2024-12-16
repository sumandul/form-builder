/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useInfiniteQuery } from '@tanstack/react-query';
import BindContentContainer from '@Components/common/BindContentContainer';
import { useState } from 'react';
import { getPaginatedPDfs } from '@Services/pdf';
import PDFCard, { PDFCardSkeleton } from './PDFCard';
import PDFHeader from './PDFHeader';

type PDFListType = Record<string, any>;
export default function PDFpage() {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('created_date');
  const {
    data: PDFList,
    hasNextPage,
    fetchNextPage,
    ...PDFState
  } = useInfiniteQuery<PDFListType>({
    queryKey: ['get-pdf-list', searchText, sortBy],
    queryFn: ({ pageParam }) => {
      return getPaginatedPDfs({
        search: searchText,
        pageParam,
        ordering: sortBy,
      });
    },
    getNextPageParam: lastPage => {
      return lastPage?.data?.next;
    },
  });

  return (
    <div className="m-auto h-fit w-full ">
      <BindContentContainer className="header m-auto flex h-[4.75rem] flex-col items-center justify-center">
        <PDFHeader
          setSearchText={setSearchText}
          setSortBy={setSortBy}
          sortBy={sortBy}
        />
      </BindContentContainer>
      <div
        className="scrollbar max-h-[calc(100vh-9rem)] overflow-y-auto"
        style={{ scrollbarGutter: 'stable' }}
      >
        <BindContentContainer className="row-auto m-auto grid h-fit w-full grid-cols-1 place-items-center  gap-5  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {PDFState.isLoading
            ? Array.from({ length: 4 }).map((index: any) => (
                <PDFCardSkeleton key={index} />
              ))
            : PDFList?.pages?.map(page => {
                return page?.data?.results?.map((item: Record<string, any>) => (
                  <PDFCard key={item.uuid} PDFFile={item} />
                ));
              })}
        </BindContentContainer>
        <div className="row-auto grid h-fit w-full grid-cols-1 place-items-center  gap-5  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {!PDFState.isLoading &&
            PDFState.isFetching &&
            Array.from({ length: 4 }).map((index: any) => (
              <PDFCardSkeleton key={index} />
            ))}
        </div>
        {!PDFState.isLoading ? (
          <div className="loadmore flex w-full items-center justify-center py-4">
            <button
              type="button"
              className={` ${
                hasNextPage
                  ? 'cursor-pointer text-blue-600 hover:text-blue-700'
                  : 'cursor-default text-gray-600 hover:text-gray-700'
              }`}
              onClick={e => {
                e.stopPropagation();
                fetchNextPage();
              }}
              disabled={!hasNextPage}
            >
              {hasNextPage ? 'Load More' : ''}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
