// src/components/MeasureWrapper.tsx
import React, { useLayoutEffect, useRef, ReactNode } from 'react';

interface MeasureWrapperProps {
  children: ReactNode;
  sectionKey: string;
  onHeightReady: (key: string, height: number) => void;
}

const MeasureWrapper: React.FC<MeasureWrapperProps> = ({ children, sectionKey, onHeightReady }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      // Get height including padding and border, but not margin
      const height = ref.current.offsetHeight;
      onHeightReady(sectionKey, height);
    }
    // Rerun if children change, as that could change height.
    // onHeightReady and sectionKey are usually stable.
  }, [children, sectionKey, onHeightReady]);

  return <div ref={ref}>{children}</div>;
};

export default MeasureWrapper;
