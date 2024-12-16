import React, { MouseEventHandler, ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface IModalProps {
  title: string;
  subtitle?: string;
  show: boolean;
  onClose: MouseEventHandler;
  children: ReactNode;
  className?: string;
  headerContent?: string;
  zIndex?: number;
  hideCloseButton?: boolean;
}

export default function Modal({
  title,
  subtitle,
  show,
  onClose,
  children,
  className,
  headerContent,
  zIndex = 1111,
  hideCloseButton,
}: IModalProps) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={show}
      timeout={150}
      unmountOnExit
      classNames={{
        enter: 'opacity-0 scale-95',
        enterActive:
          'opacity-100 scale-100 transition-all ease-in duration-150',
        enterDone: 'opacity-100 scale-100',
        exit: 'opacity-50 scale-75 transition-all ease-out duration-150',
        exitActive: 'opacity-0 scale-50',
      }}
    >
      <div
        tabIndex={-1}
        className={`${show ? '' : ''} h-modal fixed inset-0 z-[11111] flex 
          h-screen w-screen justify-center overflow-y-auto overflow-x-hidden
          bg-grey-700/50 p-4 md:inset-0 md:h-full
      `}
        style={{ zIndex }}
      >
        <div ref={nodeRef} className="fixed inset-0 overflow-y-auto">
          <div
            className="flex min-h-full items-center 
            justify-center p-4"
          >
            <div
              className="relative flex h-full w-full
              max-w-2xl flex-col items-center justify-center md:h-auto"
            >
              <div
                className={`relative max-h-[calc(100vh-4rem)] w-[42rem] overflow-hidden
                   rounded-[20px] bg-white shadow ${className}`}
              >
                <div
                  className={`flex items-start justify-between
                    rounded-t-[20px] px-7 ${
                      !subtitle && title ? 'py-5' : 'py-5'
                    }`}
                >
                  {headerContent || (
                    <div className="space-y-1">
                      <h3 className="font-bold ">{title}</h3>
                      <p className="text-body-lg">{subtitle}</p>
                    </div>
                  )}

                  {!hideCloseButton && (
                    <button
                      type="button"
                      className="ml-auto inline-flex items-center 
                      rounded-lg bg-transparent p-1.5 text-sm
                      text-grey-800 hover:bg-grey-200 hover:text-grey-900"
                      onClick={onClose}
                    >
                      <i className="material-icons">close</i>
                      <span className="sr-only">Close modal</span>
                    </button>
                  )}
                </div>
                <div className="flex">
                  <div
                    className="scrollbar max-h-[calc(100vh-10rem)] grow overflow-y-auto
                      px-10 pb-5"
                  >
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
