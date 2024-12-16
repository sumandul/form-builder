/* eslint-disable array-callback-return */
import Icon from '@Components/common/Icon';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import { setMapState } from '@Store/actions/mapActions';
import { Map } from 'maplibre-gl';
import Tooltip from '@Components/common/ToolTip';

export default function MapControls({ map }: { map: Map | null }) {
  const dispatch = useTypedDispatch();
  const isFullScreenOn = useTypedSelector(state => state.mapSlice.isFullScreen);
  const isPopUpOn = useTypedSelector(state => state.mapSlice.isInfoOn);
  const mapControlOptions: Record<string, any>[] = [
    {
      id: 1,
      name: 'add',
      onClick: () => {
        map?.zoomIn();
      },
      tooltipmessage: 'Zoom In',
    },
    {
      id: 2,
      name: 'remove',
      onClick: () => {
        map?.zoomOut();
      },
      tooltipmessage: 'Zoom Out',
    },
    {
      id: 3,
      name: 'open_in_full',
      onClick: () => {
        dispatch(setMapState({ isFullScreen: !isFullScreenOn }));
      },
      tooltipmessage: 'Open in Full Screen',
    },
    {
      id: 4,
      name: 'terrain',
      onClick: () => {
        const isTerrain = map?.getTerrain();
        if (isTerrain) {
          // @ts-ignore
          map?.setTerrain();
          return;
        }
        map?.setTerrain({ source: 'terrainSource', exaggeration: 0.6 });
      },
      tooltipmessage: 'Toogle Terrain',
    },
  ];
  return (
    <div
      className={`${
        isPopUpOn ? 'right-[20rem]' : 'right-4'
      } absolute bottom-[9.7rem] z-10 bg-transparent `}
    >
      <div className="flex flex-col gap-1">
        {mapControlOptions.map((control: Record<string, any>) => {
          return (
            <Tooltip
              key={control.id}
              content={control.tooltipmessage}
              direction="left"
            >
              <Icon
                name={control.name}
                onClick={control.onClick}
                className="rounded-lg bg-white p-1.5 text-grey-900"
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
