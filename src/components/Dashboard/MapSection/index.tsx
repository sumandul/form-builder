/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { useMapLibreGLMap } from '@Components/common/MapComponents';
import BaseLayerSwitcher from '@Components/common/MapComponents/BaseLayerSwitcher';
import VectorTileLayer from '@Components/common/MapComponents/Layers/VectorTileLayer';
import WMSImageServerLayer from '@Components/common/MapComponents/Layers/WMSImageServer';
import WMSLayer from '@Components/common/MapComponents/Layers/WMSLayer';
import Legend from '@Components/common/MapComponents/Legend';
import MapSidebar from '@Components/common/MapComponents/MapSiderbar';
import MapSlider from '@Components/common/MapComponents/MapSlider';
import { GeojsonType } from '@Components/common/MapComponents/Schemas';
import SubLayerLegend from '@Components/common/MapComponents/SubLayerLegend';
import TileLayerClick from '@Components/common/MapComponents/TileLayerClick';
import CustomVectorLayer from '@Components/common/MapLibreComponents/Layers/CustomVectorLayer';
import Loader from '@Components/common/MapLibreComponents/Loader';
import MapContainer from '@Components/common/MapLibreComponents/MapContainer';
import RadioButton from '@Components/RadixComponents/RadioButton';
import {
  defaultBorderPaint,
  fillPaints,
  Impact,
  LandStyle,
  precipitationWeatherStyle,
  weatherStyle,
} from '@Constants/map';
// import { getInfoTileStatics } from '@Services/adminDashboard';
import {
  getImpactData,
  getIndividualMunicipalityWeatherData,
  getLandSlideData,
  getMapSliderDataForRasterLayers,
  hcwaveforecast,
  hcwaveForecastObservation,
} from '@Services/common';
import { apiURL, heatWaveColdWaveApiUrl } from '@Services/config';
import {
  // setCoroplethRanges,
  setDhmTimeInterval,
  setHiwatData,
  setMapState,
} from '@Store/actions/mapActions';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import { useQuery } from '@tanstack/react-query';
import {
  getChoropethForForecastPrecipitationHiwat,
  getChoropethForForecastPrecipitationOpenweather,
  getChoropethForForecastPrecipitationWeatherApi,
  getChoropethForForecastPrecipitationWindy,
  getChoropethForForecastTemperatureHiwat,
  getChoropethForForecastTemperatureOpenweather,
  getChoropethForForecastTemperatureWeatherApi,
  getChoropethForForecastTemperatureWindy,
  // getChoroPlethRange,
  selectFillPaint,
} from '@Utils/map';
import { createContext, useContext, useEffect, useState } from 'react';
import { setSliderValue } from '@Store/actions/mapSliderActions';
import MapAlertLogs from './MapAlertLogs';
import MapControls from './MapControls';
import MapInfoDialog from './MapInfoDialog';
// import MunicipalWeatherData from './MunicipalWeatherData';
// import MunicipalWeatherData from './MunicipalWeatherData';
import MunicipalFilter from './MunicipalFilter';
import useMapSectionData from './useMapSectionData';
import DateToolBar from './DateFIlter';

interface IMapSectionProps {
  map: maplibregl.Map | null;
}

export const mapContext = createContext<IMapSectionProps | undefined>(
  undefined,
);

export const useMap = () => {
  const context = useContext(mapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapContainer');
  }
  return context;
};

