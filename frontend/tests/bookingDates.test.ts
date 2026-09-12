import test from "node:test";
import assert from "node:assert/strict";
import { dateKey, dateFromKey, stayNights, rangeUnavailable } from "../utils/bookingDates.ts";
function date(key: string) { const value = dateFromKey(key); assert.ok(value); return value; }
test("date parsing rejects impossible dates and accepts a leap day", () => {
  assert.equal(dateFromKey("2026-02-30"), null);
  assert.equal(dateFromKey("2026-02-29"), null);
  assert.equal(dateFromKey("2026-2-01"), null);
  assert.equal(dateKey(date("2028-02-29")), "2028-02-29");
});
test("night counts use calendar days across month/year and DST boundaries", () => {
  assert.equal(stayNights(date("2026-03-07"), date("2026-03-09")), 2);
  assert.equal(stayNights(date("2026-12-30"), date("2027-01-02")), 3);
  assert.equal(stayNights(date("2026-10-01"), date("2026-10-01")), 0);
});
test("a booking cannot cross an occupied date", () => {
  assert.equal(rangeUnavailable(date("2026-10-10"), date("2026-10-16"), ["2026-10-15"]), true);
  assert.equal(rangeUnavailable(date("2026-10-10"), date("2026-10-14"), ["2026-10-15"]), false);
});
test("both arrival and departure obey the existing API occupancy contract", () => {
  assert.equal(rangeUnavailable(date("2026-10-10"), date("2026-10-15"), ["2026-10-15"]), true);
  assert.equal(rangeUnavailable(date("2026-10-15"), date("2026-10-16"), ["2026-10-15"]), true);
});
