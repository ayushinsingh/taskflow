import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

// The function reads Date.now(), so "now" has to be pinned or every assertion
// drifts with the wall clock.
const NOW = new Date("2026-08-10T12:00:00.000Z");

const isoOffsetFromNow = (ms: number) =>
  new Date(NOW.getTime() + ms).toISOString();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats a time in the recent past", () => {
    expect(formatRelativeTime(isoOffsetFromNow(-3 * DAY))).toBe("3 days ago");
  });

  it("formats a time in the future", () => {
    expect(formatRelativeTime(isoOffsetFromNow(2 * HOUR))).toBe("in 2 hours");
  });

  it("uses the largest unit that fits", () => {
    // 100 minutes is under a day, so it reads in hours rather than minutes.
    expect(formatRelativeTime(isoOffsetFromNow(-100 * MINUTE))).toBe(
      "2 hours ago",
    );
  });

  it("rounds toward positive infinity on an exact half unit", () => {
    // Math.round(-1.5) is -1, not -2, so 90 minutes ago reads as one hour --
    // while 90 minutes ahead rounds up to two. Documented, not desirable.
    expect(formatRelativeTime(isoOffsetFromNow(-90 * MINUTE))).toBe(
      "1 hour ago",
    );
    expect(formatRelativeTime(isoOffsetFromNow(90 * MINUTE))).toBe(
      "in 2 hours",
    );
  });

  it("says 'now' for the current instant", () => {
    // numeric:"auto" is what turns "in 0 seconds" into this wording.
    expect(formatRelativeTime(NOW.toISOString())).toBe("now");
  });

  it("crosses into months for older timestamps", () => {
    expect(formatRelativeTime(isoOffsetFromNow(-60 * DAY))).toBe("2 months ago");
  });

  it("crosses into years for much older timestamps", () => {
    expect(formatRelativeTime(isoOffsetFromNow(-400 * DAY))).toBe("last year");
  });

  it("returns an empty string for an unparseable date", () => {
    expect(formatRelativeTime("not a date")).toBe("");
    expect(formatRelativeTime("")).toBe("");
  });
});
