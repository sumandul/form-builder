/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { useTypedSelector } from '@Store/hooks';
import { getChoroPlethRange, getLegendObject } from '@Utils/map';

export default function SubLayerLegend() {
  const choroplethRanges = useTypedSelector(
    state => state.mapSlice.choroplethRanges,
  );

  let legendObject: Record<string, string> = {};

  if (choroplethRanges.length) {
    const colorsArray = getChoroPlethRange(
      choroplethRanges[choroplethRanges.length - 1],
      { r: 10, g: 50, b: 50 },
    );

    if (Array.isArray(colorsArray)) {
      legendObject = getLegendObject(colorsArray);
    }
  }

  if (!Object.keys(legendObject).length) return <></>;

  const objectEntries =
    choroplethRanges[choroplethRanges.length - 1].min < 0
      ? Object.entries(legendObject)
      : Object.entries(legendObject).reverse();

  return (
    <div className="absolute bottom-4 left-[23rem] z-30  h-fit w-fit overflow-y-auto rounded-lg bg-white p-2 ">
      <p className="text-sm font-semibold">Stimson Project AOI</p>
      {objectEntries.map(([key, value]) => {
        if (key !== '-Infinity')
          return (
            <div key={key} className="flex h-4 gap-2">
              {/* {key === 'undefined'  <p> &lt; 0</p>} */}
              {key !== 'undefined' && (
                <p className="line-clamp-1 w-[75%]" title={key}>
                  &gt;={key}
                </p>
              )}
              {key !== 'undefined' && (
                <div className="h-5 w-5" style={{ backgroundColor: value }} />
              )}
            </div>
          );

        return <></>;
      })}
    </div>
  );
}
