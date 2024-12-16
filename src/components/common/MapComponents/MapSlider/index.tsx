/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useTypedSelector } from '@Store/hooks';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Draggable from 'react-draggable';

export default function MapSlider({
  sliderData = [],
  onChange,
  hourTimeline = false,
  hourCount = 24,
}: {
  sliderData?: Record<string, any>[];
  onChange?: (url: string) => any;
  hourTimeline?: boolean;
  hourCount?: number;
}) {
  const isMapSiderBarOn = useTypedSelector(
    state => state.mapSlice.isMapSideBarOn,
  );

  function getSliderMarks(): Record<string, any> {
    if (sliderData.length && !hourTimeline) {
      const tickData = sliderData.reduce((acc, item) => {
        acc[Object.keys(acc).length] = item.published_date;
        return acc;
      }, {});
      return tickData;
    }
    if (hourTimeline) {
      const ticks: Record<string, any> = {};
      let count = 0;
      Array.from({ length: hourCount }).forEach((_item, index) => {
        if (count > 24) return;
        ticks[index] = count;
        count += 3;
      });
      return ticks;
    }
    return {};
  }

  const legendItems = useTypedSelector(state => state.mapSlice.legendItems);

  return (
    <Draggable>
      <div
        className={`${
          isMapSiderBarOn ? 'w-[50%]' : 'w-[55%]'
        } absolute bottom-8 right-[22.25rem] z-[1000] overflow-hidden rounded-lg bg-grey-100 shadow-xl`}
      >
        <div className="flex flex-col gap-1 rounded-[12px] px-6 pb-8 pt-2 shadow-xl">
          <p className="text-base">
            {!hourTimeline
              ? legendItems[legendItems.length - 1]?.name_en
              : 'Hours'}
          </p>

          {hourTimeline ? (
            <Slider
              onChangeComplete={(v: number | number[]) => {
                if (onChange)
                  onChange(
                    Array.isArray(v)
                      ? getSliderMarks()?.[v[0]].toString()
                      : getSliderMarks()?.[v],
                  );
              }}
              min={1}
              max={Object.keys(getSliderMarks()).length - 1}
              defaultValue={1}
              step={1}
              marks={getSliderMarks()}
              styles={{
                track: { height: 5 },
                rail: { height: 5 },
                handle: {
                  borderColor: 'gray',
                  height: 15,
                  width: 15,
                  marginTop: -5,
                  backgroundColor: 'white',
                },
                tracks: { width: 12 },
              }}
              dotStyle={{
                height: 10,
                width: 10,
              }}
            />
          ) : sliderData.length > 1 ? (
            <Slider
              onChangeComplete={(v: number | number[]) => {
                if (onChange)
                  onChange(
                    Array.isArray(v)
                      ? sliderData[v[0]]?.url
                      : sliderData[v]?.url,
                  );
              }}
              min={0}
              max={sliderData.length - 1}
              defaultValue={0}
              step={1}
              marks={getSliderMarks()}
              styles={{
                track: { height: 5 },
                rail: { height: 5 },
                handle: {
                  borderColor: 'gray',
                  height: 15,
                  width: 15,
                  marginTop: -5,
                  backgroundColor: 'white',
                },
                tracks: { width: 12 },
              }}
              dotStyle={{
                height: 10,
                width: 10,
              }}
            />
          ) : (
            <p>No timeline data.</p>
          )}
        </div>
      </div>
    </Draggable>
  );
}
