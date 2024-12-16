/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useCallback } from 'react';

export default function DevTool() {
  const [outline, setOutline] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 40,
    y: 10,
  });
  const [dragable, setDragable] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('dev_tool_outline') === 'true') setOutline(true);
  }, []);

  // Debounce function
  const debounce = (func: any, delay: number) => {
    let timeoutId: any;

    // @ts-expect-error - no type
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleMouseMove = useCallback((e: any) => {
    const { clientX, clientY } = e;
    setPosition({ x: clientX, y: clientY });
  }, []);

  const debouncedHandleMouseMove = useCallback(debounce(handleMouseMove, 50), [
    handleMouseMove,
  ]);

  useEffect(() => {
    if (!dragable) return () => {};

    document.addEventListener('mousemove', debouncedHandleMouseMove);
    return () => {
      document.removeEventListener('mousemove', debouncedHandleMouseMove);
    };
  }, [dragable, debouncedHandleMouseMove]);

  useEffect(() => {
    const { body } = document;
    const elements = body.querySelectorAll('*');

    if (outline) {
      elements.forEach(element => {
        // @ts-expect-error - no type
        element.style.outline = '1px solid #ff7f7f';
      });
      localStorage.setItem('dev_tool_outline', 'true');
    } else {
      elements.forEach(element => {
        // @ts-expect-error - no type
        element.style.outline = 'none';
      });
      localStorage.removeItem('dev_tool_outline');
    }
  }, [outline]);

  return (
    <div
      style={{
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -10%)',
        cursor: dragable ? 'grabbing' : 'default',
      }}
      className="bg-blur-[10px] min-h-6 min-w-5  fixed z-[10000] rounded-sm bg-[#000000] p-[1px] text-white opacity-30 transition-all duration-200 ease-in-out hover:opacity-100"
    >
      <button
        type="button"
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          setDragable(true);
        }}
        onMouseUp={() => {
          setDragable(false);
        }}
        onClick={() => {
          setDragable(false);
        }}
        className="cursor-grab"
        style={{
          cursor: dragable ? 'grabbing' : 'grab',
          userSelect: dragable ? 'none' : 'all',
        }}
      >
        <span className="material-symbols-outlined text-white">
          drag_handle
        </span>
      </button>
      <p className="mb-1 w-full text-center text-[8px] font-medium text-white">
        DEV
      </p>
      <div className="actions flex flex-col items-center justify-center">
        <button
          type="button"
          className="m-1 h-3 w-full border border-[#ff7f7f] bg-[#f1f1f1] bg-opacity-50"
          title="outline"
          onClick={() => setOutline(prev => !prev)}
        >
          {' '}
        </button>
      </div>
    </div>
  );
}
