/* eslint-disable no-unused-vars */
import { createPortal } from 'react-dom';
import { useEffect, HTMLAttributes } from 'react';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';

/**
 * This is a functional component called `PortalTemplate` that takes in a prop called `children` of
 * type `IDivProps`. It creates two variables `backdropNode` and `portalNode` by getting the elements
 * with ids `backdrop-root` and `overlay-root` respectively. */

function PortalTemplate({ children }: HTMLAttributes<HTMLDivElement>) {
  const portalNode = document.getElementById('overlay-root');

  useEffect(() => {
    const { body } = document;

    return () => {
      document.body.style.overflow = 'auto';
      body.style.paddingRight = '0px';
    };
  }, []);

  return (
    <>
      {portalNode
        ? createPortal(
            <div className="fixed left-0 top-[4.25rem] z-50 h-screen w-[21.25rem] bg-opacity-0">
              <div className="overlay-container relative h-full w-full ">
                {children}
              </div>
            </div>,
            portalNode,
          )
        : null}
    </>
  );
}
export default hasErrorBoundary(PortalTemplate);
