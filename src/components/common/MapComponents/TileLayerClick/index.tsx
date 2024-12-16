// This Component Handles Mouse Click On Vector Tile Layers And Dispatches Required Actions
import { Map, MapMouseEvent } from 'maplibre-gl';
import { useEffect } from 'react';
import { useTypedDispatch } from '@Store/hooks';
import { setFeatureInfo, setMapState } from '@Store/actions/mapActions';
// import { exceptionLayers } from '@Components/common/MapLibreComponents/AsyncPopup';

interface ITileLayerProps {
  map: Map | null;
}

export default function TileLayerClick({ map }: ITileLayerProps) {
  const dispatch = useTypedDispatch();
  useEffect(() => {
    if (!map) return;

    function handleOnClick(e: MapMouseEvent): void {
      const features = map?.queryRenderedFeatures(e.point);

      const clickedFeature = features?.[0];
      // Check if the layer needs info dialog
      const isLayerWithNoInfoDialogException = !!(
        (
          !clickedFeature ||
          clickedFeature.source === 'layer-forecast-observation'
        )
        // ||
        // exceptionLayers.includes(String(clickedFeature?.layer.id))
      );

      if (isLayerWithNoInfoDialogException) return;

      // For Layer info dialog
      dispatch(setMapState({ isInfoOn: true }));
      dispatch(
        setFeatureInfo({
          layerId: clickedFeature.properties.feature_id,
          featureId: clickedFeature.properties.id,
          feature: clickedFeature,
        }),
      );
    }

    map.on('click', handleOnClick);
  }, [dispatch, map]);

  return null;
}
