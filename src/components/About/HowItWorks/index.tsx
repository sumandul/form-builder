/* eslint-disable array-callback-return */
import BindContentContainer from '@Components/common/BindContentContainer';
import { FlexRow, FlexColumn } from '@Components/common/Layouts';
import Image from '@Components/RadixComponents/Image';
import howitworks from '@Assets/images/Station.png';

const dummyData = [
  {
    id: 1,
    title: 'Watershed Layer is uploaded to system',
  },
  {
    id: 2,
    title: 'Raster Layers are uploaded to system',
  },
  {
    id: 3,
    title: 'Calculated risk layer is uploaded to system',
  },
  {
    id: 4,
    title: 'Watershed level risk is calculated',
  },
];

export default function HowItWorks() {
  return (
    <div className="w-full bg-grey-100">
      <BindContentContainer className="m-auto py-[6.25rem]">
        <FlexRow className="gap-12">
          <FlexColumn className="gap-8">
            <h3>How it works ?</h3>
            <div>
              {dummyData.map((data: Record<string, any>) => (
                <div
                  key={data.id}
                  className="mb-2 w-[485px] rounded-lg border border-[#E0E0E0] bg-white px-5 py-4"
                >
                  <span className="font-primary text-button-md">
                    {data.title}
                  </span>
                </div>
              ))}
            </div>
          </FlexColumn>
          <Image
            src={howitworks}
            className="h-[23.125rem] w-[41.688rem] rounded-lg"
          />
        </FlexRow>
      </BindContentContainer>
    </div>
  );
}
