'use client';

import { useEffect, useRef, useState } from 'react';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

type TimeFormat = {
  hours?: number;
  minutes?: number;
  seconds?: number;
};

type TimerStatus = 'initialized' | 'running' | 'paused' | 'finished';

type UseTimerProps = {
  time: TimeFormat;
};

type UseTimerReturn = {
  run: () => void;
  pause: () => void;
  reset: () => void;
  timerStatus?: TimerStatus;
  leftTime: Required<TimeFormat>;
};

export const useTimerHook = ({ time }: UseTimerProps): UseTimerReturn => {
  const [leftTime, setLeftTime] = useState(0);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>();
  const intervalTimerId = useRef<NodeJS.Timeout>();

  const initialize = () => {
    setTimerStatus('initialized');

    if (time instanceof Date) {
      const currentTime = Date.now();
      const targetTime = time.getTime();
      const diff = targetTime - currentTime;

      return setLeftTime(diff);
    }

    const { hours, minutes, seconds } = time;

    setLeftTime(
      (hours ? MILLISECOND_TIME_FORMAT.hours(hours) : 0) +
        (minutes ? MILLISECOND_TIME_FORMAT.minutes(minutes) : 0) +
        (seconds ? MILLISECOND_TIME_FORMAT.seconds(seconds) : 0)
    );
  };

  const run = () => {
    setTimerStatus('running');
  };

  const pause = () => {
    setTimerStatus('paused');
    stopTimer();
  };

  const reset = () => {
    initialize();
  };

  const stopTimer = () => {
    clearInterval(intervalTimerId.current);
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timerStatus === 'running') {
      intervalTimerId.current = setInterval(() => {
        setLeftTime(prev => {
          if (prev === 1000) return 0;

          return prev - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(intervalTimerId.current);
  }, [timerStatus]);

  useEffect(() => {
    if (leftTime === 0) {
      setTimerStatus(prev => {
        if (prev === 'running') return 'finished';

        return prev;
      });
      stopTimer();
    }
  }, [leftTime]);

  return {
    run,
    pause,
    reset,
    timerStatus,
    leftTime: {
      hours: Math.floor(leftTime / MILLISECOND_TIME_FORMAT.hours(1)),
      minutes: Math.floor(
        (leftTime % MILLISECOND_TIME_FORMAT.hours(1)) / MILLISECOND_TIME_FORMAT.minutes(1)
      ),
      seconds: Math.floor(
        (leftTime % MILLISECOND_TIME_FORMAT.minutes(1)) / MILLISECOND_TIME_FORMAT.seconds(1)
      ),
    },
  };
};
