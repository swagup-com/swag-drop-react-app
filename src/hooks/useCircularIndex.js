import { useState, useCallback } from 'react';

const useCircularIndex = (initialIndex = 0, length) => {
  const [index, setIndex] = useState(Math.max(initialIndex, 0));

  const next = useCallback(() => setIndex((index + 1) % length), [index, length]);
  const previous = useCallback(() => setIndex((index - 1 + length) % length), [index, length]);

  return [index, previous, next];
};

export { useCircularIndex };
