/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useTypedSelector } from '@Store/hooks';
import isEmpty from '@Utils/isEmpty';
import { colorRanges, prepirationColorRanges } from '@Utils/map';
import { useState } from 'react';

function getLegendName(legendList: Record<string, any>[]) {
  const lastLegendItem = legendList[legendList.length - 1];
  if (lastLegendItem?.type === 'temperature') {
    return 'Temperature (°C)';
  }
  if (lastLegendItem?.type === 'precipitation') {
    return 'Precipitation (mm)';
  }
  return lastLegendItem?.name_en;
}

export default function Legend() {
  const [toggleLegend, setToggleLegend] = useState(true);

  const legendItems = useTypedSelector(state => state.mapSlice.legendItems);
  // const legendItems = [{ type: 'precipitation' }, { type: 'temperature' }];

  const isMapSidebarOn = useTypedSelector(
    state => state.mapSlice.isMapSideBarOn,
  );

  const temperatureLayer = legendItems.filter(
    legend => legend.type === 'temperature',
  );

  const precipitationLayer = legendItems.filter(
    legend => legend.type === 'precipitation',
  );

  return legendItems.length ? (
    <div
      className={`absolute  ${
        isMapSidebarOn ? 'left-[23rem]' : 'left-4'
      } scrollbar bottom-4 z-10 max-h-[50vh] min-w-[10rem] overflow-y-auto rounded-lg bg-white px-3`}
    >
      <div
        onClick={() => {
          setToggleLegend(!toggleLegend);
        }}
        className="sticky left-0 top-0 flex cursor-pointer items-center justify-between gap-x-3"
      >
        <div className="content flex justify-between bg-white p-4">
          <div className="">
            <h6 className="font-primary">Legend</h6>
            <p>{getLegendName(legendItems)}</p>
          </div>
          <span className="material-icons">
            {toggleLegend ? 'expand_more' : 'expand_less'}
          </span>
        </div>
      </div>
      {toggleLegend && (
        <>
          {legendItems[legendItems.length - 1]?.legend_url && (
            <div className="space-y-2">
              <div className="space-y-0">
                <img
                  src={legendItems[legendItems.length - 1]?.legend_url}
                  alt="layer legend"
                />
              </div>
            </div>
          )}

          {!isEmpty(precipitationLayer) &&
            getLegendName(legendItems) === 'Precipitation (mm)' && (
              <div className="space-y-2 py-2">
                <div className="flex items-center gap-x-2">
                  <p className="h-5 w-4" style={{ background: '#d4d4d4' }} />
                  <span>No data</span>
                </div>
                {prepirationColorRanges.map(colorItem => (
                  <div
                    key={colorItem.min}
                    className="flex items-center gap-x-2"
                  >
                    <p
                      className="h-5 w-4"
                      style={{ background: colorItem.color }}
                    />
                    <span>
                      {colorItem.min === -Infinity
                        ? '< 0'
                        : colorItem.max === Infinity
                        ? `> ${colorItem.min}`
                        : `${colorItem.min} - ${colorItem.max}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

          {!isEmpty(temperatureLayer) &&
            getLegendName(legendItems) === 'Temperature (°C)' && (
              <div className="space-y-2 py-2">
                <div className="flex items-center gap-x-2">
                  <p className="h-5 w-4" style={{ background: '#d4d4d4' }} />
                  <span>No data</span>
                </div>
                {colorRanges.map(colorItem => (
                  <div
                    key={colorItem.min}
                    className="flex items-center gap-x-2"
                  >
                    <p
                      className="h-5 w-4"
                      style={{ background: colorItem.color }}
                    />
                    <span>
                      {colorItem.min === -Infinity
                        ? '< 0'
                        : colorItem.max === Infinity
                        ? `> ${colorItem.min}`
                        : `${colorItem.min} - ${colorItem.max}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
        </>
      )}
    </div>
  ) : null;
}
