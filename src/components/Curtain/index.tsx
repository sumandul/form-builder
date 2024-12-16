export {};

// import { useCallback, useEffect, useState } from 'react';
// import Confetti from 'react-confetti';
// import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
// import { setCurtainState } from '@Store/actions/curtain';
// import useWindowDimensions from '@Hooks/useWindowDimensions';
// import Ribbon from './ribbon.png';
// import './index.css';

// export default function Curtain() {
//   const dispatch = useTypedDispatch();
//   const [showConfetti, setShowConfetti] = useState(false);
//   const expandCurtain = useTypedSelector(state => state.curtain.expandCurtain);

//   const { width, height } = useWindowDimensions();

//   const closeStarter = useCallback(() => {
//     setTimeout(() => {
//       const starter = document.getElementById('starter');
//       if (starter) starter.style.display = 'none';
//       dispatch(setCurtainState({ openCurtain: false }));
//     }, 5000);
//   }, [dispatch]);

//   const curtainOpenHandler = useCallback(
//     (event: React.KeyboardEvent<HTMLDivElement>) => {
//       const key = event.key.toUpperCase();
//       if (key === 'ENTER' || key === ' ') {
//         dispatch(setCurtainState({ expandCurtain: true }));
//         setShowConfetti(true);
//         closeStarter();
//       }
//     },
//     [dispatch, closeStarter],
//   );

//   const curtainOpenThroughMouseHandler = useCallback(() => {
//     dispatch(setCurtainState({ expandCurtain: true }));
//     setShowConfetti(true);
//     closeStarter();
//   }, [dispatch, closeStarter]);

//   useEffect(() => {
//     const starter = document.getElementById('starter');
//     if (starter) starter.focus();
//     const handleKeyPress = (event: any) => {
//       curtainOpenHandler(event);
//     };
//     const handleClick = () => {
//       curtainOpenThroughMouseHandler();
//     };
//     document.addEventListener('keypress', handleKeyPress);
//     document.addEventListener('click', handleClick);
//     return () => {
//       document.removeEventListener('keypress', handleKeyPress);
//       document.removeEventListener('click', handleClick);
//     };
//   }, [curtainOpenHandler, curtainOpenThroughMouseHandler]);

//   return (
//     <>
//       {/* <!-- ribbon --> */}
//       <div id="starter" className={expandCurtain ? 'fade-out' : ''}>
//         <img id="starter-img" src={Ribbon} alt="" />
//       </div>

//       {/* <!-- curtain --> */}
//       <div id="scene" className={expandCurtain ? 'expand' : ''}>
//         <div id="curtain" className={`${expandCurtain ? 'open' : ''}`}>
//           <div className={`left ${expandCurtain ? 'curtain-opening' : ''}`} />
//           <div className={`right ${expandCurtain ? 'curtain-opening' : ''}`} />
//         </div>
//       </div>

//       {/* <!-- confetti --> */}
//       {showConfetti && (
//         <Confetti
//           width={width}
//           height={height - 10}
//           numberOfPieces={3000}
//           recycle={false}
//           gravity={0.1}
//           onConfettiComplete={() => {
//             setShowConfetti(false);
//           }}
//         />
//       )}
//     </>
//   );
// }
