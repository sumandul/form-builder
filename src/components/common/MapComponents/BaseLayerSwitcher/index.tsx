/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from '@Components/RadixComponents/Image';
import { baseLayerList } from '@Constants/map';
import { useState } from 'react';
import image from '@Assets/images/layers/satelliteLayer.png';
import { useTypedSelector } from '@Store/hooks';

interface ISelectedLayer {
  source: string;
}

interface ILayerSwitcherProps {
  map?: any;
}

export default function BaseLayerSwitcher({ map }: ILayerSwitcherProps) {
  const isPopUpOn = useTypedSelector(state => state.mapSlice.isInfoOn);
  const [selectedLayer, setSelectedLayer] = useState('osm');
  const [showLayerList, setShowLayerList] = useState(false);
  const toggleLayers = () => {
    setShowLayerList(prev => !prev);
  };

  const handleLayerSelect = ({ source }: ISelectedLayer) => {
    map.setLayoutProperty(selectedLayer, 'visibility', 'none');
    setSelectedLayer(source);
    map.setLayoutProperty(source, 'visibility', 'visible');
    setShowLayerList(prev => !prev);
  };

  return (
    <>
      <div
        className={`${
          isPopUpOn ? 'right-[20rem]' : 'right-4'
        } absolute bottom-[7rem] z-10 h-[2.25rem] w-[2.25rem] cursor-pointer overflow-hidden rounded-lg border-2 border-white bg-white`}
        onClick={toggleLayers}
      >
        <Image
          src={image}
          alt="osm layer"
          className="h-full w-full object-cover"
        />
      </div>

      {showLayerList && (
        <div
          className={`absolute ${
            isPopUpOn ? 'right-[24rem]' : 'right-16'
          } bottom-[6.5rem] right-16 z-10 flex gap-5 rounded-lg bg-white p-3`}
        >
          {Object.entries(baseLayerList).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center gap-1"
              onClick={() => handleLayerSelect({ source: key })}
            >
              <div
                className={`h-9 w-9 cursor-pointer overflow-hidden rounded-full border-2 hover:border-primary-500 ${
                  selectedLayer === key ? 'border-primary-500' : 'border-white'
                } `}
              >
                <Image
                  src={value?.image}
                  alt="osm layer"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="body">{key}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
