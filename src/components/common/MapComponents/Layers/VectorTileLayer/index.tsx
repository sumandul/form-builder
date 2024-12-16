/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useEffect } from 'react';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import { setClientId } from '@Store/actions/mapActions';

export type MapControlLocation =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

interface Controls {
  navigation?: boolean;
  geoLocate?: boolean;
  scale?: boolean;
  fullScreen?: boolean;
  terrain?: boolean;
}

export interface IUseMapLibreMapProps {
  options: Record<string, any>;
  controls: Controls;
  controlLocation: MapControlLocation;
}

interface IVectorTileLayerProps extends Partial<IUseMapLibreMapProps> {
  sourceId: string;
  source?: Record<string, any>;
  map?: any;
  maploaded: boolean;
  hasBorder: boolean;
  hasFill?: boolean;
  hasImageFill?: boolean;
  sourceLayer?: string;
  borderPaint?: Record<string, any>;
  fillPaint: Record<string, any>;
  fillImageSrc?: string;
  fillImageId?: string;
  visibleOnMap?: boolean;
  icon?: string;
  geometryType?: string;
  url: string;
  hasLabel?: boolean;
}

export default function VectorTileLayer({
  sourceId,
  map,
  maploaded,
  hasBorder,
  hasFill,
  hasImageFill,
  sourceLayer,
  borderPaint,
  fillPaint,
  visibleOnMap = true,
  icon,
  geometryType,
  url,
  hasLabel,
}: IVectorTileLayerProps) {
  // const [clickStateId, setClickStateId] = useState(null);
  const clickStateId = useTypedSelector(state => state.mapSlice.clickedId);
  // console.log(clickStateIds, 'clickStateIds');
  // console.log(clickStateIds, 'clickStateIds');
  const dispatch = useTypedDispatch();
  useEffect(() => {
    if (!maploaded || !visibleOnMap) return () => {};
    // setClickStateId(clickStateIds);

    // let clickStateId: string | null = null;

    if (!maploaded) return;

    map.addSource(sourceId, {
      type: 'vector',
      minzoom: 1,
      maxzoom: 25,
      tiles: [url],
      // ...source,
    });

    if (hasFill) {
      if (!clickStateId) {
        map.addLayer({
          id: `${sourceId}-fill`,
          type: 'fill',
          source: sourceId,
          'source-layer': sourceLayer || 'default',
          paint: {
            ...fillPaint,
          },
        });
      } else {
        map.addLayer({
          id: `${sourceId}-fill`,
          type: 'fill',
          source: sourceId,
          'source-layer': sourceLayer || 'default',
          paint: {
            'fill-color': [
              'match',
              ['get', 'id'],
              clickStateId,
              '#BADFFF',
              '#000000',
            ],
            'fill-opacity': ['match', ['get', 'id'], clickStateId, 1, 0],
          },
        });
      }
    }

    if (hasBorder) {
      // To add line after any other layer
      setTimeout(() => {
        map.addLayer({
          id: `${sourceId}-border`,
          type: 'line',
          source: sourceId,
          'source-layer': sourceLayer || 'default',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            ...borderPaint,
          },
        });
      });
    }

    if (hasImageFill) {
      map.addLayer({
        id: `${sourceId}-image-fill-layer`,
        type: 'fill',
        source: sourceId,
        'source-layer': sourceLayer || 'default',
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-color': '#000000',
          'fill-pattern': 'pedestrian_polygon',
        },
      });
    }

    if (hasLabel) {
      map.addLayer({
        id: `${sourceId}-label-layer`,
        type: 'symbol',
        source: sourceId,
        'source-layer': sourceLayer || 'default',
        layout: {
          'text-font': ['Noto Sans Regular'],
          'text-field': ['get', 'value'],
          'text-size': 12,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#000000',
        },
      });
    }

    if (icon) {
      const urlArray = icon.split(':');
      const newUrl = `https:${urlArray[1]}`;
      map.loadImage(newUrl, (error: any, image: File) => {
        if (error) throw error;
        map.addImage(sourceId, image);
      });
      map.addLayer({
        id: `${sourceId}-icon`,
        type: 'symbol',
        source: sourceId,
        'source-layer': sourceLayer || 'default',

        layout: {
          'icon-image': sourceId,
          'icon-size': 0.055,
          'icon-allow-overlap': true,
        },
      });
    }
    if (!icon && geometryType === 'Point') {
      map.addLayer({
        id: `${sourceId}-point`,
        type: 'circle',
        source: sourceId,
        'source-layer': sourceLayer || 'default',
        paint: {
          ...fillPaint,
        },
      });
    }

    if (
      (!icon && geometryType === 'Line') ||
      (!icon && geometryType === 'LineString')
    ) {
      map.addLayer({
        id: `${sourceId}-line`,
        type: 'line',
        source: sourceId,
        'source-layer': sourceLayer || 'default',
        paint: {
          ...fillPaint,
        },
      });
    }

    if (!icon && geometryType === 'Polygon') {
      map.addLayer({
        id: `${sourceId}-polygon`,
        type: 'fill',
        source: sourceId,
        'source-layer': sourceLayer || 'default',
        paint: {
          ...fillPaint,
        },
      });
    }

    const onMouseOver = (e: any) => {
      if (!map) return;

      map.getCanvas().style.cursor = 'pointer';
      map.setPaintProperty(`${sourceId}-fill`, 'fill-color', [
        'match',
        ['get', 'id'],
        clickStateId ?? 1,
        '#BADFFF',
        map.queryRenderedFeatures(e.point)[0].properties.id,
        '#BADFFF',
        '#ffffff00',
      ]);
    };

    const onMouseLeave = () => {
      if (!map) return;
      map.getCanvas().style.cursor = '';

      map.setPaintProperty(`${sourceId}-fill`, 'fill-color', [
        'match',
        ['get', 'id'],
        clickStateId ?? 1,
        '#BADFFF',
        '#ffffff00',
      ]);
    };

    const onMouseClick = (e: any) => {
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point);
      if (!features.length) return; // Guard against no features found
      const clickedId = features[0].properties.municipality_code;
      dispatch(setClientId(features[0].properties.municipality_code)); // Use the feature's ID directly

      // setClickStateId(clickedId); // Update state for future renders

      if (!map.getLayer(`${sourceId}-border-clicked`)) {
        map.addLayer({
          id: `${sourceId}-border-clicked`,
          type: 'line',
          source: sourceId,
          'source-layer': sourceLayer || 'default',
          paint: {
            'line-color': '#000000',
            'line-width': 2, // Adjust border width as needed
          },
          filter: ['==', ['get', 'municipality_code'], clickedId], // Apply only to the clicked feature
        });
      } else {
        // Update the filter to apply border to the current clicked feature only
        map.setFilter(`${sourceId}-border-clicked`, [
          '==',
          ['get', 'municipality_code'],
          clickedId,
        ]);
      }
    };

    if (hasFill && !clickStateId) {
      map.on('mousemove', `${sourceId}-fill`, () => {
        if (!map) return;
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', `${sourceId}-fill`, () => {
        if (!map) return;
        map.getCanvas().style.cursor = '';
      });
    }

    // Polygon

    map.on('mousemove', `${sourceId}-polygon`, onMouseOver);
    map.on('mouseleave', `${sourceId}-polygon`, onMouseLeave);
    map.on('mousedown', `${sourceId}-polygon`, onMouseClick);

    // LineString
    map.on('mouseleave', `${sourceId}-line`, onMouseLeave);
    map.on('mousedown', `${sourceId}-line`, onMouseClick);

    // Point
    map.on('mouseover', `${sourceId}-point`, onMouseOver);
    map.on('mouseleave', `${sourceId}-point`, onMouseLeave);
    map.on('mousedown', `${sourceId}-point`, onMouseClick);

    return () => {
      if (map.getLayer(sourceId)) {
        map.removeLayer(sourceId);
      }

      if (map.getLayer(`${sourceId}-line`)) {
        map.removeLayer(`${sourceId}-line`);
      }

      if (map.getLayer(`${sourceId}-fill`)) {
        map.removeLayer(`${sourceId}-fill`);
      }

      if (map.getLayer(`${sourceId}-image-fill-layer`)) {
        map.removeLayer(`${sourceId}-image-fill-layer`);
      }

      if (map.getLayer(`${sourceId}-border`)) {
        map.removeLayer(`${sourceId}-border`);
      }

      if (map.getLayer(`${sourceId}-icon`)) {
        map.removeLayer(`${sourceId}-icon`);
      }

      if (map.getLayer(`${sourceId}-point`)) {
        map.removeLayer(`${sourceId}-point`);
      }

      if (map.getLayer(`${sourceId}-polygon`)) {
        map.removeLayer(`${sourceId}-polygon`);
      }
      if (map.getLayer(`${sourceId}-border-clicked`)) {
        map.removeLayer(`${sourceId}-border-clicked`);
      }

      if (map.getLayer(`${sourceId}-label-layer`)) {
        map.removeLayer(`${sourceId}-label-layer`);
      }

      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      map.off('mouseover', `${sourceId}-polygon`, onMouseOver);
      map.off('mouseleave', `${sourceId}-polygon`, onMouseLeave);
      map.off('mouseover', `${sourceId}-line`, onMouseOver);
      map.off('mouseleave', `${sourceId}-line`, onMouseLeave);
      map.off('mouseover', `${sourceId}-point`, onMouseOver);
      map.off('mouseleave', `${sourceId}-point`, onMouseLeave);
    };
  }, [maploaded, url, visibleOnMap, sourceId]);

  useEffect(() => {
    if (!map || !clickStateId) return;

    const borderLayerId = `${sourceId}-border-clicked`;

    if (!map.getLayer(borderLayerId)) {
      // Add the border layer if it doesn't exist
      map.addLayer({
        id: borderLayerId,
        type: 'line',
        source: sourceId,
        'source-layer': sourceLayer || 'default',
        paint: {
          'line-color': '#000000', // Default color
          'line-width': 4, // Adjust as needed
        },
        filter: ['==', ['get', 'municipality_code'], clickStateId], // Apply only to clicked feature
      });
    } else {
      // Update the filter to apply border to the current clicked feature only
      map.setFilter(borderLayerId, [
        '==',
        ['get', 'municipality_code'],
        clickStateId,
      ]);

      // Update the border color
      map.setPaintProperty(borderLayerId, 'line-color', '#000000'); // Active border color (red in this case)
    }

    return () => {
      if (map.getLayer(borderLayerId)) {
        map.removeLayer(borderLayerId);
      }
    };
  }, [clickStateId, map, sourceId, sourceLayer, visibleOnMap]);

  return null;
}
