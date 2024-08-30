export enum Period {
  Day = "Day",
  Week = "Week",
  Month = "Month",
  Year = "Year",
  Hour = "Hour",
  Minute = "Minute",
  Second = "Second",
}

export type MonthOrYear = Period.Month | Period.Year;
export type DayOrMonth = Period.Day | Period.Month;
export type DayOrMonthOrYear = DayOrMonth | Period.Year;
