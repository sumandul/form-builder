import { Button } from '@Components/RadixComponents/Button';
import { useTypedDispatch } from '@Store/hooks';
import { toggleBannerModal } from '@Store/actions/common';

export default function FirstBanner() {
  const dispatch = useTypedDispatch();
  return (
    <>
      <div className="w-[32rem] px-7">
        <h4 className="font-primary text-primary-500">ForeC</h4>
        <h4 className="font-primiary mb-5 mt-5">Welcome to ForeC</h4>
        <p className="font-primary text-body-md">
          This system serves as a critical tool in reducing the loss of life and
          property, enhancing disaster preparedness, and fostering resilience in
          vulnerable regions prone to various hazards. It allows individuals,
          communities, and authorities to take immediate actions to protect
          lives and property & provides valuable lead time for evacuation,
          activates emergency response plans, and enables the mobilization of
          resources and relief efforts. Additionally, it plays a crucial role in
          raising awareness and educating the public about potential hazards and
          appropriate safety measures.
        </p>
        <Button
          onClick={() => {
            dispatch(toggleBannerModal(null));
            localStorage.setItem(
              'homeBannerViewedDate',
              new Date().toISOString(),
            );
          }}
          className="ml-[35%] mt-[4.2rem] text-button-md"
        >
          VIEW DASHBOARD
        </Button>
      </div>
    </>
  );
}
