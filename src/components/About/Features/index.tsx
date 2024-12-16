import logo from '@Assets/images/Alert.svg';
import logo1 from '@Assets/images/AlertMeter.svg';
import Image from '@Components/RadixComponents/Image';
import image from '@Assets/images/pngwing 1.png';
import FeatureCard from './FeatureCard';

const featureData = [
  {
    id: 1,
    icon: logo,
    title: 'Vector Data visualisation',
    description:
      'Users can add the vector layers and visualise them on a map. The vector dataset includes point, line and polygon features. The dashboard accepts vector layers in .csv, .shp and .geojson format. ',
  },
  {
    id: 2,
    icon: logo,
    title: 'Raster Data visualisation',
    description:
      'Users can add the vector layers and visualise them on a map. The vector dataset includes point, line and polygon features. The dashboard accepts vector layers in .csv, .shp and .geojson format.',
  },
  {
    id: 3,
    icon: logo1,
    title: 'ArcGIS layers visualisation',
    description:
      'The user can also add WMS layers as well as arcGIS map server and ArcGIS image server data as a layer and visualise them on map.',
  },
  {
    id: 4,
    icon: logo1,
    title: 'Analysis of Risk Parameters',
    description:
      'ForeC platform assists on identifying and assessing potential risks, quantifying their impact and likelihood, and implementing strategies to mitigate or manage them, ensuring effective risk management mostly on watershed domains.',
  },
  {
    id: 5,
    icon: logo1,
    title: 'Alert message for forecasted risk',
    description:
      'ForeC provides the alert message in case any parameters cross the threshold value for each sub-watershed.',
  },
  {
    id: 6,
    icon: logo1,
    title: 'Sub-basin level analysis',
    description:
      'This approach monitors real-time precipitation,temperature, snow-cover and soil saturation data at sub-basin level. When a threshold level is reached, it warns of possible disasters and cascading disasters.',
  },
];
export default function Features() {
  return (
    <div className="w-full bg-[#DFF2EF] px-[3.75rem] py-[6.25rem]">
      <div className="mx-auto max-w-[85rem]">
        <h3 className="mb-4 w-[68rem] text-center font-primary text-grey-900">
          Features
        </h3>
        <div className="gap-28 md:flex">
          <div className="mt-4 w-[90%] text-center">
            <Image src={image} className="mx-auto mt-36" />
          </div>
          <div className="grid grid-cols-2">
            {featureData.map((feature: any) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