function MapSection() {
  const [rasterLayerUrl, setRasterLayerUrl] = useState<string | null>(null);

  // eslint-disable-next-line no-unused-vars
  const [forecastInterval, setForecastInterval] = useState<string>('3');
  const [rainInterval, setRainInterval] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [selectedDay, setSelectedDay] = useState('today');

  // eslint-disable-next-line no-unused-vars

  const layersWithSliders = useTypedSelector(
    state => state.mapSlider.layersWithSliders,
  );
  const filterValue = useTypedSelector(state => state.mapSlice.filterValue);
  const checkedLayerFeatureId = useTypedSelector(
    state => state.mapSlider.checkedLayerFeatureId,
  );

  // const [popupMunicipality, setPopupMunicipality] = useState<{
  //   id: Record<string, any> | null;
  // } | null>(null);

  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(null);
  const dispatch = useTypedDispatch();
  const layerList = useTypedSelector(state => state.mapSlice.layerList);
  const isInfoOn = useTypedSelector(state => state.mapSlice.isInfoOn);
  const selectedLayerBound = useTypedSelector(
    state => state.mapSlice.selectedLayerBound,
  );
  const isFullScreenOn = useTypedSelector(state => state.mapSlice.isFullScreen);
  const sliderDataList = useTypedSelector(state => state.mapSlice.sliderList);
  const subLayerList = useTypedSelector(state => state.mapSlice.subLayerList);
  const checkedSubLayers = subLayerList?.filter(layer => layer.checked);
  useEffect(() => {
    dispatch(setMapState({ isInfoOn: false }));
  }, [dispatch, subLayerList]);
  useEffect(() => {
    dispatch(setHiwatData(selectedDay));
  }, [selectedDay]);
  useEffect(() => {
    dispatch(setDhmTimeInterval(rainInterval));
  }, [rainInterval]);

  // for fetching the count of sublayers
  // const rangeResponses = useQueries({
  //   queries: checkedSubLayers.map(checkedSubLayer => {
  //     return {
  //       queryKey: ['checked-sublayer-for-range', checkedSubLayer.id],
  //       queryFn: () =>
  //         getInfoTileStatics({
  //           info_layer: checkedSubLayer.id,
  //           feature_id: checkedSubLayer._layer_id,
  //           info_type:
  //             checkedSubLayer.layer_type === 'raster' ? 'max' : 'count',
  //         }),
  //     };
  //   }),
  // });
  // console.log(rangeResponses, 'ghg');
  // const choroplethRanges = rangeResponses
  //   .filter(res => res.status === 'success')
  //   .reduce<Record<string, any>[]>((acc, res) => {
  //     const responseParamId = res.data?.config.params.info_layer;
  //     const responseData = res.data?.data;
  //     return [...acc, { id: responseParamId, ...responseData }];
  //   }, []);

  // useEffect(() => {
  //   // if (choroplethRanges.length) {
  //   dispatch(setCoroplethRanges(choroplethRanges));
  //   // }
  // }, [choroplethRanges]);

  const { map, isMapLoaded } = useMapLibreGLMap({
    mapOptions: {
      zoom: 6.2,
      minZoom: 3,
      maxZoom: 19,
      center: [84.124, 28.3949],
    },
    fullScreen: isFullScreenOn,
  });

  const borderPaint = {
    'line-opacity': 1,
    'line-color': '#0066D2',
    'line-width': 0.2,
  };

  // Hover effect
  useEffect(() => {
    if (!map) return () => {};
    map.on('mousemove', () => {
      // eslint-disabl-next-line no-param-reassign
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', () => {
      // eslint-disable-next-line no-param-reassign
      map.getCanvas().style.cursor = '';
    });

    return () => {};
  }, [map]);

  useEffect(() => {
    if (!map || !selectedLayerBound) return;

    map.fitBounds(selectedLayerBound, {
      padding: 20,
    });
    dispatch(setMapState({ selectedLayerBound: null }));
  }, [dispatch, map, selectedLayerBound]);

  // eslint-disable-next-line no-unused-vars

  // Get the data for slider data

  // eslint-disable-next-line no-unused-vars
  const { data: sliderDataOptions, isSuccess: isSuccessSliderDataOptions } =
    useQuery({
      queryKey: [checkedLayerFeatureId[0]],
      enabled: !!checkedLayerFeatureId.length,
      queryFn: () =>
        getMapSliderDataForRasterLayers({
          layer_id: checkedLayerFeatureId[0],
        }),
      select: res => res.data,
      onSuccess: data => {
        setRasterLayerUrl(data[0]?.url);
      },
    });

  const sliderIndex = useTypedSelector(state => state.mapSlice.sliderIndex);

  // const openWeatherForecastData = useTypedSelector(
  //   state => state.mapSlice.openWeatherForecastData,
  // );

  // eslint-disable-next-line no-unused-vars
  const [municipalFeature, setMunicipalFeature] =
    useState<Record<string, any>>();

  // eslint-disable-next-line no-unused-vars
  const [forecastMunicipalFeature, setForecastMunicipalFeature] =
    useState<Record<string, any>>();

  // eslint-disable-next-line no-unused-vars
  const { data: popUpData, isInitialLoading: isLoading } = useQuery({
    queryKey: ['pop-up-data', municipalFeature],
    enabled:
      !!municipalFeature?.municipality_code &&
      municipalFeature?.layer.includes('openweather-current'),
    queryFn: () =>
      getIndividualMunicipalityWeatherData({
        municipality_code: municipalFeature?.municipality_code,
      }),
    select: res => res.data,
  });

  // const {
  //   data: openWeatherForecastForMunicipalData,
  //   isLoading: isLoadingOpenWeatherForecastForMunicipalData,
  // } = useQuery({
  //   queryKey: [
  //     'openWeatherForecastForMunicipalData',
  //     forecastMunicipalFeature,
  //     `${format(new Date(), 'yyyy-MM-dd')}+${
  //       forecastInterval.length <= 1 ? `0${forecastInterval}` : forecastInterval
  //     }:00:00`,
  //   ],
  //   enabled: !!forecastMunicipalFeature?.municipality_code,
  //   queryFn: () =>
  //     getOpenWeatherForecastByDateTime({
  //       municipality_code: forecastMunicipalFeature?.municipality_code,
  //       datetime: `${format(new Date(), 'yyyy-MM-dd')}+${
  //         forecastInterval.length <= 1
  //           ? `0${forecastInterval}`
  //           : forecastInterval
  //       }:00:00`,
  //     }),
  //   select: res => res.data,
  // });

  const {
    // eslint-disable-next-line no-unused-vars
    data: openWeatherForecastForMunicipalData,
    // isInitialLoading: isLoadingOpenWeatherForecastForMunicipalData,
  } = useQuery({
    // queryKey: [
    //   'openWeatherForecastForMunicipalData',
    //   forecastMunicipalFeature,
    //   `${format(new Date(), 'yyyy-MM-dd')}+${
    //     forecastInterval.length <= 1 ? `0${forecastInterval}` : forecastInterval
    //   }:00:00`,
    // ],
    queryKey: [
      'openWeatherForecastForMunicipal',
      forecastInterval,
      forecastMunicipalFeature,
    ],
    enabled:
      !!forecastMunicipalFeature?.municipality_code &&
      forecastMunicipalFeature?.layer.includes('openweather-forecast'),

    queryFn: () =>
      hcwaveForecastObservation({
        hour: forecastInterval,
        source: 'openweather_forecast',
        municipality_code: forecastMunicipalFeature?.municipality_code,
      }),

    select: (res: Record<string, any>) => {
      const payload: Record<string, any> = res.data[0];

      return {
        temperature: payload['main.temp'],
        municipality_code: payload.municipality_code,
        weathericon: payload['weather.icon'],
        municipality_name: payload.municipality_name,
        humidity: payload?.relative_humidity,
        precipitation: payload['rain.3h'],
      };
    },
  });

  const {
    // eslint-disable-next-line no-unused-vars
    data: weatherapiForecastForMunicipalData,
    // isInitialLoading: isLoadingWeatherapiForecastForMunicipalData,
  } = useQuery({
    queryKey: [
      'weatherapiForecastForMunicipal',
      forecastInterval,
      forecastMunicipalFeature,
    ],
    enabled:
      !!forecastMunicipalFeature?.municipality_code &&
      forecastMunicipalFeature?.layer.includes('weatherapi-forecast'),

    queryFn: () =>
      hcwaveForecastObservation({
        hour: forecastInterval,
        source: 'weatherapi_forecast',
        municipality_code: forecastMunicipalFeature?.municipality_code,
      }),

    select: (res: Record<string, any>) => {
      const payload: Record<string, any> = res.data[0];

      return {
        temperature: payload['current.temp_c'],
        municipality_code: payload.municipality_code,
        weathericon: payload['weather.icon'],
        municipality_name: payload.municipality_name,
        humidity: payload['current.humidity'],
        precipitation: payload['current.precip_mm'],
      };
    },
  });
  const {
    data: landslideData,
    isSuccess: islandSlideValuesSuccess,
    isLoading: islandSlideValuesLoading,
  } = useQuery({
    queryKey: ['landSlideData', filterValue],
    queryFn: () => getLandSlideData(filterValue), // Call the function here by adding parentheses
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res?.data?.submitted_station;
      return payload;
    },
    enabled: filterValue !== undefined && filterValue !== null,
  });

  // console.log(landslideData.features, 'landslideData');
  const {
    data: impactData,
    isSuccess: isImpactValuesSuccess,
    isLoading: isImpactValuesLoading,
  } = useQuery({
    queryKey: ['impactData', filterValue],
    queryFn: () => getImpactData(filterValue), // Call the function here by adding parentheses
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res?.data?.submitted_station;
      return payload;
    },
    enabled: filterValue !== undefined && filterValue !== null, // Only run the query when filterValue is defined
  });

  const {
    // eslint-disable-next-line no-unused-vars
    data: windyForecastForMunicipalData,
    // isInitialLoading: isLoadingWindyForecastForMunicipalData,
  } = useQuery({
    queryKey: [
      'windyForecastForMunicipal',
      forecastInterval,
      forecastMunicipalFeature,
    ],
    enabled:
      !!forecastMunicipalFeature?.municipality_code &&
      forecastMunicipalFeature?.layer.includes('windy-forecast'),

    queryFn: () =>
      hcwaveForecastObservation({
        hour: forecastInterval,
        source: 'windy',
        municipality_code: forecastMunicipalFeature?.municipality_code,
      }),

    select: (res: Record<string, any>) => {
      const payload: Record<string, any> = res.data[0];

      return {
        temperature: payload?.temp,
        municipality_code: payload.municipality_code,
        weathericon: payload['weather.icon'],
        municipality_name: payload.municipality_name,
        humidity: payload?.relative_humidity,
        precipitation: payload.precip,
      };
    },
  });

  // // Get the temperature data based on hours from the slider to plot the choropeth map
  const { data: chloropethData, isSuccess: isChloropethDataSuccess } = useQuery(
    {
      queryKey: ['pop-up-forecast-data', forecastInterval],
      queryFn: () =>
        hcwaveforecast({
          hour: forecastInterval,
        }),
      select: res => res.data,
      cacheTime: 0,
      // onSuccess: response => {
      //   setChoroPethColor(() => getChoropethForTemperature(response));
      // },
    },
  );

  const {
    dhmRainData,
    dhmRainSuccess,
    dhmRiverData,
    dhmRiverSuccess,
    errorFetchingForecastData,
    forecastObservationData,
    hiwatData,
    hiwatSuccess,
    isDhmRainLoading,
    isDhmRiverLoading,
    isForecastObservationDataSuccess,
    isHiwatLoading,
    isOpenweatherCurrentLoading,
    isOpenweatherForecastLoading,
    isWeatherapiCurrentLoading,
    isWeatherapiCurrentSuccess,
    isWeatherapiForecastLoading,
    isWeatherapiForecastSuccess,
    isWindyForecastLoading,
    openWeatherForecastData,
    weatherapiCurrentData,
    weatherapiForecastData,
    windyForecastData,
    windyForecastSuccess,
  } = useMapSectionData({
    forecastInterval,
    rainInterval,
    selectedDay,
  });

  // function getForecastWeatherData(layer: string) {
  //   if (!layer) return {};
  //   if (layer.includes('openweather-forecast'))
  //     return openWeatherForecastForMunicipalData;
  //   if (layer.includes('weatherapi-forecast'))
  //     return weatherapiForecastForMunicipalData;
  //   if (layer.includes('windy-forecast')) return windyForecastForMunicipalData;
  //   return {};
  // }

  const selectedLayers = layerList.filter(layer => layer.checked);
  // const checkedSubLayerss = selectedLayers.map(layer => layer.name_en);
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <mapContext.Provider value={{ map }}>
      <MapContainer
        map={map}
        isMapLoaded={isMapLoaded}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <div className=" absolute left-[20rem] top-10  h-5 w-40 bg-slate-500" />
        {/* <MoveLayer map={map} /> */}
        {/* For rainfall wath from dhm as it has intervals in which the rainfall is measured  */}
        {checkedSubLayers.some(
          layer => layer.name_en === 'DHM Rainfall Watch',
        ) && (
          <div className="absolute left-[350px] top-2 z-10">
            <RadioButton
              bindvalue={rainInterval}
              options={[
                { id: 1, label: '1 hour', value: 1 },
                { id: 2, label: '3 hour', value: 3 },
                { id: 3, label: '6 hour', value: 6 },
                { id: 4, label: '12 hour', value: 12 },
                { id: 5, label: '24 hour', value: 24 },
              ]}
              onChange={value => setRainInterval(+value)}
              buttonSize="lg"
              choose="value"
            />
          </div>
        )}

        {checkedSubLayers.some(layer => layer.layer_type === 'hiwat') && (
          <div className="absolute left-[340px] z-20">
            <RadioButton
              bindvalue={selectedDay}
              options={[
                { id: 1, label: 'Today', value: 'today' },
                { id: 2, label: 'Tomorrow', value: 'tomorrow' },
              ]}
              onChange={value => setSelectedDay(value)}
              buttonSize="lg"
              choose="value"
            />
          </div>
        )}
        <MapSidebar />

        {/* <CustomPopupUI /> */}

        {/* {sliderIsVisible && (
        )} */}

        {layersWithSliders?.length > 0 ? (
          <MapSlider
            hourTimeline
            onChange={(hour: string) => {
              dispatch(setSliderValue(hour));
              setForecastInterval(hour);
            }}
          />
        ) : null}

        <MapControls map={map} />
        <BaseLayerSwitcher map={map} />
        {/* mapping layers according to the layer type */}
        {layerList?.map((layer: Record<string, any>) => {
          if (layer.layer_type === 'vector') {
            return (
              <VectorTileLayer
                key={`${layer.id}-${layer.feature_id}`}
                maploaded={isMapLoaded}
                visibleOnMap={layer.checked}
                map={map}
                hasFill
                hasBorder={false}
                sourceId={`layer-${layer.layer}`}
                url={
                  layer.name_en === 'Sub-Watersheds' && selectedMunicipality
                    ? `${apiURL}/map/tile/{z}/{x}/{y}/?feature_id=${layer.id}&municipality_code=${selectedMunicipality}`
                    : `${apiURL}/map/tile/{z}/{x}/{y}/?feature_id=${layer.id}`
                }
                geometryType={layer.geometry_type}
                fillPaint={
                  layer.style
                    ? layer.style
                    : selectFillPaint(fillPaints, layer.name_en)
                }
                borderPaint={borderPaint}
              />
            );
          }

          if (layer.layer_type === 'admin') {
            return (
              <VectorTileLayer
                key={`${layer.id}-${layer.feature_id}`}
                maploaded={isMapLoaded}
                visibleOnMap={layer.checked}
                map={map}
                hasFill
                hasBorder
                sourceId={`layer-${layer.layer}`}
                url={`${apiURL}/map/nepal/{z}/{x}/{y}/?type=${layer.layer}`}
                fillPaint={{
                  'fill-opacity': 0,
                  'fill-width': 2,
                  'fill-color': '#F5F5F5',
                }}
                borderPaint={{
                  'line-opacity': 1,
                  'line-color': '#5A5A5A',
                  'line-width': 1,
                }}
              />
            );
          }

          if (layer.layer_type === 'wms') {
            return (
              <WMSImageServerLayer
                key={`${layer.id}-${layer.layer}`}
                sourceId={`layer-${layer.id}-${layer.layer}`}
                ismapLoaded={isMapLoaded}
                visibleOnMap={layer.checked}
                map={map}
                wmsUrl={layer.url}
              />
            );
          }

          if (layer.layer_type === 'raster') {
            return (
              <WMSLayer
                key={`${layer.id}-${layer.layer}`}
                sourceId={`layer-${layer.id}-${layer.layer}`}
                ismapLoaded={isMapLoaded}
                visibleOnMap={layer.checked}
                map={map}
                wmsUrl={
                  layer.layer === 109
                    ? sliderDataList[sliderIndex]?.url
                    : rasterLayerUrl
                }
              />
            );
          }

          if (
            layer.layer_type === 'land' &&
            islandSlideValuesSuccess &&
            !islandSlideValuesLoading
          ) {
            return (
              <CustomVectorLayer
                id="land-slide-data"
                geojson={landslideData as unknown as GeojsonType}
                layerOptions={LandStyle}
                visibleOnMap={layer.checked}
              />
            );
          }

          if (
            layer.layer_type === 'impact' &&
            impactData &&
            !isImpactValuesLoading &&
            isImpactValuesSuccess
          ) {
            return (
              <CustomVectorLayer
                key={layer.id}
                id="impact-data"
                geojson={impactData as unknown as GeojsonType}
                layerOptions={Impact}
                visibleOnMap={layer.checked}
              />
            );
          }

          // if (
          //   layer.layer_type === 'openweather' &&
          //   layer.name_en === 'Current Precipitation' &&
          //   layer.type === 'precipitation' &&
          //   !errorFetchingForecastData &&
          //   !isOpenweatherCurrentLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="openweather-current-precipitation"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: openWeatherForecastData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="precipitation"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'openweather' &&
          //   layer.name_en === 'Forecast Temperature' &&
          //   layer.type === 'temperature' &&
          //   !isOpenweatherForecastLoading &&
          //   isForecastObservationDataSuccess
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="openweather-forecast-temperature"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: forecastObservationData,
          //         } as GeojsonType
          //       }
          //       layerOptions={weatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="temperature"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'openweather' &&
          //   layer.name_en === 'Forecast Precipitation' &&
          //   layer.type === 'precipitation' &&
          //   !isOpenweatherForecastLoading &&
          //   isForecastObservationDataSuccess
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="openweather-forecast-precipitation"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: forecastObservationData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="precipitation"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'weatherapi' &&
          //   layer.name_en === 'Forecast Temperature' &&
          //   layer.type === 'temperature' &&
          //   isWeatherapiForecastSuccess &&
          //   !isWeatherapiForecastLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="weatherapi-forecast-temperature"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: weatherapiForecastData,
          //         } as GeojsonType
          //       }
          //       layerOptions={weatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="temperature"
          //     />
          //   );
          // }
          // if (
          //   layer.layer_type === 'weatherapi' &&
          //   layer.name_en === 'Forecast Precipitation' &&
          //   layer.type === 'precipitation' &&
          //   isWeatherapiForecastSuccess &&
          //   !isWeatherapiForecastLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="weatherapi-forecast-precipitation"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: weatherapiForecastData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="precipitation"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'dhm' &&
          //   layer.name_en === 'River watch' &&
          //   layer.type === 'precipitation' &&
          //   dhmRiverSuccess &&
          //   !isDhmRiverLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="dhm-river-watch"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: dhmRiverData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="waterLevel"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'dhm' &&
          //   layer.name_en === 'Rainfall watch' &&
          //   layer.type === 'precipitation' &&
          //   dhmRainSuccess &&
          //   !isDhmRainLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="dhm-rain-watch"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: dhmRainData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="rainValue"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'hiwat' &&
          //   layer.name_en === 'Temperature' &&
          //   layer.type === 'temperature' &&
          //   hiwatSuccess &&
          //   !isHiwatLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="hiwat-temperature"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: hiwatData,
          //         } as GeojsonType
          //       }
          //       layerOptions={weatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="temperature"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'hiwat' &&
          //   layer.name_en === 'Precipitation' &&
          //   layer.type === 'precipitation' &&
          //   hiwatSuccess &&
          //   !isHiwatLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="hiwat-precipitation"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: hiwatData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="precipitation"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'windy' &&
          //   layer.name_en === 'Forecast Temperature' &&
          //   layer.type === 'temperature' &&
          //   windyForecastSuccess &&
          //   !isWindyForecastLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="windy-forecast-temperature"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: windyForecastData,
          //         } as GeojsonType
          //       }
          //       layerOptions={weatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="temperature"
          //     />
          //   );
          // }

          // if (
          //   layer.layer_type === 'windy' &&
          //   layer.name_en === 'Forecast Precipitation' &&
          //   layer.type === 'precipitation' &&
          //   windyForecastSuccess &&
          //   !isWindyForecastLoading
          // ) {
          //   return (
          //     <CustomVectorLayer
          //       id="windy-forecast-precipitation"
          //       geojson={
          //         {
          //           type: 'FeatureCollection',
          //           features: windyForecastData,
          //         } as GeojsonType
          //       }
          //       layerOptions={precipitationWeatherStyle}
          //       visibleOnMap={layer.checked}
          //       textField="precipitation"
          //     />
          //   );
          // }
          return null;
        })}

        {/* For sublayers */}
        {subLayerList
          ?.filter(lyrx => lyrx.checked)
          ?.map(lyr => {
            // For Current and openWeather
            if (
              lyr.subcategory === 'Current Layer' &&
              lyr.layer_type === 'openweather' &&
              lyr.name_en === 'Openweather' &&
              lyr.type === 'temperature' &&
              !errorFetchingForecastData &&
              !isOpenweatherCurrentLoading
            ) {
              return (
                <CustomVectorLayer
                  id="openweather-current-temperature"
                  geojson={
                    {
                      type: 'FeatureCollection',
                      features: openWeatherForecastData,
                    } as GeojsonType
                  }
                  layerOptions={weatherStyle}
                  visibleOnMap={lyr.checked}
                  textField="temperature"
                />
              );
            }

            if (
              lyr.subcategory === 'Current Layer' &&
              lyr.type === 'precipitation' &&
              lyr.layer_type === 'openweather' &&
              lyr.name_en === 'Openweather' &&
              !errorFetchingForecastData &&
              !isOpenweatherCurrentLoading
            ) {
              return (
                <CustomVectorLayer
                  id="openweather-current-precipitation"
                  geojson={
                    {
                      type: 'FeatureCollection',
                      features: openWeatherForecastData,
                    } as GeojsonType
                  }
                  layerOptions={precipitationWeatherStyle}
                  visibleOnMap={lyr.checked}
                  textField="precipitation"
                />
              );
            }

            if (
              lyr.subcategory === 'Current Layer' &&
              lyr.type === 'precipitation' &&
              lyr.layer_type === 'dhm-rainfall-watch' &&
              lyr.name_en === 'DHM Rainfall Watch' &&
              dhmRainSuccess &&
              !isDhmRainLoading
            ) {
              return (
                <CustomVectorLayer
                  id="current-dhm-rain-watch"
                  geojson={
                    {
                      type: 'FeatureCollection',
                      features: dhmRainData,
                    } as GeojsonType
                  }
                  layerOptions={precipitationWeatherStyle}
                  visibleOnMap={lyr.checked}
                  textField="rainValue"
                />
              );
            }

            if (
              lyr.subcategory === 'Current Layer' &&
              lyr.type === 'precipitation' &&
              lyr.name_en === 'DHM River Watch' &&
              lyr.layer_type === 'dhm-river-watch' &&
              dhmRiverSuccess &&
              !isDhmRiverLoading
            ) {
              return (
                <CustomVectorLayer
                  id="current-dhm-river-watch"
                  geojson={
                    {
                      type: 'FeatureCollection',
                      features: dhmRiverData,
                    } as GeojsonType
                  }
                  layerOptions={precipitationWeatherStyle}
                  visibleOnMap={lyr.checked}
                  textField="waterLevel"
                />
              );
            }

            if (
              lyr.subcategory === 'Current Layer' &&
              lyr.type === 'temperature' &&
              lyr.name_en === 'Weatherapi' &&
              lyr.layer_type === 'weatherapi' &&
              isWeatherapiCurrentSuccess &&
              !isWeatherapiCurrentLoading
            ) {
              return (
                <CustomVectorLayer
                  id="current-temperature-weatherapi"
                  geojson={
                    {
                      type: 'FeatureCollection',
                      features: weatherapiCurrentData,
                    } as GeojsonType
                  }
                  layerOptions={weatherStyle}
                  visibleOnMap={lyr.checked}
                  textField="temperature"
                />
              );
            }

            // For Forecast and hiwat
            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'temperature' &&
              lyr.layer_type === 'hiwat' &&
              lyr.name_en === 'HIWAT' &&
              hiwatSuccess &&
              !isHiwatLoading
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}-${lyr.feature_id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-temperature-hiwat"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color': getChoropethForForecastTemperatureHiwat(
                      hiwatData || [],
                    ),
                  }}
                  // fillPaint={weatherTileStyle}
                  borderPaint={defaultBorderPaint}
                  geometryType="Polygon"
                />
              );
            }

            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'precipitation' &&
              lyr.layer_type === 'hiwat' &&
              lyr.name_en === 'HIWAT' &&
              hiwatSuccess &&
              !isHiwatLoading
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}-${lyr.feature_id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-precipitation-hiwat"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color': getChoropethForForecastPrecipitationHiwat(
                      hiwatData || [],
                    ),
                  }}
                  borderPaint={defaultBorderPaint}
                  geometryType="Polygon"
                />
              );
            }

            // // For Forecast and DHM
            // if (
            //   lyr.subcategory === 'Forecast Layer' &&
            //   lyr.type === 'precipitation' &&
            //   lyr.layer_type === 'dhm' &&
            //   lyr.name_en === 'DHM' &&
            //   dhmRiverSuccess &&
            //   !isDhmRiverLoading
            // ) {
            //   return (
            //     <VectorTileLayer
            //       key={`${lyr.id}-${lyr.feature_id}`}
            //       maploaded={isMapLoaded}
            //       visibleOnMap={lyr.checked && isChloropethDataSuccess}
            //       map={map}
            //       hasFill
            //       hasBorder
            //       // sourceId={`layer-${lyr.id}-${lyr.name_en}-${lyr.layer_type}-${lyr.type}-${lyr.subcategory}`}
            //       sourceId="forecast-precipitation-dhm"
            //       url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
            //       fillPaint={{
            //         'fill-color':
            //           getChoropethForForecastPrecipitationDHM(dhmRiverData),
            //       }}
            //       borderPaint={{
            //         'line-opacity': 1,
            //         'line-color': '#f2f2f2',
            //         'line-width': 1,
            //       }}
            //       geometryType="Polygon"
            //     />
            //   );
            // }

            // if (
            //   lyr.subcategory === 'Forecast Layer' &&
            //   lyr.layer_type === 'dhm' &&
            //   lyr.name_en === 'DHM' &&
            //   lyr.type === 'temperature' &&
            //   dhmRainSuccess &&
            //   !isDhmRainLoading
            // ) {
            //   return (
            //     <VectorTileLayer
            //       key={`${lyr.id}-${lyr.feature_id}`}
            //       maploaded={isMapLoaded}
            //       visibleOnMap={lyr.checked && isChloropethDataSuccess}
            //       map={map}
            //       hasFill
            //       hasBorder
            //       // sourceId={`layer-${lyr.id}-${lyr.name_en}-${lyr.layer_type}-${lyr.type}-${lyr.subcategory}`}
            //       sourceId="forecast-temperature-dhm"
            //       url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
            //       fillPaint={{
            //         'fill-color':
            //           getChoropethForForecastTemperatureDHM(dhmRainData),
            //       }}
            //       borderPaint={{
            //         'line-opacity': 1,
            //         'line-color': '#f2f2f2',
            //         'line-width': 1,
            //       }}
            //       geometryType="Polygon"
            //     />
            //   );
            // }

            // For Forecast and weatherapi
            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'temperature' &&
              lyr.layer_type === 'weatherapi' &&
              lyr.name_en === 'Weatherapi' &&
              isWeatherapiForecastSuccess &&
              !isWeatherapiForecastLoading
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-temperature-weatherapi"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color': getChoropethForForecastTemperatureWeatherApi(
                      weatherapiForecastData || [],
                    ),
                  }}
                  borderPaint={defaultBorderPaint}
                  geometryType="Polygon"
                />
              );
            }

            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'precipitation' &&
              lyr.layer_type === 'weatherapi' &&
              lyr.name_en === 'Weatherapi' &&
              isWeatherapiForecastSuccess &&
              !isWeatherapiForecastLoading
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-precipitation-weatherapi"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color':
                      getChoropethForForecastPrecipitationWeatherApi(
                        weatherapiForecastData || [],
                      ),
                  }}
                  borderPaint={{
                    'line-opacity': 1,
                    'line-color': '#f2f2f2',
                    'line-width': 1,
                  }}
                  geometryType="Polygon"
                />
              );
            }

            // For Forecast and openWeather
            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'temperature' &&
              lyr.layer_type === 'openweather' &&
              lyr.name_en === 'Openweather' &&
              !isOpenweatherForecastLoading &&
              isForecastObservationDataSuccess
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}-${lyr.feature_id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasBorder
                  hasFill
                  sourceId="forecast-temperature-openweather"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  borderPaint={defaultBorderPaint}
                  fillPaint={{
                    'fill-color':
                      getChoropethForForecastTemperatureOpenweather(
                        chloropethData,
                      ),
                    'fill-opacity': 1,
                  }}
                  geometryType="Polygon"
                />
              );
            }

            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'precipitation' &&
              lyr.layer_type === 'openweather' &&
              lyr.name_en === 'Openweather' &&
              !isOpenweatherForecastLoading &&
              isForecastObservationDataSuccess
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}-${lyr.feature_id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-precipitation-openweather"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color':
                      getChoropethForForecastPrecipitationOpenweather(
                        forecastObservationData || [],
                      ),
                  }}
                  borderPaint={defaultBorderPaint}
                  geometryType="Polygon"
                />
              );
            }

            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'temperature' &&
              lyr.layer_type === 'windy' &&
              lyr.name_en === 'Windy' &&
              windyForecastSuccess &&
              !isWindyForecastLoading
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}-${lyr.feature_id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-temperature-windy"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color': getChoropethForForecastTemperatureWindy(
                      windyForecastData || [],
                    ),
                  }}
                  borderPaint={defaultBorderPaint}
                  geometryType="Polygon"
                />
              );
            }

            if (
              lyr.subcategory === 'Forecast Layer' &&
              lyr.type === 'precipitation' &&
              lyr.layer_type === 'windy' &&
              lyr.name_en === 'Windy' &&
              windyForecastSuccess &&
              !isWindyForecastLoading
            ) {
              return (
                <VectorTileLayer
                  key={`${lyr.id}-${lyr.feature_id}`}
                  maploaded={isMapLoaded}
                  visibleOnMap={lyr.checked && isChloropethDataSuccess}
                  map={map}
                  hasFill
                  hasBorder
                  sourceId="forecast-precipitation-windy"
                  url={`${heatWaveColdWaveApiUrl}/nepal/{z}/{x}/{y}/`}
                  fillPaint={{
                    'fill-color': getChoropethForForecastPrecipitationWindy(
                      windyForecastData || [],
                    ),
                  }}
                  borderPaint={defaultBorderPaint}
                  geometryType="Polygon"
                />
              );
            }

            // return (
            //   <VectorTileLayer
            //     key={lyr.id}
            //     map={map}
            //     maploaded={isMapLoaded}
            //     visibleOnMap={
            //       lyr.checked && choroplethRanges.find(itm => itm.id === lyr.id)
            //     }
            //     hasFill
            //     hasBorder={false}
            //     sourceId={`layer-${lyr.name_en}`}
            //     url={`${apiURL}/map/info-tile/{z}/{x}/{y}/?feature_id=${
            //       lyr._layer_id
            //     }&info_layer=${lyr.id}&info_type=${
            //       lyr.layer_type === 'raster' ? 'max' : 'count'
            //     }`}
            //     fillPaint={{
            //       'fill-color': getChoroPlethRange(
            //         choroplethRanges.find(range => range.id === lyr.id) || {},
            //         { r: 10, g: 50, b: 50 },
            //       ),
            //       'fill-outline-color': '#fff',
            //     }}
            //     borderPaint={defaultBorderPaint}
            //     hasLabel
            //   />
            // );
            return null;
          })}
        {/* For Observation popup */}
        {/* <AsyncPopup
          layer="popup"
          // hasMoreData
          getProperties={props => setPopupMunicipality({ id: props })}
          // onSeeMoreClick={(municipalId: any) => {
          //   setPopupMunicipality({ id: municipalId });
          // }}
          fetchPopupData={data =>
            data?.layer.includes('openweather-current')
              ? setMunicipalFeature(data)
              : setForecastMunicipalFeature(data)
          }
          // eslint-disable-next-line react/no-unstable-nested-components
          popupUI={properties => {
            // if (properties.layer.includes('openweather-current')) {
            //   return <PopupUI data={{ ...properties, municipal: popUpData }} />;
            // }
            // if (
            //   properties.layer.includes('dhm') ||
            //   properties.layer.includes('hiwat')
            // ) {
            //   return <CustomPopupUI data={properties} />;
            // }

            return (
              <ForecastPopup
                data={{
                  ...properties,
                  weather: getForecastWeatherData(properties?.layer),
                }}
              />
            );
          }}
          isLoading={
            isLoading ||
            isLoadingOpenWeatherForecastForMunicipalData ||
            isLoadingWeatherapiForecastForMunicipalData ||
            isLoadingWindyForecastForMunicipalData
          }
        /> */}
        <TileLayerClick map={map} />
        <Legend />
        <SubLayerLegend />
        {/* mapping layers according to the layer type */}
        {isInfoOn && <MapInfoDialog />}
        {selectedLayers.some(layer => layer.name_en === 'Sub-Watersheds') && (
          <MunicipalFilter
            value={selectedMunicipality}
            onChange={(value: number) => setSelectedMunicipality(value)}
            handleReset={() => setSelectedMunicipality(null)}
          />
        )}
        {/* {popupMunicipality && (
          <MunicipalWeatherData popupMunicipality={popupMunicipality} />
        )} */}
        <MapAlertLogs />
        {selectedLayers.some(
          layer =>
            layer.name_en === 'LandSlide Point' ||
            layer.name_en === 'Impact Point',
        ) && (
          <div className="absolute left-[24rem] top-[1.25rem]  z-30">
            <DateToolBar
              islandSlideValuesSuccess={islandSlideValuesSuccess}
              isImpactValuesSuccess={isImpactValuesSuccess}
              islandSlideValuesLoading={islandSlideValuesLoading}
              isImpactValuesLoading={isImpactValuesLoading}
            />
          </div>
        )}

        <Loader sourceId="areTIle" />
      </MapContainer>
    </mapContext.Provider>
  );
}

export default hasErrorBoundary(MapSection);
