/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import { ReactNode, useState, useEffect } from 'react';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import {
  setCheckedLayer,
  setMapState,
  setLayerLegend,
  setSubLayerChecked,
  setFeatureInfo,
} from '@Store/actions/mapActions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import DropdownOptions from '@Components/common/DropDownOptions';
import PortalTemplate from '@Components/Dashboard/MapSection/LayerSection/NestedAccordion/EditStyle/Portal';
// import Tooltip from '@Components/common/ToolTip';
import {
  setCheckedLayerTypeAndSliderVisible,
  setLayersWithSliders,
} from '@Store/actions/mapSliderActions';
import EditOverlay from '../EditStyle';

interface ILayerAccordionProps {
  collapsed: boolean;
  header: ReactNode;
  tooltipmessage: string;
  layers: Record<string, any>[];
  onToggle?: (data: boolean) => void;
}

const weatherLayers = ['openweather', 'weatherapi', 'windy'];
const weatherLayerType = [
  'openweather',
  'weatherapi',
  'openweather',
  'windy',
  'dhm',
  'hiwat',
];

export default function LayerAccordion({
  collapsed: isCollapsed,
  header,
  tooltipmessage,
  layers,
  onToggle = () => {},
}: ILayerAccordionProps) {
  let timeout: any;
  const dispatch = useTypedDispatch();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [editOverlay, setEditOverlay] = useState<boolean>(false);
  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);
  const [showEdit, toggleShowEdit] = useState(null);
  const [showInfo, toggleShowInfo] = useState(false);
  const [editData, setEditData] = useState({});
  const dropdownOptions = [
    {
      id: 1,
      name: 'Zoom to Layer',
      icon: <span className="material-icons h-4 text-gray-800">zoom_in</span>,
      onClick: (data: Record<string, any>) => {
        if (Array.isArray(data.bbox) && data.bbox.length === 0) {
          return null;
        }
        dispatch(setMapState({ selectedLayerBound: data.bbox }));
        return null;
      },
    },
    {
      id: 2,
      name: 'View Attribute',
      icon: <span className="material-icons h-4 text-gray-800">checklist</span>,
      onClick: () => {},
    },
  ];

  // function to handle the input change of layers
  function handleInputChange(layer: Record<string, any>, checked: any) {
    // sets checked layer
    dispatch(setCheckedLayer(`${layer.layer_type}_${layer.id}`));

    const canSetLegend =
      ((layer?.layer_type === 'wms' || layer?.layer_type === 'raster') &&
        layer?.legend_url) ||
      layer.type === 'temperature' ||
      layer.type === 'precipitation';

    if (canSetLegend) {
      const { checked: ch, ...rest } = layer;

      // For Legend
      dispatch(setLayerLegend(rest));
    }

    if (
      layer.layer_type === 'raster' ||
      weatherLayers.includes(layer.layer_type)
    )
      // if the layer_type is `raster` or `wms` it sets the checked layer type and also sets the visiblity of the slider if there are any selected `wms` or `raster` layer
      dispatch(
        setCheckedLayerTypeAndSliderVisible({
          layer: layer.layer_type,
          checked,
          feature_id: layer.layer,
        }),
      );

    // zoom to layer when then layer is toggle on
    // if (
    //   Array.isArray(layer.bbox) &&
    //   layer.bbox.length !== 0 &&
    //   !layer.checked
    // ) {
    //   dispatch(
    //     setMapState({ selectedLayerBound: layer.bbox as LngLatBoundsLike }),
    //   );
    // }

    // Set layer info for indo dialog panel
    // if (!layer.hasSubLayerList && checked)
    //   dispatch(setFeatureInfo({ selectedLayerData: layer }));

    return null;
  }

  function handleSubLayerChange({
    layerId,
    sublayerId,
    checked,
    ...rest
  }: Record<string, any>) {
    dispatch(setLayerLegend(rest));
    if (checked) dispatch(setFeatureInfo({ selectedLayerData: rest }));

    // Set layer info for indo dialog panel
    dispatch(setSubLayerChecked({ sublayerId, layerId, checked }));

    // For timeline
    if (rest?.key?.includes('forecast')) {
      dispatch(setLayersWithSliders({ key: rest.key, checked }));
    }
  }

  const editStyle = (
    layerData: Record<string, any>,
    id: number,
    layer: string,
    layerType: string,
    style: JSON,
    geometryType: string,
  ) => {
    if (!layerData.checked) handleInputChange(layerData, true);
    setEditData({ id, layer, layerType, style, geometryType });
    setEditOverlay(true);
  };

  return (
    <div
      className={`rounded bg-transparent
       hover:border-grey-800`}
    >
      {/* Edit portal */}
      {editOverlay && (
        <PortalTemplate>
          <EditOverlay onCancel={() => setEditOverlay(false)} data={editData} />
        </PortalTemplate>
      )}
      {/* Edit portal */}

      <div>
        <div
          tabIndex={0}
          role="button"
          className="my-1 flex w-full cursor-pointer items-center
            justify-between gap-3 font-primary text-button-md"
          onClick={() => {
            setCollapsed(!collapsed);
            onToggle(collapsed);
          }}
          onMouseEnter={() => {
            timeout = setTimeout(() => {
              toggleShowInfo(true);
            });
          }}
          onMouseLeave={() => {
            clearInterval(timeout);
            toggleShowInfo(false);
          }}
        >
          <div className="flex w-full gap-2">
            <div>{header}</div>
          </div>
          {tooltipmessage && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span
                    className={`${
                      showInfo ? 'visible' : 'invisible'
                    } material-icons-outlined -mr-2 text-[1.3rem] text-grey-700 hover:bg-[#F5F5F5] group-hover:text-grey-600`}
                  >
                    info
                  </span>
                </TooltipTrigger>
                <TooltipContent className="relative w-fit">
                  <p className="absolute right-2 top-0 z-[1000]  h-auto w-[8rem] rounded-xl bg-gray-600   py-2 pl-2 text-[0.575rem] leading-[0.675rem] text-white">
                    {tooltipmessage}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div>
            <button
              type="button"
              title={collapsed ? 'Expand' : 'Collapse'}
              className={`h-6 rounded-full  ${
                !collapsed
                  ? 'bg-secondary-50 text-secondary-400'
                  : 'hover:bg-grey-100'
              }`}
              onClick={() => {
                setCollapsed(!collapsed);
                onToggle(collapsed);
              }}
            >
              <i className="material-icons text-icon-md">
                {collapsed ? 'expand_more' : 'expand_less'}
              </i>
            </button>
          </div>
        </div>
      </div>
      <div className={`${collapsed ? 'hidden' : ''}`}>
        <div className="flex w-full flex-col justify-between gap-2 ">
          {layers.map((layer, index) => {
            // if (layer.name_en === 'Stimson Project AOI')
            //   return <div>Lazy day</div>;
            return (
              <div key={index} className="flex flex-col">
                <div
                  className="flex items-center gap-x-3 "
                  onMouseEnter={() => {
                    toggleShowEdit(layer.id);
                  }}
                  onMouseLeave={() => {
                    toggleShowEdit(null);
                  }}
                >
                  <input
                    id={`${layer.layer_type}-${layer.id}`}
                    type="checkbox"
                    name={`${layer.layer_type}-${layer.id}`}
                    className="min-h-[16px] min-w-[16px] cursor-pointer  accent-grey-800"
                    checked={layer.checked}
                    onChange={e => handleInputChange(layer, e.target.checked)}
                  />
                  {!weatherLayerType.includes(layer.layer_type) &&
                    layer.layer_type !== 'raster' &&
                    layer.layer_type !== 'wms' && (
                      <div className="flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center">
                        {layer.icon ? (
                          <img
                            src={layer.icon}
                            alt="layer.name_en"
                            className="h-5 w-5 object-cover"
                          />
                        ) : (
                          <span
                            style={{
                              width: '1rem',
                              height:
                                layer.geometry_type === 'LineString'
                                  ? '0.25rem'
                                  : '1rem',
                              border: `1px solid ${
                                layer.geometry_type === 'Polygon' &&
                                layer.style?.['fill-color'] === 'transparent'
                                  ? layer.style['fill-outline-color']
                                  : 'white'
                              }`,
                              borderRadius:
                                layer.geometry_type === 'LineString' ||
                                layer.geometry_type === 'Polygon'
                                  ? '100%'
                                  : '100%',
                              backgroundColor:
                                layer.geometry_type === 'Point'
                                  ? layer.style?.['circle-color']
                                  : layer.geometry_type === 'Polygon'
                                  ? layer.style?.['fill-color']
                                  : layer.style?.['line-color'],
                            }}
                          />
                        )}
                      </div>
                    )}

                  <label
                    htmlFor={`${layer.layer_type}-${layer.id}`}
                    className="font-primaryfont w-[13.5rem] cursor-pointer text-body-lg text-grey-600"
                    title={layer.name_en}
                  >
                    {layer.name_en}
                  </label>
                  {!Object.keys(layer).includes('notEditable') && (
                    <span
                      onClick={() =>
                        editStyle(
                          layer,
                          layer.id,
                          layer.layer,
                          layer.layer_type,
                          layer.style,
                          layer.geometry_type,
                        )
                      }
                      role="edit"
                      className={`${
                        showEdit === layer.id ? 'block' : 'invisible'
                      } material-icons-outlined -mr-3 cursor-pointer rounded-md p-1 text-[1.3rem] hover:bg-[#F5F5F5] group-hover:text-grey-600`}
                    >
                      edit
                    </span>
                  )}
                  {layer.detail && (
                    // {layer.detail && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span
                            className={`${
                              showEdit === layer.id ? 'block' : 'invisible'
                            } material-icons-outlined -mr-2 text-[1.3rem] text-grey-700 hover:bg-[#F5F5F5] group-hover:text-grey-600`}
                          >
                            info
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="relative w-fit">
                          <p className="absolute right-2 top-0 z-[1000] h-auto  w-[8rem] rounded-xl bg-gray-600 py-2 pl-2 text-[0.575rem] leading-[0.675rem] text-white">
                            {layer.detail}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <DropdownOptions options={dropdownOptions} data={layer} />
                </div>
                {/* {layer.hasSubLayerList &&sublayerIsVisible && } */}
                <div className="sublayer-list ">
                  {layer.hasSubLayerList &&
                    layer.name_en !== 'Glacial Lakes' &&
                    !!layer.subLayerList.length &&
                    layer.checked && (
                      <div className="ml-7">
                        {/*! might have to convert this to accordion */}
                        {layer.subLayerList.map(
                          (sublayer: Record<string, any>) => (
                            <div
                              key={sublayer.name_en}
                              className="row flex gap-1 p-1"
                            >
                              <input
                                id={`${sublayer.id}-${sublayer.name_en}`}
                                type="checkbox"
                                name={`${sublayer.id}-${sublayer.name_en}`}
                                className="min-h-[16px] min-w-[16px] cursor-pointer accent-grey-800"
                                checked={sublayer.checked}
                                onChange={e => {
                                  e.stopPropagation();
                                  handleSubLayerChange({
                                    ...sublayer,
                                    layerId: sublayer._layer_id,
                                    sublayerId: sublayer.id,
                                    checked: e.target.checked,
                                  });
                                }}
                              />
                              <label
                                htmlFor={`${sublayer.id}-${sublayer.name_en}`}
                                className="text-xs font-normal text-[#484848]"
                              >
                                {sublayer.name_en}
                              </label>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
