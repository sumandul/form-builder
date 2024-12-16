/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import { Button } from '@Components/RadixComponents/Button';
import Icon from '@Components/common/Icon';
import PortalTemplate from '@Components/common/PortalTemplate';

import {
  deleteThreshold,
  deleteWeatherThreshold,
  getThresholdDetails,
  getWeatherThresholdDetails,
} from '@Services/adminDashboard';

import { useEffect, useState } from 'react';
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AddThresholdOverlay from '@Components/PortalOverlays/AddThresholdOverlay';
import { LogCardSkeleton } from '../AlertLogs/LogCard';

import ThresholdCard from './ThresholdCard';

export default function AlertThreshold() {
  const [isOpenAddThresholdPortal, setIsOpenAddThresholdPortal] =
    useState(false);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletebleThreshold, setDeletebleThreshold] = useState('');
  const [editableThreshold, setEditableThreshold] = useState(null);
  const queryClient = useQueryClient();
  const [thresholdData, setThresholdData] = useState<any[]>([]);
  const [selectedDataTab, setSelectedDataTab] = useState('layer');
  // console.log(thresholdData, 'data');
  const { data: thresholds, isLoading } = useQuery({
    queryKey: ['threshold-data-list'],
    queryFn: () => getThresholdDetails(),
    select: response => response.data,
  });
  const {
    data: weatherThresholds,
    isLoading: isWeatherThresholdSuccess,
    refetch,
  } = useQuery({
    queryKey: ['weather-threshold-data-list'],
    queryFn: () => getWeatherThresholdDetails(),
    select: response => response.data,
  });
  useEffect(() => {
    if (!weatherThresholds || !thresholds) return;
    refetch();
    setThresholdData([...thresholds, ...weatherThresholds]);
  }, [weatherThresholds, thresholds, refetch]);

  const { mutate, isLoading: deleteIsLoading } = useMutation<
    any,
    unknown,
    any,
    unknown
  >({
    mutationFn: deleteThreshold,
    mutationKey: ['delete-threshold'],
    onSuccess: () => {
      setIsConfirmDeleteOpen(false);
      toast.success('Threshold deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['threshold-data-list'] });
    },
  });

  const { mutate: deleteWeatherData, isLoading: isWeatherDataDeleting } =
    useMutation<any, unknown, any, unknown>({
      mutationFn: deleteWeatherThreshold,
      mutationKey: ['delete-weather-threshold'],
      onSuccess: () => {
        setIsConfirmDeleteOpen(false);
        toast.success('Threshold deleted successfully.');
        queryClient.invalidateQueries({
          queryKey: ['weather-threshold-data-list'],
        });
      },
    });
  return (
    <>
      <div className="flex h-full flex-col  transition-height duration-1000 ease-in-out">
        <div className="top mb-4 flex items-start justify-between">
          <h5 className="">Hydrometeorological Alert</h5>
          <div className="left flex gap-2">
            {/* <Searchbar
              placeholder="Search"
              value={searchText}
              onChange={e =>
                setParams(prev => ({ ...prev, search: e.target.value }))
              }
            /> */}
            <Button
              type="button"
              variant="icon-primary"
              className="flex !items-center justify-between gap-1  font-bold uppercase"
              onClick={() => setIsOpenAddThresholdPortal(true)}
            >
              ADD Hydrometeorological &nbsp;ALERT&nbsp;{' '}
              <Icon className="mt-1" name="add" />
            </Button>
          </div>
        </div>
        <div className="scrollbar flex h-full flex-col gap-2 overflow-y-auto pr-2  transition-height duration-1000 ease-in-out">
          {isLoading ||
            (isWeatherThresholdSuccess &&
              Array.from({ length: 5 }).map((_item, index) => (
                <LogCardSkeleton key={index} />
              )))}
          {!isLoading && thresholdData?.length ? (
            thresholdData?.map(
              ({
                alert_icon,
                title,
                id,
                layer,
                weather_source,
                threshold_value,
                description,
                parameter,
                weather_thresholds,
              }: Record<string, any>) => (
                <ThresholdCard
                  key={id}
                  alert_icon={alert_icon}
                  title={title}
                  layer={layer}
                  weather_source={weather_source}
                  // statistics={statistics}
                  threshold_value={
                    parameter === 'precipitation'
                      ? weather_thresholds
                      : threshold_value
                  }
                  description={description}
                  onEditClick={() => {
                    setIsOpenAddThresholdPortal(true);
                    setEditableThreshold(id);
                  }}
                  onDeleteClick={() => {
                    setDeletebleThreshold(id);
                    setIsConfirmDeleteOpen(true);
                    if (weather_source || weather_source === null) {
                      setSelectedDataTab('weather_source');
                    } else {
                      setSelectedDataTab('layer');
                    }
                  }}
                />
              ),
            )
          ) : (
            <p className="text-body-md">No Logs available</p>
          )}
        </div>
      </div>

      {isOpenAddThresholdPortal && (
        <PortalTemplate>
          <AddThresholdOverlay
            onCancel={() => {
              setIsOpenAddThresholdPortal(false);
              setEditableThreshold(null);
              // setSelectedDataTab('layer');
            }}
            id={editableThreshold}
            // selectedDataTab={selectedDataTab}
          />
        </PortalTemplate>
      )}

      {isConfirmDeleteOpen && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            title="Are you sure you want to delete this threshold?"
            onCancel={() => setIsConfirmDeleteOpen(false)}
            onConfirm={() => {
              selectedDataTab === 'weather_source'
                ? deleteWeatherData(deletebleThreshold)
                : mutate(deletebleThreshold);
            }}
            isLoading={deleteIsLoading || isWeatherDataDeleting}
          />
        </PortalTemplate>
      )}
    </>
  );
}
