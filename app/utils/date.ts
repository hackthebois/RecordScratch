import dayjs from "dayjs";
import DurationPlugin from "dayjs/plugin/duration";
import RelativeTimePlugin from "dayjs/plugin/relativeTime";
import TimezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(RelativeTimePlugin);
dayjs.extend(DurationPlugin);
dayjs.extend(TimezonePlugin);
dayjs.extend(utc);

export const timeAgo = (date: Date): string => {
	return dayjs(date).tz(dayjs.tz.guess()).fromNow();
};

export const isToday = (date: Date, tz: string): boolean => {
	const now = dayjs().tz(tz);
	return dayjs(date).tz(tz).isSame(now, "day");
};

export const isYesterday = (date: Date, tz: string): boolean => {
	const yesterday = dayjs().tz(tz).subtract(1, "day");
	return dayjs(date).tz(tz).isSame(yesterday, "day");
};

export const formatDuration = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);

	if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}s`;
	}
};
