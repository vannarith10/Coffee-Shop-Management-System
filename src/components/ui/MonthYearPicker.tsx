import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface MonthYearPickerProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MonthYearPicker = ({ month, year, onChange }: MonthYearPickerProps) => {
  const value = dayjs()
    .year(year)
    .month(month - 1);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker", "DatePicker"]}>
        <div className="w-36 ">
          <DatePicker
            sx={{ width: "100%" }}
            label="Month & Year"
            views={["year", "month"]}
            value={value}
            onChange={(newValue) => {
              if (newValue) {
                onChange(newValue.month() + 1, newValue.year());
              }
            }}
          />
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default MonthYearPicker;
