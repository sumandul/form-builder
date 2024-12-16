import Email from '@Components/common/EmailChannel/email';
import Icon from '@Components/common/Icon';
import { useTypedSelector } from '@Store/hooks';

const EmailRecipientsOverlay = ({ onClose, visibleEmails }: any) => {
  const emailList = useTypedSelector(state => state.emailChannel.emailList);
  const remaingEmaliList =
    emailList?.filter((email: string) => !visibleEmails?.includes(email)) || [];

  if (remaingEmaliList.length === 0) {
    onClose();
  }

  return (
    <div className="absolute left-1/2 top-1/2 h-[38rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="flex flex-col  ">
        <div className="flex  items-center justify-between px-6 py-7">
          <span className="text-xl font-semibold leading-7 text-[#484848]">
            Recipients
          </span>
          <Icon
            onClick={() => {
              onClose();
            }}
            name="close"
            className="text-[24px] font-normal text-[#757575]"
          />
        </div>
        <div className="flex flex-wrap items-center justify-start gap-2 px-6 py-7">
          {remaingEmaliList?.map((recipient: string) => (
            <div key={`${recipient}-email`}>
              <Email name={recipient} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailRecipientsOverlay;
