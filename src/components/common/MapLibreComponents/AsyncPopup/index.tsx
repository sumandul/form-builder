/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-danger */
import { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Popup } from 'maplibre-gl';
import type { MapMouseEvent } from 'maplibre-gl';
import Skeleton from '@Components/RadixComponents/Skeleton';
import { weatherIcons } from '@Constants/map';
import MunicipalWeatherData from '@Components/Dashboard/MapSection/MunicipalWeatherData';
import { IAsyncPopup } from '../types';

const popup = new Popup({
  closeOnClick: false,
  closeButton: false,
});

export const exceptionLayers = [
  'openweather-current-temperature',
  'openweather-current-temperature-text',
  'openweather-current-precipitation',
  'openweather-current-precipitation-text',
  'openweather-layer',
  'openweather-forecast-temperature',
  'openweather-forecast-temperature-text',
  'openweather-forecast-precipitation',
  'openweather-forecast-precipitation-text',
  'weatherapi-forecast-temperature',
  'weatherapi-forecast-temperature-text',
  'weatherapi-forecast-precipitation',
  'weatherapi-forecast-precipitation-text',
  'windy-forecast-temperature',
  'windy-forecast-temperature-text',
  'windy-forecast-precipitation',
  'windy-forecast-precipitation-text',
  'openweatherForecast-layer',
  'weatherapiForecast-layer',
  'windyForecast-layer',
  'current-dhm-river-watch',
  'current-dhm-river-watch-text',
  'current-dhm-rain-watch',
  'current-dhm-rain-watch-text',
  'hiwat-temperature',
  'hiwat-temperature-text',
  'hiwat-precipitation',
  'hiwat-precipitation-text',

  // 'forecast-temperature-hiwat-fill',
  // 'forecast-temperature-hiwat-line',
  // 'forecast-precipitation-hiwat-fill',
  // 'forecast-precipitation-dhm-fill',
  // 'forecast-precipitation-dhm-line',
  // 'forecast-temperature-dhm-fill',
  // 'forecast-temperature-dhm-line',
  // 'forecast-temperature-weatherapi-fill',
  // 'forecast-temperature-weatherapi-line',
  // 'forecast-precipitation-weatherapi-fill',
  // 'forecast-precipitation-weatherapi-line',
  // 'forecast-temperature-openweather-fill',
  // 'forecast-temperature-openweather-line',
  // 'current-temperature-openweather-text',
  // 'forecast-precipitation-openweather-fill',
  // 'forecast-precipitation-openweather-line',
  // 'forecast-temperature-windy-fill',
  // 'forecast-temperature-windy-line',
  // 'forecast-precipitation-windy-fill',
  // 'forecast-precipitation-windy-line',

  // 'current-temperature-weatherapi-text',
  // 'current-temperature-weatherapi-line',
  // 'current-temperature-weatherapi-fill',
];

