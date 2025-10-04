import React from 'react';

type DateFilterProps = {
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
};

const DateFilter = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: DateFilterProps) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">
          Month
          <span className="required-indicator sr-only"> (required)</span>
        </label>
        <select
          title="Month"
          className="form-select"
          id="monthSelect"
          required
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">- Select a Month -</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">
          Year
          <span className="required-indicator sr-only"> (required)</span>
        </label>
        <select
          title="Year"
          className="form-select"
          id="yearSelect"
          required
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">- Select a Year -</option>
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default DateFilter;
