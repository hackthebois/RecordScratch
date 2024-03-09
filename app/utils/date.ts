import dayjs from "dayjs";
import DurationPlugin from "dayjs/plugin/duration";
import isTodayPlugin from "dayjs/plugin/isToday";
import isYesterdayPlugin from "dayjs/plugin/isYesterday";
import RelativeTimePlugin from "dayjs/plugin/relativeTime";
import TimezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(RelativeTimePlugin);
dayjs.extend(DurationPlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(isYesterdayPlugin);
dayjs.extend(TimezonePlugin);
dayjs.extend(utc);

dayjs.tz.setDefault(dayjs.tz.guess());

export const timeAgo = (date: Date): string => {
	return dayjs(date).fromNow();
};

export const isToday = (date: Date, tz: string): boolean => {
	if (tz) return dayjs(date).tz(tz).isToday();
	return dayjs(date).isToday();
};

export const isYesterday = (date: Date, tz: string): boolean => {
	if (tz) return dayjs(date).tz(tz).isYesterday();
	return dayjs(date).isYesterday();
};

export const formatMs = (milliseconds: number): string => {
	const duration = dayjs.duration(milliseconds);
	const minutes = duration.minutes();
	const seconds = duration.seconds();

	if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}s`;
	}
};
