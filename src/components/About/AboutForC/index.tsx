import { FlexRow, FlexColumn } from '@Components/common/Layouts';
import Image from '@Components/RadixComponents/Image';
import geoAlert from '@Assets/images/GeoAlert.jpg';
import BindContentContainer from '@Components/common/BindContentContainer';

export default function AboutForC() {
  return (
    <BindContentContainer className="m-auto my-16 h-fit items-center">
      <FlexRow className="gap-5">
        <FlexColumn className="mt-6 w-[36.875rem] flex-1 gap-8">
          <h3>About ForeC</h3>
          <p className="text-justify font-primary text-body-md">
            ForeC, by its full name Foresee Cascading Hazards and Extreme Flow
            Events, is a local early warning system for providing concerned
            authority, the alerts about the disasters related to watersheds and
            sub-watershed level. The tool provides a basis for evaluating
            emergent risks of cascading mountain hazards, such as the Melamchi
            Disaster of 2021, using a blend of remote-sensing technologies,
            multi-hazard risk indices which combine a variety of existing data
            sets and forecasts, and field-based analysis that builds community
            engagement and local observations. To identify key risk areas for
            cascading hazards, the tool will combine analysis of synthetic
            aperture radar (SAR) satellite data, interpretation of
            geomorphological data, integration of hydrometeorological forecasts
            to assess aggregated risks in a given system or potential hazard
            chain.
          </p>
        </FlexColumn>
        <Image src={geoAlert} className="w-[36.875rem] flex-1 rounded-lg" />
      </FlexRow>
    </BindContentContainer>
  );
}
