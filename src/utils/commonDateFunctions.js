import { dayjs } from './dayjs';
import { addBusinessDaysToDate } from './utils';
import log from './logger';

const isWeekend = date => [0, 6].includes(date.getDay());

const midnight = date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const shouldDisableDate = (date, shippingCutoffHour) => {
  if (isWeekend(date)) {
    return true;
  }
  const midnightDate = midnight(date);
  const today = new Date();
  const midnightToday = midnight(today);
  if (midnightDate < midnightToday) {
    return true;
  }
  // Date is in user time zone, but we must consider date in NY tz for shipping hour cutoff.
  const dayjsNY = dayjs.tz(today, 'America/New_York');
  const dateNY = new Date(dayjsNY.year(), dayjsNY.month(), dayjsNY.date());
  if (midnightDate < dateNY) {
    return true;
  }
  const disabled = midnightDate.getTime() === dateNY.getTime() && dayjsNY.hour() >= shippingCutoffHour;
  if (disabled) {
    log.debug(`today is after cutoff hour in NY (${shippingCutoffHour}:00):`, dayjsNY.format());
  }
  return disabled;
};

const minimumShippingDate = (date, shippingCutoffHour) =>
  shouldDisableDate(date, shippingCutoffHour) ? addBusinessDaysToDate(date, 1) : date;

const minimumProductionDate = () => dayjs().add(4, 'weeks');

export { isWeekend, shouldDisableDate, minimumShippingDate, minimumProductionDate };
