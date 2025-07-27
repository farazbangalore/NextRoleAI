export class TimeUtils {
    static getTimeAgo(epochMillis: number): string {
        const now = Date.now();
        const diffMillis = now - epochMillis;

        if (diffMillis < 0) return "in the future";

        const seconds = Math.floor(diffMillis / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.44);  // average days in a month
        const years = Math.floor(days / 365.25); // accounting for leap years

        if (years >= 1) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months >= 1) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        if (days >= 1) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes >= 1) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
}
