import BindContentContainer from '@Components/common/BindContentContainer';
import { FlexRow } from '@Components/common/Layouts';
import Dropdown from '@Components/RadixComponents/Dropdown';
import { statisticsList } from '@Constants/index';
import { useTypedSelector, useTypedDispatch } from '@Store/hooks';
import { setAnalyticsState } from '@Store/actions/analyticsActions';
import ChartSection from './ChartSection';

export default function AnalyticsComponent() {
  const dispatch = useTypedDispatch();
  const selectedStatistic = useTypedSelector(
    state => state.analytics.statistics,
  );
  return (
    <BindContentContainer className="m-auto h-fit">
      <FlexRow className="mb-2 mt-5 justify-between">
        <h4 className="font-primary">Analytics</h4>
        <FlexRow className="gap-2">
          <div className="flex items-center border-r-[1px] px-4">
            <span className="mr-2.5 font-primary text-tooltip">Basin :</span>
            <span>Bagmati</span>
            {/* <Dropdown
              dropDownSize="sm"
              placeholder="Bagmati"
              options={[]}
              choose="value"
              disabled
              className="!h-9 w-[10rem] !border-gray-300 !bg-white"
              onChange={() => {}}
            /> */}
          </div>
          <div>
            <span className="mr-2.5 font-primary text-tooltip">Statistics</span>
            <Dropdown
              dropDownSize="sm"
              options={statisticsList}
              choose="value"
              value={selectedStatistic}
              className="!h-9 w-[10rem] !border-gray-300 !bg-white"
              onChange={value => {
                dispatch(setAnalyticsState({ statistics: value }));
              }}
            />
          </div>
        </FlexRow>
      </FlexRow>
      <ChartSection />
    </BindContentContainer>
  );
}
