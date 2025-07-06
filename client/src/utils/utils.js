import { StatusCodes } from "http-status-codes";

export function showFormErrors(error, form) {
     if (error?.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          for (const [key, errorValue] of Object.entries(error.response.data.errors)) {
               form.setFieldError(key, errorValue);
          }
     }
}

export function showValueOrBlank(value) {
     if (["", null, undefined, "Invalid date"].includes(value)) return "-";
     return value;
}

export function formatCurrency(value, prefix) {
     const output = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0
     }).format(value ?? 0);

     if (prefix) return output.replace("₹", prefix);
     return output;
}

export function classMerge(...classes) {
     return classes.filter(Boolean).join(" ");
}

export function formatTimeFriendly(seconds) {
     if (seconds < 60) {
          const roundedSec = Math.ceil(seconds / 10) * 10;
          return `${roundedSec} seconds`;
     }

     const rawMinutes = seconds / 60;
     const roundedMinutes = Math.round(rawMinutes);

     if (roundedMinutes < 5) {
          return `${roundedMinutes} minute${roundedMinutes === 1 ? "" : "s"}`;
     }

     const smoothed = Math.round(roundedMinutes / 5) * 5;
     return `${smoothed} minutes`;
}