export default function AsyncPopup({
  map,
  fetchPopupData,
  popupUI,
  isLoading = false,
  onClose,
  layer,
  forFill = false,
  hasMoreData = false,
  onSeeMoreClick,
  getProperties,
}: IAsyncPopup) {
  const [properties, setProperties] = useState<Record<string, any> | null>(
    null,
  );
  const popupRef = useRef(null);
  const [popupHTML, setPopupHTML] = useState<string>('');

  useEffect(() => {
    if (!map) return;
    function displayPopup(e: MapMouseEvent): void {
      if (!map) return;
      // Get the clicked coordinates
      const clickedCoordinates: maplibregl.LngLat = e.lngLat;

      // Convert the clicked coordinates to pixel coordinates
      const clickedPoint: maplibregl.Point2D = map.project(clickedCoordinates);

      // Adjust the point's y-coordinate by the offset amount (move down)
      const offsetPoint: [number, number] = [
        clickedPoint.x,
        clickedPoint.y - 200,
      ];

      // Convert the adjusted pixel coordinates back to geographical coordinates
      const offsetCoordinates: maplibregl.LngLat = map.unproject(offsetPoint);

      // Center the map on the offset coordinates
      setTimeout(() => {
        map.setCenter(offsetCoordinates);
      }, 500);

      const features = map.queryRenderedFeatures(e.point);
      const clickedFeature = features?.[0];
      if (forFill) {
        if (!clickedFeature || clickedFeature.layer.id !== `${layer}-fill`)
          return;

        setProperties({
          ...clickedFeature.properties,
          layer: clickedFeature.source,
        });

        // To uplift properties to parent component
        if (getProperties)
          getProperties({
            ...clickedFeature.properties,
            layer: clickedFeature.source,
          });

        popup.setLngLat(e.lngLat);
      } else {
        if (
          !clickedFeature ||
          (clickedFeature.layer.id !== `${layer}-layer` &&
            !exceptionLayers.includes(clickedFeature.layer.id))
        )
          return;

        setProperties({
          ...clickedFeature.properties,
          layer: clickedFeature.source,
        });

        // To uplift properties to parent component
        if (getProperties)
          getProperties({
            ...clickedFeature.properties,
            layer: clickedFeature.source,
          });

        popup.setLngLat(e.lngLat);
      }
    }
    map.on('click', displayPopup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!map || !properties) return;

    fetchPopupData?.(properties);
  }, [map, properties]); // eslint-disable-line

  useEffect(() => {
    if (!map || !properties || !popupUI || !popupRef.current) return;

    const htmlString = renderToString(popupUI(properties));
    popup.setDOMContent(popupRef.current).addTo(map);
    setPopupHTML(htmlString);
  }, [map, popupUI, properties]);

  const onPopupClose = () => {
    popup.remove();
    onClose?.();
    setProperties(null);

    // To uplift properties to parent component
    if (getProperties) getProperties(null);
  };

  const weatherIcon = weatherIcons.find(
    item => item.name === properties?.weathericon,
  )?.url;

  if (!properties) return <div />;

  const isPrecipitationData =
    properties.layer.includes('precipitation') ||
    properties.type === 'precipitation';

  // if (
  //   properties.layer === 'dhm-river-watch' ||
  //   properties.layer === 'dhm-rain-watch'
  // ) {
  //   return (
  //     <div ref={popupRef} className="w-full px-1">
  //       <h6>{properties.basin}</h6>
  //       <span
  //         role="button"
  //         tabIndex={0}
  //         className="absolute right-1 top-1 text-grey-600"
  //         onClick={onPopupClose}
  //         onKeyDown={() => {}}
  //       >
  //         <i className="material-symbols-outlined">close</i>
  //       </span>
  //       <div dangerouslySetInnerHTML={{ __html: popupHTML }} />
  //     </div>
  //   );
  // }

  // if (
  //   properties.layer === 'openweatherForecast' ||
  //   properties.layer === 'weatherapiForecast' ||
  //   properties.layer === 'windy'
  // ) {
  //   return (
  //     <div ref={popupRef} className="w-full px-1">
  //       <div className="relative flex h-[3rem] w-full  rounded-md bg-[#dcdcdc] p-2 py-2">
  //         {isLoading ? (
  //           // <Skeleton className="my-3 h-4 w-1/2 rounded-md bg-grey-100 shadow-sm" />
  //           <p>Loading...</p>
  //         ) : (
  //           <></>
  //           // <div className="btn-text text-primary-400 flex items-start justify-start gap-1">
  //           //   <div className="info flex w-full flex-col gap-2">
  //           //     <p className=" text-base">
  //           //       {properties.municipality_name}
  //           //     </p>
  //           //   </div>
  //           //   <div className="w-1/3 pr-2">
  //           //     <img
  //           //       src={
  //           //         weatherIcons.find(
  //           //           item => item.name === properties.weathericon,
  //           //         )?.url
  //           //       }
  //           //       style={{ width: '9rem' }}
  //           //       className="max-h-full w-[9rem] object-fill"
  //           //       alt="weather-icon"
  //           //     />
  //           //   </div>
  //           // </div>
  //         )}
  //         <span
  //           role="button"
  //           tabIndex={0}
  //           className="absolute right-1 top-1 text-grey-600"
  //           onClick={onPopupClose}
  //           onKeyDown={() => {}}
  //         >
  //           <i className="material-symbols-outlined">close</i>
  //         </span>
  //       </div>
  //       <div dangerouslySetInnerHTML={{ __html: popupHTML }} />
  //     </div>
  //   );
  // }

  return (
    <div ref={popupRef} className="w-full px-1">
      {!isPrecipitationData ? (
        <div className="relative flex h-[6rem] w-full  rounded-md bg-[#dcdcdc] p-2 py-2">
          {isLoading ? (
            <Skeleton className="my-3 h-4 w-1/2 rounded-md bg-grey-100 shadow-sm" />
          ) : (
            <div className="btn-text text-primary-400 flex items-start justify-between gap-1">
              <div className="info flex w-2/3 flex-col gap-2">
                <p className=" text-base">{properties.municipality_name}</p>
                <p className="text-base">
                  {properties.temperature
                    ? JSON.parse(properties.temperature)
                    : ''}
                  °C
                </p>
              </div>
              {weatherIcon && (
                <div className="w-1/3 pr-2">
                  <img
                    src={weatherIcon}
                    style={{ width: '9rem' }}
                    className="max-h-full w-[9rem] object-fill"
                    alt="weather-icon"
                  />
                </div>
              )}
            </div>
          )}
          <span
            role="button"
            tabIndex={0}
            className="absolute right-1 top-1 text-grey-600"
            onClick={onPopupClose}
            onKeyDown={() => {}}
          >
            <i className="material-symbols-outlined">close</i>
          </span>
        </div>
      ) : (
        <div className="relative flex h-[2rem] w-full justify-between  rounded-md bg-[#dcdcdc] p-2 py-2">
          <p className="w-full flex-1">Precipitation</p>

          <span
            role="button"
            tabIndex={0}
            className="absolute right-1 top-1  text-grey-600"
            onClick={onPopupClose}
            onKeyDown={() => {}}
          >
            <i className="material-symbols-outlined">close</i>
          </span>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: popupHTML }} />
      {hasMoreData ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              onSeeMoreClick(properties);
            }}
            className="mt-2 rounded-md bg-blue-900 p-2 text-white hover:bg-blue-950"
          >
            See More
          </button>
        </div>
      ) : null}
    </div>
  );
}
