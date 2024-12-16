/* eslint-disable no-unused-vars */
import { createPortal } from 'react-dom';
import { useEffect, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import hasErrorBoundary from '../hasErrorBoundary';

const backDropAnimation = {
  initial: { opacity: 0.3 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: 'easeIn', delay: 0 },
};

/**
 * This is a functional component called `PortalTemplate` that takes in a prop called `children` of
 * type `IDivProps`. It creates two variables `backdropNode` and `portalNode` by getting the elements
 * with ids `backdrop-root` and `overlay-root` respectively. */

function PortalTemplate({ children, style }: HTMLAttributes<HTMLDivElement>) {
  const backdropNode = document.getElementById('backdrop-root');
  const portalNode = document.getElementById('overlay-root');

  useEffect(() => {
    const { body } = document;
    // body.style.overflow = 'hidden';
    // body.style.paddingRight = '17px';

    return () => {
      document.body.style.overflow = 'auto';
      body.style.paddingRight = '0px';
    };
  }, []);

  return (
    <>
      {backdropNode
        ? createPortal(
            <motion.div
              {...backDropAnimation}
              className="fixed left-0 top-0 z-50  h-screen w-screen bg-black bg-opacity-50"
              style={style}
            />,
            backdropNode,
          )
        : null}
      {portalNode
        ? createPortal(
            <div
              className="fixed left-0 top-0 z-50 h-screen w-screen bg-opacity-0"
              style={style}
            >
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
