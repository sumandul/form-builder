/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import { useState } from 'react';
import Icon from '@Components/common/Icon';
import info_icon from '@Assets/images/info_icon.png';
import Image from '@Components/RadixComponents/Image';
import VectorFeatures from './VectorFeatures';
import SectionTrigger from './SectionTrigger';
import Raster from './Raster';
import WMSLayer from './WMSLayer';

const sections: Record<string, any>[] = [
  { id: 1, name: 'Vector Layer', value: 'vector_features' },
  { id: 2, name: 'Raster Layer', value: 'raster' },
  { id: 3, name: 'WMS layer', value: 'add_wms_layer' },
];

const infos: Record<string, Record<string, any>[]> = {
  vector_features: [
    {
      id: 1,
      title: 'Vector feature',
      description:
        'You can add a vector layer like point, line or polygon to make them appear on map as a layer.',
    },
    {
      id: 2,
      title: 'Layername',
      description:
        'The provided layer name will be visible on a layer panel of map page.',
    },
    {
      id: 3,
      title: 'Category',
      description:
        "Select the category under which you want to add this layer.If you can't visualise the category of layer you are adding. please refer to admin for adding the category.",
    },
    {
      id: 4,
      title: 'Sub-category',
      description:
        "Select the category under which you want to add this layer.If you can't visualise the category of layer you are adding. please refer to admin for adding the sub-category.",
    },
    {
      id: 5,
      title: 'Upload Data',
      description:
        'Upload the vector layer in (.csv, .shp or .geojson) format. In case of .csv file, the two fields for selecting longitude and latitude will appear. The uploaded file will then be visible as a layer on map page. \nNote: The uploaded datafiles should be on EPSG 4326 (WGS Projection system)',
    },
  ],
  raster: [
    {
      id: 1,
      title: 'Raster',
      description:
        'To add Raster data, please provide the raster tiles in .tif format and also provide respective layer name.',
    },
    {
      id: 2,
      title: 'Layername',
      description:
        'The provided layer name will be visible on a layer panel of map page.',
    },
    {
      id: 3,
      title: 'Category',
      description:
        "Select the category under which you want to add this layer.If you can't visualise the category of layer you are adding. please refer to admin for adding the category.",
    },
    {
      id: 4,
      title: 'Sub-category',
      description:
        "Select the category under which you want to add this layer.If you can't visualise the category of layer you are adding. please refer to admin for adding the sub-category.",
    },
    {
      id: 5,
      title: 'Upload Data',
      description:
        'Upload the raster layer in .tif format. The uploaded file will be seen as a layer on map page. \nNote: The uploaded datafiles should be on EPSG 3857 (Web Mercator Projection)',
    },
    {
      id: 6,
      title: 'Upload .sld file',
      description:
        'Upload .sld file to provide custom appearance of raster layer.',
    },
    {
      id: 7,
      title: 'Select Existing layer',
      description:
        'Toggle on " select existing layer" to add data on already existing layer for different time. You need to provide the date of added raster layer.',
    },
  ],
  add_wms_layer: [
    {
      id: 1,
      title: 'Add WMS layer',
      description:
        'To add a WMS layer to the system, please provide the WMS endpoint URL and the desired layer name.',
    },
    {
      id: 2,
      title: 'Layername',
      description:
        'The provided layer name will be visible on a layer panel of map page.',
    },
    {
      id: 3,
      title: 'Category',
      description:
        "Select the category under which you want to add this layer.If you can't visualise the category of layer you are adding. please refer to admin for adding the category.",
    },
    {
      id: 4,
      title: 'Sub-category',
      description:
        "Select the category under which you want to add this layer.If you can't visualise the category of layer you are adding. please refer to admin for adding the sub-category.",
    },
    {
      id: 5,
      title: 'Select Existing layer',
      description:
        'Toggle on "select existing layer" to add data on already existing layer for different time. You need to provide the date of added raster layer. ',
    },
  ],
};

export default function AddlayerOverlay({
  onCancel, // onConfirm,
}: {
  onCancel: () => void;
  // onConfirm: () => void;
}) {
  const [activeSection, setActiveSection] = useState('vector_features');

  return (
    <div className="absolute left-1/2 top-1/2 h-[44.625rem] max-h-[90vh] w-fit -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-white lg:w-[54.8rem]">
      <div className="body flex h-full flex-col ">
        <div
          className="head flex w-full items-center justify-center gap-2 p-6"
          style={{ boxShadow: '0px 2px 20px 4px rgba(0, 0, 0, 0.12)' }}
        >
          <div className="content flex w-full flex-col  gap-2">
            <h4>Add Layer</h4>
            <p className="text-body-md">
              Please fill up the details to add layer
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>
        {/* content */}
        <div className="bottom flex h-full w-full flex-col overflow-y-auto lg:flex-row">
          <div className="left flex h-full w-full flex-col gap-10 px-10 py-6 lg:w-[70%]">
            <div className="triggers flex w-full items-center justify-between">
              {sections.map(item => (
                <SectionTrigger
                  key={item.id}
                  active={activeSection === item.value}
                  onClick={() => {
                    setActiveSection(item.value);
                  }}
                  name={item?.name}
                />
              ))}
            </div>
            <div className="forms h-full w-full overflow-y-auto">
              {activeSection === 'vector_features' && <VectorFeatures />}
              {activeSection === 'raster' && <Raster />}
              {activeSection === 'add_wms_layer' && <WMSLayer />}
            </div>
          </div>
          <div className="right scrollbar flex w-full flex-col gap-5  overflow-y-auto bg-blue-50 p-5 lg:w-[40%]">
            <div className="title flex items-center gap-3">
              <Image src={info_icon} className="w-[2rem]" />
              <p> Info</p>
            </div>
            <div className="flex flex-col gap-2">
              {infos[activeSection]?.map((item, index) => {
                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    <p className="text-button-md">{item.title}</p>
                    <p
                      className="whitespace-break-spaces text-tooltip font-[400]"
                      // dangerouslySetInnerHTML={item?.description}
                    >
                      {item.description}
                    </p>
                    {index !== infos[activeSection].length - 1 && (
                      <hr
                        style={{ background: '#BDBDBD', height: '0.09rem' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
