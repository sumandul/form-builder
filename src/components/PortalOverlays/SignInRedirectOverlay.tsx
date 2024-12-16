import Icon from '@Components/common/Icon';
import { useTypedDispatch } from '@Store/hooks';
import { FlexRow } from '@Components/common/Layouts';
import { Button } from '@Components/RadixComponents/Button';
import { toggleBannerModal } from '@Store/actions/common';

export default function SignInRedirectOverlay({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const dispatch = useTypedDispatch();
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[154px] w-[512px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6">
        <FlexRow className="justify-between">
          <h6 className="font-primary">Sign In</h6>
          <Icon
            name="close"
            className="text-grey-900"
            onClick={() => onCancel()}
          />
        </FlexRow>
        <span className="my-2 font-primary text-body-md">
          Please Sign in to add layer
        </span>
        <FlexRow className="my-2 justify-end">
          <Button
            onClick={() => onCancel()}
            className="!bg-transparent !font-primary !text-button-md !text-primary-500 hover:!bg-transparent"
          >
            CANCEL
          </Button>
          <Button
            onClick={() => {
              onCancel();
              dispatch(toggleBannerModal('sign-in'));
            }}
            className="!px-5 !py-2 !text-button-md"
          >
            SIGN IN
          </Button>
        </FlexRow>
      </div>
    </>
  );
}
