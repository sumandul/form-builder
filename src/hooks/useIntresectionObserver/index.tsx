import { useEffect, useRef, useState } from 'react';

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  onChange?: (
    // eslint-disable-next-line no-unused-vars
    isIntersecting: boolean,
    // eslint-disable-next-line no-unused-vars
    entry: IntersectionObserverEntry,
  ) => void;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [
  // eslint-disable-next-line no-unused-vars
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined,
] & {
  // eslint-disable-next-line no-unused-vars
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

// eslint-disable-next-line import/prefer-default-export
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const [ref, setRef] = useState<Element | null>(null);

  const [state, setState] = useState<State>(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }));

  const callbackRef = useRef<UseIntersectionObserverOptions['onChange']>();

  callbackRef.current = onChange;

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    // Ensure we have a ref to observe
    if (!ref) return;

    // Ensure the browser supports the Intersection Observer API
    if (!('IntersectionObserver' in window)) return;

    // Skip if frozen
    if (frozen) return;

    let unobserve: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach(entry => {
          const isIntersecting =
            entry.isIntersecting &&
            // eslint-disable-next-line no-shadow
            thresholds.some(threshold => entry.intersectionRatio >= threshold);

          setState({ isIntersecting, entry });

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin },
    );

    observer.observe(ref);

    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ref,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    freezeOnceVisible,
  ]);

  // ensures that if the observed element changes, the intersection observer is reinitialized
  const prevRef = useRef<Element | null>(null);

  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);

  const result = [
    setRef,
    !!state.isIntersecting,
    state.entry,
  ] as IntersectionReturn;

  // Support object destructuring, by adding the specific values.
  // eslint-disable-next-line prefer-destructuring
  result.ref = result[0];
  // eslint-disable-next-line prefer-destructuring
  result.isIntersecting = result[1];
  // eslint-disable-next-line prefer-destructuring
  result.entry = result[2];

  return result;
}
