import { Button } from '@Components/RadixComponents/Button';
import ErrorLabel from '@Components/common/FormUI/NewFormControl/ErrorLabel';
import Icon from '@Components/common/Icon';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';

export default function DeleteConfirmationOverlay({
  onCancel,
  onConfirm,
  isLoading,
  title,
  error,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  error?: any;
}) {
  const [confirmationText, setConfirmationText] = useState('');
  return (
    <div className="absolute left-1/2 top-1/2 h-[250px] w-[512px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white">
      <div className="body flex h-full flex-col  gap-2 p-6">
        <div className="head flex w-full items-center justify-center gap-2">
          <div className="content flex w-full flex-col  gap-2">
            <h6 className="select-none">Delete</h6>
            <p className="select-none text-[0.875rem] text-grey-600">
              {title || 'Are you sure want to delete this PDF?'}
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>
        <p className="select-none text-gray-800">
          Please Type &quot;delete &quot; to Confirm
        </p>

        <input
          type="text"
          placeholder="Type 'delete'"
          onPaste={e => e.preventDefault()}
          className="rounded-lg border-2 p-3 focus:outline-none"
          onChange={(e: any) => setConfirmationText(e.target.value)}
          // onChange={e => setInput(e.target.value)}
        />
        {error && <ErrorLabel message={error} />}
        <div className="actions flex items-center justify-end gap-2">
          <Button variant="link" onClick={() => onCancel()}>
            CANCEL
          </Button>

          <Button
            variant="secondary"
            disabled={confirmationText !== 'delete'}
            onClick={() => onConfirm()}
            // withLoader
            // isLoading={isLoading}
            // onClick={handleUserDelete}
            // disabled={deleteConfirmationText !== input}
            className="flex items-center justify-center gap-1 !bg-others-rejected text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
          >
            {!isLoading && (
              <Icon
                name="delete"
                // onClick={() => onCancel()}
                className="mt-1 text-white"
              />
            )}
            Delete
            {isLoading && (
              <SyncLoader
                color="#ffffff"
                cssOverride={{ margin: '2px' }}
                loading
                margin={0.5}
                size={8}
                speedMultiplier={1.5}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
