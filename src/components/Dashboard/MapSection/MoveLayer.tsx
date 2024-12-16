import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { MapInstanceType } from '@Components/common/MapComponents/Schemas';
import { useTypedSelector } from '@Store/hooks';
import { useEffect } from 'react';

interface IMoveLayerProps {
  map: MapInstanceType | null;
}

function MoveLayer({ map }: IMoveLayerProps) {
  const selectedLayerData = useTypedSelector(
    state => state.mapSlice.featureInfo.selectedLayerData,
  );

  useEffect(() => {
    if (map) {
      if (selectedLayerData?.key?.includes('current')) {
        map?.moveLayer(`${selectedLayerData.key}-text`);
        // console.log('MapInfoDialog inside current');
        // map?.moveLayer('', selectedLayerData.key);
      }
    }

    return () => {};
  }, [map, selectedLayerData]);

  return <></>;
}

export default hasErrorBoundary(MoveLayer);
