import day from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import businessDays from 'dayjs-business-time';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

day.extend(businessDays);
day.extend(utc);
day.extend(timezone);
day.extend(customParseFormat);
day.extend(advancedFormat);
day.extend(isoWeek);

export { day as dayjs };
