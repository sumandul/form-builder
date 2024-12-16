import BindContentContainer from '@Components/common/BindContentContainer';
import { Grid } from '@Components/common/Layouts';
import ObjectiveCard from './ObjectiveCard';

const objectiveData = [
  {
    id: 1,
    title: '',
    description:
      'To visualise the disaster related data based on watershed and subwatershed level.',
  },
  {
    id: 2,
    title: '',
    description:
      'To integrate Sentinel SAR data analysis from the Stimson Center.',
  },
  {
    id: 3,
    title: '',
    description: 'Provide guidance on data-sharing approaches and data ethics.',
  },
  {
    id: 4,
    title: '',
    description:
      'To visualise the risk data based on watershed and subwatershed level.',
  },
  {
    id: 5,
    title: '',
    description:
      'Advise on risk communication, situation reports, and alerts for at-risk communities and disaster risk managers.',
  },
  {
    id: 6,
    title: '',
    description:
      'Develop a basic web-dashboard (ForeC tool) linking available APIs of the resources',
  },
];

export default function Objective() {
  return (
    <BindContentContainer className="mx-auto h-fit py-[6.25rem]">
      <h3 className="mb-[3.75rem]">Objective</h3>
      <Grid className="w-full !grid-cols-3 grid-rows-2 gap-[3.65rem]">
        {objectiveData.map((data: Record<string, any>) => (
          <ObjectiveCard
            key={data.id}
            title={data.title}
            description={data.description}
          />
        ))}
      </Grid>
    </BindContentContainer>
  );
}
