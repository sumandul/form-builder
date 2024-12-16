/* eslint-disable react/no-array-index-key */
// import NewFormControl from '@Components/common/FormUI/NewFormControl';
// import Icon from '@Components/common/Icon';
// import Searchbar from '@Components/common/Searchbar';
import { getAlertLogs } from '@Services/adminDashboard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AlertListResponse } from '@Components/Dashboard/types/index';
import { useIntersectionObserver } from '@Hooks/useIntresectionObserver';
import Spinner from '@Components/common/Spinner';
import LogCard, { LogCardSkeleton } from './LogCard';

export type ParamsType = { search: string; from: string; to: string };
export default function AlertLogs() {
  // const [params, setParams] = useState<ParamsType>({
  //   search: '',
  //   from: '',
  //   to: '',
  // });

  const {
    data: alertLogs,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['get-alert-logs'], // Include params in the query key
    queryFn: ({ pageParam = 1 }) =>
      getAlertLogs({
        page: pageParam,
      }) as Promise<AlertListResponse>,
    getNextPageParam: (lastPage: AlertListResponse) =>
      lastPage?.data?.next
        ? new URL(lastPage.data.next).searchParams.get('page')
        : undefined,
  });

  const [setRef, isIntersecting] = useIntersectionObserver({
    threshold: 1.0, // Trigger when the element is fully visible
    freezeOnceVisible: false, // Continue observing even after intersection
  });
  // Fetch next page whecn the bottom element becomes visible
  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage, hasNextPage]);

  return (
    <div className="flex flex-col">
      <div className="top flex items-center justify-between">
        <h5 className="my-2">Alert Logs</h5>
        {/* <div className="left flex gap-2">
          <Searchbar
            placeholder="Search"
            value={params.search}
            onChange={e =>
              setParams(prev => ({ ...prev, search: e.target.value }))
            }
            className="w-[12.5rem]"
          />
          <div className="line my-2 w-1 bg-gray-300" />
          <div className="date-range flex items-center gap-1">
            <Icon name="calendar_month" />
            <NewFormControl
              noIcon
              controlType="datePicker"
              placeholder="from"
              className="min-w-[9rem]"
              value={params.from}
              bindvalue={params.from}
              onChange={date => setParams(prev => ({ ...prev, from: date }))}
            />
            <span>to</span>
            <NewFormControl
              noIcon
              placeholder="to"
              className="min-w-[9rem]"
              controlType="datePicker"
              value={params.to}
              bindvalue={params.to}
              onChange={date => setParams(prev => ({ ...prev, to: date }))}
            />
            {(params.from || params.to || params.search) && (
              <Button
                variant="outline"
                onClick={() =>
                  setParams(prev => ({
                    ...prev,
                    from: '',
                    to: '',
                    search: '',
                  }))
                }
              >
                Clear
              </Button>
            )}
          </div>
        </div> */}
      </div>
      <div className="content mt-5 flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_item, index) => (
            <LogCardSkeleton key={index} />
          ))}
        {!isLoading ? (
          <>
            {alertLogs?.pages?.map(
              (page: Record<string, any>, pageIndex: number) =>
                page.data.results.map(
                  (log: Record<string, any>, logIndex: number) => (
                    <div key={`${pageIndex}-${logIndex}`}>
                      {/* Place the observer trigger before each log */}
                      {logIndex === 0 &&
                        pageIndex === alertLogs.pages.length - 1 && (
                          <div ref={setRef} className="h-1" />
                        )}
                      <LogCard
                        key={log.id}
                        title={log.alert || log.weather_alert_title}
                        description={
                          log.alert_description || log.weather_alert_description
                        }
                        date_created={log.date_created}
                        icon={log.alert_icon}
                      />
                    </div>
                  ),
                ),
            )}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center pr-28">
                <Spinner className="h-[10rem] w-[10rem] animate-spin" />
              </div>
            )}
          </>
        ) : (
          <p className="text-body-md">No Logs available</p>
        )}
      </div>
    </div>
  );
}
