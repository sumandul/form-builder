import Image from '@Components/RadixComponents/Image';
import ObjectiveImage from '@Assets/images/ObjectiveCard.png';
import { FlexRow } from '@Components/common/Layouts';

export default function ObjectiveCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-[19.125rem] w-[21.063rem] rounded-lg bg-[#f0f4f3] px-6 py-7">
      <FlexRow className="justify-end">
        <Image src={ObjectiveImage} className="-mt-4" />
      </FlexRow>
      <h6 className="mb-2 font-primary">{title}</h6>
      <p className="font-primary text-body-md">{description}</p>
    </div>
  );
}
