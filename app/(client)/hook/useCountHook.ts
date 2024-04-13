import { useEffect, useState } from 'react';

type UseCountHookProps = {
  start?: number;
  end: number;
  duration?: number;
};

type UseCountHookReturn = {
  count: number;
};

export const useCountHook = ({
  start,
  duration = 2000,
  end,
}: UseCountHookProps): UseCountHookReturn => {
  const [count, setCount] = useState(start ?? 0);
  const frameRate = 1000 / 60;
  const totalFrame = Math.round(duration / frameRate);

  useEffect(() => {
    let currentNumber = start ?? 0;

    const counter = setInterval(() => {
      const progress = easeOutExpo(++currentNumber / totalFrame);

      setCount(Math.round(end * progress));

      if (progress === 1) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => {
      clearInterval(counter);
    };
  }, [end, frameRate, start, totalFrame]);

  return { count };
};

const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};
