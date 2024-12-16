import React from 'react';
import Portal from '@Components/common/Portal';
import Image from '@Components/RadixComponents/Image';
import modalImage from '@Assets/images/modalImage.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypedSelector } from '@Store/hooks';
import { FlexRow } from '../Layouts';

interface IBannerModalProps {
  onClose: () => void;
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function BannerModal({
  onClose,
  show,
  children,
  className,
}: IBannerModalProps) {
  const bannerModalContent = useTypedSelector(
    state => state.common.bannerModalContent,
  );
  return (
    <>
      <AnimatePresence>
        {show ? (
          <Portal
            overlayComponent={
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.25 }}
                className={`relative h-[30.75rem] min-w-[50.75rem] max-w-[50rem] overflow-hidden rounded-[1.25rem] border bg-white ${className}`}
              >
                {/* Modal Title */}
                <FlexRow className="h-full">
                  <Image src={modalImage} className="h-[30.75rem]" />
                  <div>
                    <div className="flex w-[31.86rem] items-center justify-end p-3">
                      <div className="h-11 w-11 p-3">
                        <span
                          role="button"
                          tabIndex={0}
                          onKeyDown={() => {}}
                          className="material-icons absolute right-4 top-4 cursor-pointer"
                          onClick={() => {
                            if (bannerModalContent === 'home-banner') {
                              localStorage.setItem(
                                'homeBannerViewedDate',
                                new Date().toISOString(),
                              );
                            }
                            onClose();
                          }}
                        >
                          close
                        </span>
                      </div>
                    </div>
                    <div>{children}</div>
                  </div>
                </FlexRow>
              </motion.div>
            }
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
