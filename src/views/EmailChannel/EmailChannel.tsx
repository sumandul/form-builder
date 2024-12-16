import { Button } from '@Components/RadixComponents/Button';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import { useEffect, useRef, useState } from 'react';
import useForm from '@Hooks/useForm';
import SubmitButton from '@Components/common/SubmitButton';
import DefineRuleOverlay from '@Components/PortalOverlays/DefineRuleOverlay';
import PortalTemplate from '@Components/common/PortalTemplate';
import { emailChannelFormValidation } from '@Validators/index';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getEmailRecipients,
  getThresholdDetails,
  getWeatherThresholdDetails,
  postSendEmail,
} from '@Services/adminDashboard';

import Email from '@Components/common/EmailChannel/email';
import Icon from '@Components/common/Icon';
import EmailRecipientsOverlay from '@Components/PortalOverlays/EmailRecipientsOverlay';
import { useDispatch } from 'react-redux';
import { setemailChannelState } from '@Store/actions/emailChannel';
import { useTypedSelector } from '@Store/hooks';

const EmailChannel = () => {
  const [isDefineRuleOverlay, setIsDefineRuleOverlay] =
    useState<boolean>(false);
  const [isEmailReciepentOverlay, setEmailReciepentOverlay] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const emailList = useTypedSelector(state => state.emailChannel.emailList);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleEmails, setVisibleEmails] = useState(emailList);
  const [showMore, setShowMore] = useState(false);
  const [thresholdTypeOptions, setThresholdTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    const calculateFit = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        let estimatedTotalEmailsWidth = 0;
        const tempVisibleEmails = [];

        const averageEmailWidth = 132;

        // eslint-disable-next-line no-restricted-syntax
        for (const email of emailList) {
          if (estimatedTotalEmailsWidth + averageEmailWidth > containerWidth) {
            setShowMore(true);
            break;
          } else {
            tempVisibleEmails.push(email);
            estimatedTotalEmailsWidth += averageEmailWidth;
          }
        }

        setVisibleEmails(tempVisibleEmails);
      }
    };

    // Call the function on mount and when emailList changes
    calculateFit();

    // Optional: Add resize listener for dynamic adjustments on window resize
    window.addEventListener('resize', calculateFit);
    return () => window.removeEventListener('resize', calculateFit);
  }, [emailList]); // Depend on emailList

  const queryClient = useQueryClient();
  // const thresholdTypeOptions = [
  //   {
  //     id: 1,
  //     label: 'Wetness',
  //     value: 'wetness',
  //   },
  //   {
  //     id: 2,
  //     label: 'Snow Cover',
  //     value: 'snow_cover',
  //   },
  //   {
  //     id: 3,
  //     label: 'Precipitation',
  //     value: 'Precipitation',
  //   },
  // ];

  const {
    mutate: postEmail,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['post-email-channel'],
    mutationFn: postSendEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-channel'] });
      // eslint-disable-next-line no-use-before-define
      clearAndInitialiseForm();
      dispatch(setemailChannelState({ emailList: [] }));
      toast.success('Email sent successfully.');
    },
  });
  const { handleSubmit, register, values, clearAndInitialiseForm } = useForm({
    formName: 'email-channel',
    initialValues: {},
    validationSchema: emailChannelFormValidation,
    postDataInterceptor: data => {
      const { subject, description: message } = data;
      return {
        subject,
        message,

        ...(emailList.length
          ? { recipient_list: JSON.stringify(emailList) }
          : null),
      };
    },
    service: postEmail,
  });

  const { data: thresholds } = useQuery({
    queryKey: ['threshold-data-list'],
    queryFn: () => getThresholdDetails(),
    select: response => response.data,
  });

  const { data: weatherThresholds } = useQuery({
    queryKey: ['weather-threshold-data-list'],
    queryFn: () => getWeatherThresholdDetails(),
    select: response => response.data,
  });

  useEffect(() => {
    if (!weatherThresholds || !thresholds) return;
    const layerOptions = thresholds.map((threshold: Record<string, any>) => ({
      id: `layer-${threshold.id}`,
      label: threshold.title,
      value: threshold.title,
    }));
    const weatherSourceOptions = weatherThresholds.map(
      (weatherSource: Record<string, any>) => ({
        id: `weather-${weatherSource.id}`,
        label: weatherSource.title,
        value: weatherSource.title,
      }),
    );
    const newData = [...layerOptions, ...weatherSourceOptions];
    setThresholdTypeOptions(newData);
  }, [weatherThresholds, thresholds]);

  const { isFetching: isEmailLoading } = useQuery({
    queryKey: ['email-reciepent', values?.threshold],
    enabled: !!values?.threshold,
    queryFn: () => {
      const paramsArray = values.threshold?.split('-');
      const [source, id] = paramsArray;
      return getEmailRecipients({
        source,
        id,
      });
    },
    select: res => res.data,
    onSuccess: recps => {
      dispatch(setemailChannelState({ emailList: recps }));
    },
  });

  return (
    <div className="flex flex-col">
      <div className="top mb-4 flex items-start justify-between">
        <h5>Email Channel</h5>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsDefineRuleOverlay(prev => !prev)}
          className="flex !items-center justify-between gap-1 font-bold"
        >
          DEFINE&nbsp;RULE
        </Button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="controls flex h-full flex-col justify-between space-y-7"
      >
        <div
          className="controls scrollbar flex max-h-[60vh] flex-col gap-y-4 overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="flex flex-col space-y-2">
            <NewFormControl
              label="Threshold Type"
              placeholder="Threshold Type"
              controlType="dropDown"
              requiredControl
              options={thresholdTypeOptions}
              {...register('threshold')}
            />
            {isEmailLoading ? (
              <span>Loading...</span>
            ) : (
              <div
                ref={containerRef}
                className="flex max-h-[5rem]  w-full flex-wrap items-center justify-start gap-x-2 gap-y-3 overflow-hidden"
              >
                {visibleEmails?.map(email => (
                  <Email key={email} name={email} />
                ))}
                {showMore && emailList.length - visibleEmails.length > 0 ? (
                  <Button
                    variant="link"
                    onClick={() => setEmailReciepentOverlay(true)}
                  >
                    <Icon name="add" />
                    {emailList.length - visibleEmails.length} More
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          <NewFormControl
            label="Subject"
            placeholder="Subject"
            controlType="input"
            requiredControl
            choose="value"
            {...register('subject')}
          />
          <NewFormControl
            label="Description"
            requiredControl
            placeholder="Description"
            controlType="textArea"
            controlElementStyle="!min-h-[239px]"
            {...register('description')}
          />
        </div>
        <div className="actions mb-2 flex items-center justify-center gap-2">
          <SubmitButton
            isSubmitting={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            variant="default"
            className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
            error={
              // @ts-ignore
              error?.response?.data?.message
            }
          >
            SEND EMAIL
          </SubmitButton>
        </div>
      </form>
      {isDefineRuleOverlay && (
        <PortalTemplate>
          <DefineRuleOverlay
            onClose={() => setIsDefineRuleOverlay(false)}
            thresholdOption={thresholdTypeOptions}
          />
        </PortalTemplate>
      )}
      {isEmailReciepentOverlay && (
        <PortalTemplate>
          <EmailRecipientsOverlay
            onClose={() => setEmailReciepentOverlay(false)}
            visibleEmails={visibleEmails}
          />
        </PortalTemplate>
      )}
    </div>
  );
};

export default EmailChannel;
