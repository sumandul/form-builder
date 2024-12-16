/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Button } from '@Components/RadixComponents/Button';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { scrollToComponent } from '@Hooks/useForm/useFormUtils';
import { postPDf } from '@Services/pdf';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { addPDFFormValidation } from '@Validators/index';

export default function AddPDFOverlay({
  onCancel, // onConfirm,
}: {
  onCancel: () => void;
  // onConfirm: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation<any>({
    mutationFn: postPDf,
    onSuccess: () => {
      onCancel();
      queryClient.invalidateQueries({ queryKey: ['get-pdf-list'] });
      toast.success('PDF added Successfully.');
    },
  });
  const { handleSubmit, register } = useForm({
    initialValues: {},
    validationSchema: addPDFFormValidation,
    postDataInterceptor: values => {
      const { title, description, pdf_file, published_date } = values;
      const formDate = new FormData();
      formDate.append('title', title);
      formDate.append('description', description);
      formDate.append('published_date', published_date);
      formDate.append('pdf_file', pdf_file[0].fileObject);
      return formDate;
    },
    service: mutate,
  });
  return (
    <div className="absolute left-1/2 top-1/2 max-h-[90vh] min-h-fit w-[512px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white">
      <div className="body flex h-full flex-col  gap-2 p-6">
        <div className="head flex w-full items-center justify-center gap-2">
          <div className="content flex w-full flex-col  gap-2">
            <h6>Add PDF</h6>
            <p className=" text-[0.875rem] text-grey-600">
              Please fill up the details
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="controls flex h-full flex-col justify-between gap-8 overflow-y-auto"
        >
          <div
            className="controls scrollbar flex max-h-[356px] flex-col gap-4 overflow-y-auto px-1"
            style={{ scrollbarGutter: 'stable' }}
          >
            <NewFormControl
              controlType="input"
              label="Title"
              placeholder="Enter PDF title"
              requiredControl
              {...register('title')}
            />
            <NewFormControl
              controlType="datePicker"
              rows={5}
              label="Published date"
              placeholder="Select a date"
              requiredControl
              {...register('published_date')}
            />
            <NewFormControl
              controlType="textArea"
              rows={5}
              label="Description"
              placeholder="PDF Description"
              requiredControl
              {...register('description')}
            />

            <NewFormControl
              controlType="dragAndDrop"
              rows={5}
              label="Upload"
              placeholder="Browse pdf filee"
              requiredControl
              {...register('pdf_file', {
                setCustomValue: e => {
                  if (e?.length) scrollToComponent('--form-field-pdf_file');
                  return e;
                },
              })}
            />
          </div>
          <div className="actions flex items-center justify-center gap-2">
            <SubmitButton
              isSubmitting={isLoading}
              isError={isError}
              isSuccess={isSuccess}
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              // error={error?.message}
            >
              UPLOAD
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
