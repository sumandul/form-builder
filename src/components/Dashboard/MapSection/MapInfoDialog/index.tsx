/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import Icon from '@Components/common/Icon';
import IconButton from '@Components/common/IconButton';
import { FlexColumn, FlexRow } from '@Components/common/Layouts';
import Skeleton from '@Utils/skeleton';
import { chartData, Impact, weatherIcons } from '@Constants/map';
import { setMapState } from '@Store/actions/mapActions';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import usePhotoUrl from '@Hooks/usePhotoUrl';
import { Loader } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import MapInfoDialogSkeleton from './MapInfoDailogSkeleton';
import useDataForChart from './useDataForChart';
import useDataForPopup from './useDataForPopup';

const colors = ['#ff0000', '#00f000'];

export default function MapInfoDialog() {
  const dispatch = useTypedDispatch();
  const isFullScreenOn = useTypedSelector(state => state.mapSlice.isFullScreen);
  const day = useTypedSelector(state => state.mapSlice.day);
  const timeInterval = useTypedSelector(state => state.mapSlice.interval);
  const navigateTo = useNavigate();
  const featureId = useTypedSelector(
    state => state.mapSlice.featureInfo.featureId,
  );

  const sliderValue = useTypedSelector(state => state.mapSlider.sliderValue);

  const feature = useTypedSelector(state => state.mapSlice.featureInfo.feature);

  const selectedLayerData = useTypedSelector(
    state => state.mapSlice.featureInfo.selectedLayerData,
  );
  // const isCurrentData = feature.layer.id.includes('current');
  const municipalityCode = feature.properties.municipality_code;
  const featureHasMunicipalCode = !!municipalityCode;

  // const isCurrentPopupDataEnabled = isCurrentData && featureHasMunicipalCode;
  const {
    weatherApiForecastPrecipitation,
    windyData,
    // weatherApiCurrentPrecipitation,
    weatherApiForecastTemperature,
    weatherApiCurrentTemperature,
    windyDataForecast,
    hiwatPrecipitaionData,
    dhmRiverWatchChartData,
  } = useDataForChart({
    municipalityCode,
    featureHasMunicipalCode,
    feature,
  });
  ///

  // for popup date
  const {
    realtimeCurrentPopUpData,
    dhmRainfallWatchPopupData,
    dhmRiverWatchPopupData,
    weatherapiForecastPrecipitationPopupData,
    windyForecastPopupData,
    hiwatPopupData,
    isErrorX,
    isLoadingx,
    popUpData,
    landslideDetail,
    impactDetail,
  } = useDataForPopup({
    feature,
    featureId,
    // isCurrentPopupDataEnabled,
    day,
    timeInterval,
    municipalityCode,
    sliderValue,
  });
  const desiredOrder = [
    'Picture',
    'Photo',
    'precipitation',
    'title',
    'photo',
    'basin',
    'username',
    'district',
    'municipality_name',
    'today',
    'tomorrow',
    'relative_humidity',
    'lat',
    'lon',
    'wind_u',
    'precip',
    'municipality',
    'ward_no',
    'temp',

    'precipitation',
    'status',
    'local_time',

    'timestamp_local_django',
    'local_time',
    'current.temp_c',
    'current.wind_kph',
    'current.precip_mm',
    'current.humidity',
    'waterLevel',
    'location.lat',
    'relative_humidity',

    'landslide_name',
    // 'timestamp_local_django',
    'landslide_type',
    'landslide_date',
    'landslide_origin_date',
    'layer_name',
    'watershed_',

    // 'lon',
  ];
  const preparedPoupData = useMemo(() => {
    const { source } = feature;

    const data = {
      'current-dhm-rain-watch': {
        // @ts-ignore
        chartData: dhmRainfallWatchPopupData?.averages?.map(avg => ({
          date: `${avg.interval} hr`,
          rainfall: avg.value,
        })),
        popUpData: {
          ...dhmRainfallWatchPopupData,
          // ...(feature.properties || {}),
        },
        chartKey: ['rainfall'],
        chartId: 'dhmChart',
        popUpKey: 'rain',
      },
      'current-dhm-river-watch': {
        chartData: dhmRiverWatchChartData,
        popUpData: {
          ...dhmRiverWatchPopupData,
        },
        chartKey: ['water_level'],
        chartId: 'dhmChart',
        popUpKey: 'river',
      },
      'current-temperature-weatherapi': {
        chartData: weatherApiCurrentTemperature,
        popUpData: {
          ...(realtimeCurrentPopUpData || {}),
        },
        chartKey: ['max_temperature', 'min_temperature'],
        chartId: 'current-temperature',
        popUpKey: 'weatherapi',
      },
      'forecast-temperature-hiwat': {
        chartData: hiwatPrecipitaionData,
        popUpData: {
          ...hiwatPopupData,
          // ...(feature.properties || {}),
        },
        chartKey: ['max_temperature', 'min_temperature'],
        chartId: 'forecast-temperature',
        popUpKey: 'hiwat',
      },
      'forecast-precipitation-hiwat': {
        chartData: hiwatPrecipitaionData,
        popUpData: {
          ...(hiwatPopupData || {}),
        },
        chartKey: ['precipitation'],
        chartId: 'forecast-precipitation',
        popUpKey: 'precipitation-hiwat',
      },
      'forecast-temperature-windy': {
        chartData: windyData,
        popUpData: {
          ...windyForecastPopupData?.[0],
        },
        chartKey: ['max_temperature', 'min_temperature'],
        chartId: 'forecast-temperature',
        popUpKey: 'temperature-windy',
      },
      'forecast-temperature-weatherapi': {
        popUpData: {
          ...(weatherapiForecastPrecipitationPopupData?.[0] || {}),
        },
        chartData: weatherApiForecastTemperature,
        chartKey: ['max_temperature', 'min_temperature'],
        chartId: 'forecast-temperature',
        popUpKey: 'temperature-weatherapi',
      },

      'forecast-precipitation-windy': {
        chartData: windyDataForecast,
        popUpData: {
          ...windyForecastPopupData?.[0],
        },
        chartKey: ['precipitation'],
        chartId: 'forecast-precipitation',
        popUpKey: 'precipitation-windy',
      },
      'land-slide-data': {
        popUpData: {
          ...landslideDetail,
        },
        // chartKey: 'precipitation',
      },
      'impact-data': {
        popUpData: {
          ...impactDetail,
        },
        // chartKey: 'precipitation',
      },

      'forecast-precipitation-weatherapi': {
        chartData: weatherApiForecastPrecipitation?.data,
        popUpData: {
          ...(weatherapiForecastPrecipitationPopupData?.[0] || {}),
        },
        chartKey: ['precipitation'],
        chartId: 'forecast-precipitation',
        popUpKey: 'forecast-precipitation',
      },
    };

    const datax = Object.keys(data).includes(source)
      ? // @ts-ignore
        data[String(source)]
      : { popUpData };

    return { ...datax };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    popUpData,
    feature,
    featureId,
    windyData,
    windyDataForecast,
    impactDetail,
    landslideDetail,
    realtimeCurrentPopUpData,
    weatherApiForecastPrecipitation,
    dhmRainfallWatchPopupData,
    dhmRiverWatchPopupData,
    weatherApiForecastPrecipitation,
    windyData,
    // weatherApiCurrentPrecipitation,
    weatherApiForecastTemperature,
    weatherApiCurrentTemperature,
    windyDataForecast,
    dhmRiverWatchChartData,
    sliderValue,
  ]);
  const { PhotoUrl, loading } = usePhotoUrl(
    preparedPoupData?.popUpData?.Photo || preparedPoupData?.popUpData?.Picture,
  );
  const exceptions = [
    'GPS',
    'averages',
    'humidity',
    '_id',
    'station_series_id',
    'warning_level',
    'municipality_code',
    'wind_u',
    'weathericon',
    'status',
    'value',
    'municipality_name',
    'temperature',
    'temp',
    'precip',
    'District',
    'title',
    'district',
    'warning_level',
    'danger_level',
    'name',
    'current.temp_c',
    'current.wind_kph',
    'current.precip_mm',
    'current.humidity',
    'interval',
    'district_code',
    'stationIndex',
    'waterLevel',
  ];
  const getMunicipalityCode = (municipalCode: number | number[]) => {
    if (Array.isArray(municipalCode) && municipalCode.length === 1) {
      return municipalCode[0];
    }

    return municipalCode;
  };
  const getOrderedPopUpData = (data: Record<string, any>, order: string[]) => {
    const orderedData: Record<string, any> = {};
    order?.forEach(key => {
      if (data[key] !== undefined) {
        orderedData[key] = data[key];
      }
    });
    Object?.keys(data)?.forEach(key => {
      if (!order.includes(key)) {
        orderedData[key] = data[key];
      }
    });
    return orderedData;
  };

  const getKeyName = (key: string): string => {
    const nameObj: { [key: string]: string } = {};
    Object.assign(nameObj, {
      precip: 'Precipitation',
      relative_humidity: 'Relative humidity',
      observation_date: 'Observation date',
      municipality: 'Municipality',
      username: 'Name',
      ward_no: 'Ward No',
      landslide_type: 'Landslide type',
      landslide_name: 'Landslide name',
      landslide_origin_date: 'Landslide origin date',
      landslide_date: 'Landslide date',
      about_impact: 'About impact',
      humidity: 'Humidity',
      basin: 'Basin',
      layer_name: 'layer name',
      watershed_: 'watershed',
      winds_40kts: 'wind',
      wind_u: 'wind',
    });

    const longitudeKeys = ['lon', 'long', 'longitude', 'location.lon'];
    const latitudeKeys = ['lat', 'latitude', 'location.lat'];
    const timeKeys = [
      'local_time',
      'current.time',
      'timestamp',
      'timestamp_local_django',
    ];

    // Assign the same value for each group of keys
    // eslint-disable-next-line no-return-assign
    latitudeKeys.forEach(k => (nameObj[k] = 'Latitude'));
    // eslint-disable-next-line no-return-assign
    longitudeKeys.forEach(k => (nameObj[k] = 'Longitude'));
    // eslint-disable-next-line no-return-assign

    // eslint-disable-next-line no-return-assign
    timeKeys.forEach(k => (nameObj[k] = 'Time'));

    // Add the remaining unique key-value pairs

    // Return the corresponding name or fallback to the key itself
    return nameObj[key] || key;
  };

  const getValue = (value: string, key: string): string => {
    const dateKeys = [
      'local_time',
      'current.time',
      'observation_date',
      'timestamp',
      'datetime',
      'timestamp_local_django',
    ];

    if (dateKeys.includes(key)) {
      const parsedDate = parseISO(value);
      if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd hh:mm aa'); // Return formatted date if valid
      }
    }

    return value; // Return the original value if the key doesn't match or date is invalid
  };
  function getNavigationUrl(chartDataObject: any) {
    const { chartId } = chartDataObject;

    switch (chartId) {
      case 'forecast-precipitation':
        return `?chart_type=precipitation&municipality_code=${getMunicipalityCode(
          chartDataObject.popUpData.municipality_code,
        )}&chartId=${chartId}`;
      case 'forecast-temperature':
        return `?chart_type=temperature&municipality_code=${getMunicipalityCode(
          chartDataObject.popUpData.municipality_code,
        )}&chartId=${chartId}`;
      case 'current-temperature':
        return `?chart_type=temperature&municipality_code=${getMunicipalityCode(
          chartDataObject.popUpData.municipality_code,
        )}&chartId=${chartId}`;
      case 'dhmChart':
        return chartDataObject?.popUpData?.stationIndex
          ? `?chart_type=precipitation&chartId=${chartId}&stationId=${chartDataObject?.popUpData?.stationIndex}`
          : `?chart_type=precipitation&chartId=${chartId}`;
      default:
        return '/';
    }
  }

  function renderData(data: any, key: string) {
    if (key === 'Photo' || key === 'Picture') {
      return (
        <div className="flex items-center gap-2" key={selectedLayerData?.key}>
          <div className="h-[18rem] w-[500px]">
            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader />
              </div>
            ) : (
              <img
                src={PhotoUrl || ''}
                alt="photo"
                className="h-full w-full rounded-md object-cover"
              />
            )}
          </div>
        </div>
      );
    }

    // Render arrays
    if (Array.isArray(data)) {
      return (
        <div className="flex items-center gap-2" key={selectedLayerData?.key}>
          <span className="flex-1 font-primary text-button-md capitalize">
            {getKeyName(key)}
          </span>
          <p className="flex-1">{getValue(data.join(', '), key)}</p>
        </div>
      );
    }

    // Render objects
    if (typeof data === 'object' && data !== null) {
      return (
        <div key={selectedLayerData?.key}>
          <ul className="rounded-lg border-[1px] border-grey-300">
            {Object.entries(getOrderedPopUpData(data, desiredOrder)).map(
              ([keyx, value]) => (
                <li
                  key={keyx}
                  className="flex items-center px-2 py-2 odd:bg-grey-100"
                >
                  <p className="w-1/2 break-words text-tooltip capitalize">
                    {getKeyName(keyx)}
                  </p>
                  <p className="w-1/2 pl-2 text-tooltip font-bold">
                    {getValue(String(value), keyx)}
                  </p>
                </li>
              ),
            )}
          </ul>
        </div>
      );
    }
    return (
      <>
        {' '}
        {/* {isLoadingx && <MapInfoDialogSkeleton />} */}
        <div className="flex items-center " key={selectedLayerData?.key}>
          <span className="flex-1 font-primary text-button-md capitalize">
            {getKeyName(key)}
          </span>
          <p className="flex-1">{getValue(data, key)}</p>
        </div>
      </>
    );
  }

  const getInfoDialogName = (sourceId: string): string => {
    const nameObj = {
      'current-dhm-rain-watch': 'DHM Rainfall Watch',
      'current-dhm-river-watch': 'DHM River Watch',
      'current-temperature-weatherapi': 'Weatherapi Temperature',
      'forecast-temperature-hiwat': 'HIWAT',
      'forecast-precipitation-hiwat': 'HIWAT',
      'forecast-temperature-windy': 'Windy',
      'forecast-temperature-weatherapi': 'Weatherapi',
      'forecast-precipitation-windy': 'Windy',
      'land-slide-data': 'landslide Point',
      'impact-data': 'Impact Point',
      'forecast-precipitation-weatherapi': 'Weatherapi',
    };

    // @ts-ignore
    return nameObj[sourceId];
  };
  const popUpObj = preparedPoupData?.popUpData;

  return (
    <div
      className={`${
        isFullScreenOn ? 'h-[calc(100vh)]' : 'h-[calc(100vh-68px)]'
      } absolute right-0 top-0 z-20 w-[18.75rem] bg-white`}
    >
      <div className="scrollbar h-[92%] overflow-y-scroll px-4">
        <FlexRow className="sticky top-0 z-50 justify-between bg-white py-4">
          <span className="font-primary text-button-md capitalize">
            {popUpData?.Info?.layer_name ||
              getInfoDialogName(feature?.layer?.source)}
            {/* feature?.layer?.source?.split('-')?.join(' ')} */}
          </span>
          <Icon
            name="close"
            onClick={() => dispatch(setMapState({ isInfoOn: false }))}
          />
        </FlexRow>

        {isErrorX && <div className="p-4">Error Fetching Data</div>}
        {isLoadingx ? (
          <MapInfoDialogSkeleton />
        ) : (
          <>
            <FlexColumn className="mt-3 gap-3">
              {popUpObj &&
                Object.keys(popUpObj).length > 0 &&
                // selectedLayerData.subcategory === 'Forecast Layer' &&
                !landslideDetail &&
                !impactDetail && (
                  <div className="h-min-[6rem] relative mb-1 flex w-full rounded-md bg-[#dcdcdc] p-2 py-2 pb-4">
                    <div className="btn-text text-primary-400 flex items-start justify-between gap-1">
                      <div className="info w-1/1 flex flex-col gap-2">
                        <p className="text-base">
                          {preparedPoupData.popUpData.municipality_name ||
                            preparedPoupData.popUpData.title ||
                            preparedPoupData.popUpData.municipality}
                        </p>
                        {preparedPoupData.popUpData.temperature &&
                          !impactDetail &&
                          !landslideDetail && (
                            <p className="text-base">
                              {preparedPoupData.popUpData.temperature
                                ? JSON.parse(
                                    preparedPoupData.popUpData.temperature,
                                  )
                                : ''}{' '}
                              °C
                            </p>
                          )}
                        {preparedPoupData.popUpKey === 'temperature-windy' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  temperature:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.temp} °C
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Wind :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.wind_u}
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Precipitation:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.precip}
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey ===
                          'temperature-weatherapi' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Temperature :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.temp_c']}°C
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Precipitation:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.precip_mm']}
                                </p>
                              </div>

                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Wind :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.wind_kph']} km/h
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Humidity :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.humidity']}
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey === 'precipitation-hiwat' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  District:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.District}
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey === 'precipitation-windy' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Precipitation:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.precip}
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Windy:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.wind_u}
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Tempreture
                                </span>
                                <p className="font-normal ">{popUpObj?.temp}</p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey ===
                          'temperature-weatherapi' &&
                          popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Humidity:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj.humidity}
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey ===
                          'forecast-precipitation' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Temperature :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.temp_c']}°C
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Precipitation:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.precip_mm']}
                                </p>
                              </div>

                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Wind :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.wind_kph']} km/h
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Humidity :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj['current.humidity']}
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey === 'hiwat' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  District:
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.District}
                                  kk
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey === 'river' &&
                          selectedLayerData.subcategory === 'Current Layer' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  District :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.district}
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  River:
                                </span>
                                <p className="font-normal ">{popUpObj?.name}</p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Water Level :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.waterLevel?.value}
                                </p>{' '}
                                mm
                              </div>
                              {popUpObj?.warning_level && (
                                <div className="font- flex items-center gap-2 text-[0.8rem]">
                                  <span className="font-semibold capitalize">
                                    Warning Level :
                                  </span>
                                  <p className="font-normal ">
                                    {popUpObj?.warning_level}
                                  </p>
                                </div>
                              )}
                              {popUpObj?.danger_level && (
                                <div className="font- flex items-center gap-2 text-[0.8rem]">
                                  <span className="font-semibold capitalize">
                                    Danger Level :
                                  </span>
                                  <p className="font-normal ">
                                    {popUpObj?.danger_level}
                                  </p>
                                </div>
                              )}
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Time :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.waterLevel?.datetime}
                                </p>
                              </div>
                            </>
                          )}
                        {preparedPoupData.popUpKey === 'rain' &&
                          selectedLayerData.subcategory === 'Current Layer' &&
                          !popUpObj.weathericon &&
                          !impactDetail &&
                          !landslideDetail && (
                            <>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Precipitation :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.value}
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  Time Interval :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.interval}
                                </p>
                              </div>
                              <div className="font- flex items-center gap-2 text-[0.8rem]">
                                <span className="font-semibold capitalize">
                                  status :
                                </span>
                                <p className="font-normal ">
                                  {popUpObj?.status}
                                </p>
                              </div>
                            </>
                          )}
                        {/* Additional conditions and rendering as needed */}
                      </div>

                      {preparedPoupData.popUpData?.weathericon && (
                        <div className="w-1/3 pr-2">
                          <img
                            src={
                              weatherIcons.find(
                                item =>
                                  item.name ===
                                  preparedPoupData.popUpData?.weathericon?.[0],
                              )?.url
                            }
                            style={{ width: '9rem' }}
                            className="max-h-full w-[9rem] object-fill"
                            alt="weather-icon"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {Object.entries(getOrderedPopUpData(popUpObj, desiredOrder)).map(
                ([key, value]) =>
                  !exceptions.includes(key) ? (
                    <div key={key}>
                      {renderData(value as Record<string, any>, key)}
                    </div>
                  ) : null,
              )}
            </FlexColumn>
          </>
        )}

        {Object.keys(preparedPoupData?.chartData || {})?.length ? (
          <div className="mb-2 mt-4 h-fit w-full">
            <p className="text-md text-gray-900">Data trend</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={730}
                  height={250}
                  data={preparedPoupData.chartData || []}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 0,
                  }}
                >
                  <XAxis
                    dataKey="date"
                    // tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
                  />

                  <YAxis
                    // dataKey="value"
                    tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
                  />

                  <CartesianGrid strokeDasharray="6 6" />

                  {preparedPoupData?.chartKey?.map(
                    (chrtKey: string, index: number) => {
                      return (
                        <Line
                          key={chrtKey}
                          type="monotone"
                          dataKey={chrtKey || 'value'}
                          stroke={colors[index]}
                          dot={false}
                        />
                      );
                    },
                  )}
                  {/* <Line
                    type="monotone"
                    dataKey={preparedPoupData?.chartKey || 'value'}
                    stroke="#00f000"
                    dot={false}
                  /> */}

                  <Tooltip />
                  <Legend />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <IconButton
              buttonText="View more"
              name="chevron_right"
              className="mx-auto rounded-md bg-primary-500 px-4 font-primary text-button-md text-white hover:bg-primary-900"
              onClick={() =>
                navigateTo(`/analytics${getNavigationUrl(preparedPoupData)}`)
              }
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* {Object?.entries(popUpData || {}).length ? (
        <IconButton
          buttonText="ANALYTICS"
          name="chevron_right"
          className="mx-auto rounded-md bg-primary-500 px-4 font-primary text-button-md text-white hover:bg-primary-900"
          // onClick={renderToAnalytics}
        />
      ) : (
        <></>
      )} */}
    </div>
  );
}
