/* eslint-disable no-nested-ternary */
// import ErrorLabel from '@Molecules/ErrorLabel';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, ButtonProps } from '@Components/RadixComponents/Button';
import { IFormState } from '@Hooks/useForm/_lib';
import Icon from '../Icon';

interface ISubmitButtonProps extends ButtonProps, IFormState {
  disableTillValid?: boolean;
  onSuccess?: () => any;
}

export default function SubmitButton({
  children,
  error,
  isError,
  isSubmitting,
  isSuccess,
  onSuccess,
  ...props
}: ISubmitButtonProps) {
  const [tickIsVisible, setTickIsVisible] = useState(false);
  useEffect(() => {
    let timeoutInstance: any;
    if (isSuccess) {
      setTickIsVisible(true);
      if (onSuccess) onSuccess();
      timeoutInstance = setTimeout(() => {
        setTickIsVisible(false);
      }, 3000);
    }

    return () => clearTimeout(timeoutInstance);
  }, [isSuccess, onSuccess]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[1.25rem] ">
      <Button
        {...props}
        type="submit"
        variant={isSubmitting ? 'ghost' : 'default'}
        className="flex min-w-[4.75rem] gap-3 overflow-hidden transition-all duration-500 ease-in-out"
      >
        {tickIsVisible ? 'Success' : children}&nbsp;
        <AnimatePresence>
          {isSubmitting ? (
            <motion.div
              initial={{
                background: 'blue',
              }}
              animate={{ background: 'none' }}
              exit={{ background: 'black' }}
              className="loader"
            >
              <SyncLoader
                color={isSubmitting ? '#000000' : '#ffffff'}
                cssOverride={{ margin: '2px' }}
                loading
                margin={0.5}
                size={8}
                speedMultiplier={1.5}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        {tickIsVisible ? <Icon name="check" /> : null}
      </Button>
      {isError ? (
        <div className="w-full bg-red-400 p-2 text-center text-white">
          {error || 'Error while submitting form.'}
        </div>
      ) : null}
    </div>
  );
}
