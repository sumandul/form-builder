import { Button } from '@Components/RadixComponents/Button';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import { useState } from 'react';
import useForm from '@Hooks/useForm';
import SubmitButton from '@Components/common/SubmitButton';
import DefineRuleOverlay from '@Components/PortalOverlays/DefineRuleOverlay';
import PortalTemplate from '@Components/common/PortalTemplate';
import { emailChannelFormValidation } from '@Validators/index';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { postSendEmail } from '@Services/adminDashboard';

const EmailChannel = () => {
  const [isDefineRuleOverlay, setIsDefineRuleOverlay] =
    useState<boolean>(false);

  const queryClient = useQueryClient();
  const thresholdTypeOptions = [
    {
      id: 1,
      label: 'Wetness',
      value: 'wetness',
    },
    {
      id: 2,
      label: 'Snow Cover',
      value: 'snow_cover',
    },
    {
      id: 3,
      label: 'Precipitation',
      value: 'Precipitation',
    },
  ];

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

      toast.success('User added Successfully.');
    },
  });
  const { handleSubmit, register } = useForm({
    initialValues: {},
    validationSchema: emailChannelFormValidation,
    postDataInterceptor: data => {
      const { subject, description: message } = data;

      return { subject, message };
    },
    service: postEmail,
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
          <NewFormControl
            label="Threshold Type"
            placeholder="Threshold Type"
            controlType="dropDown"
            requiredControl
            options={thresholdTypeOptions}
            {...register('threshold')}
          />

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
          <DefineRuleOverlay onClose={() => setIsDefineRuleOverlay(false)} />
        </PortalTemplate>
      )}
    </div>
  );
};

export default EmailChannel;
