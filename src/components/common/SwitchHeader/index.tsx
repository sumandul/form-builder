import { FlexRow } from '../Layouts';

interface IHeaderProps {
  // eslint-disable-next-line no-unused-vars
  onClick: (url: string) => void;
  headerOptions: Array<{ id: number; title: string; value: string }>;
  selectedTab: string;
}
const ExploreHeader = ({
  onClick,
  headerOptions,
  selectedTab,
}: IHeaderProps) => {
  return (
    <>
      <FlexRow className="justify-start">
        <FlexRow className="flex-wrap items-center justify-center gap-4">
          {headerOptions.map(header => (
            // eslint-disable-next-line react/button-has-type
            <button
              className={`text-[0.875rem] ${
                selectedTab === header.value
                  ? 'border-b-2 border-primary-900 py-2 text-primary-500'
                  : 'text-gray-500'
              }`}
              type="button"
              key={header.id}
              onClick={() => onClick(header.value)}
            >
              <p className="cursor-pointer whitespace-nowrap px-2 text-sm font-medium leading-7 2xl:text-xl">
                {header.title}
              </p>
            </button>
          ))}
        </FlexRow>
      </FlexRow>
    </>
  );
};

export default ExploreHeader;
