import { useEffect } from 'react';
import { FlexColumn } from '@Components/common/Layouts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAlertList } from '@Services/unAuthenticatedAPIs';
import Spinner from '@Components/common/Spinner';
import { useIntersectionObserver } from '@Hooks/useIntresectionObserver';
import AlertLogo from '@Assets/images/Alert.svg';
import { format } from 'date-fns';
import { AlertListResponse } from '@Components/Dashboard/types/index';
import useOutsideClick from '@Hooks/useForm/useOutsideHook';
import AlertCard from './AlertCard';

// Define the structure of an Alert

export default function MapAlertLogs() {
  const [ref, toggle, handleToggle] = useOutsideClick('single');

  // Fetch alerts using useInfiniteQuery
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['alerts'], // Unique key for the query
      queryFn: ({ pageParam = 1 }) =>
        getAlertList({ page: pageParam }) as Promise<AlertListResponse>,
      getNextPageParam: (lastPage: AlertListResponse) =>
        lastPage?.data?.next
          ? new URL(lastPage.data.next).searchParams.get('page')
          : undefined,
    });

  // Intersection observer setup to trigger pagination when the user scrolls to the bottom
  const [setRef, isIntersecting] = useIntersectionObserver({
    threshold: 1.0, // Trigger when the element is fully visible
    freezeOnceVisible: false, // Continue observing even after intersection
  });
  // Fetch next page when the bottom element becomes visible
  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage, hasNextPage]);

  return (
    <>
      <div ref={ref}>
        <button
          type="button"
          onClick={handleToggle}
          className="absolute right-6 top-3 z-10 mb-4 flex items-center gap-1 rounded-lg bg-blue-900 px-4 py-2 text-base text-white hover:bg-blue-950"
        >
          <img src={AlertLogo} className="w-4" alt="Alert logo" />
          {toggle ? 'Hide Alerts' : 'Show Alerts'}
        </button>

        {toggle && (
          <div className="scrollbar absolute right-3 top-[4rem] z-10 max-h-[62vh] overflow-y-auto">
            <FlexColumn className="items-end gap-3">
              {data?.pages?.map(page =>
                page.data.results.map(alert => (
                  <AlertCard
                    // id={alert.id}
                    key={alert.id}
                    title={
                      alert.alert || alert.weather_alert_title || 'No Title'
                    }
                    icon={alert.alert_icon}
                    description={
                      alert.alert_description ||
                      alert.weather_alert_description ||
                      'No Description'
                    }
                    alertType={alert.alert_type}
                    date={format(
                      new Date(alert.date_created),
                      'yyyy-MM-dd hh:mm:ss a',
                    )}
                  />
                )),
              )}
              <div ref={setRef} className="h-10" />

              <div className="flex items-center justify-center pr-28">
                {isFetchingNextPage && (
                  <Spinner className="h-[2rem] w-[2rem]" />
                )}
              </div>
            </FlexColumn>
          </div>
        )}
      </div>
    </>
  );
}
