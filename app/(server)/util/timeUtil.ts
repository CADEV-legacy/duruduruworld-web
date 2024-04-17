import { MILLISECOND_TIME_FORMAT } from '@/constant';

type TimeType = 'millisecond' | 'second' | 'minute';

type GetNumericTimeParams = {
  type: TimeType;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
};

/** NOTE: Return numeric time with selected unit (default is millisecond)   */
export const getNumericTime = ({ type, day, hour, minute, second }: GetNumericTimeParams) => {
  const timeToMillSecond =
    (day ? MILLISECOND_TIME_FORMAT.days(day) : 0) +
    (hour ? MILLISECOND_TIME_FORMAT.hours(hour) : 0) +
    (minute ? MILLISECOND_TIME_FORMAT.minutes(minute) : 0) +
    (second ? MILLISECOND_TIME_FORMAT.seconds(second) : 0);

  switch (type) {
    case 'millisecond':
      return timeToMillSecond;
    case 'second':
      return timeToMillSecond / 1000;
    case 'minute':
      return timeToMillSecond / 1000 / 60;
    default:
      return timeToMillSecond;
  }
};

const getZeroPadding = (value: number) => (value >= 10 ? value : `0${value}`);

export const getFullDate = (date: Date) => {
  const fullYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${fullYear}-${getZeroPadding(month)}-${getZeroPadding(day)} 00:00:00`;
};

export const getFullDateWithTime = (date: Date) => {
  const fullYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${fullYear}-${getZeroPadding(month)}-${getZeroPadding(day)} ${getZeroPadding(hour)}:${getZeroPadding(minute)}:${getZeroPadding(second)}`;
};
