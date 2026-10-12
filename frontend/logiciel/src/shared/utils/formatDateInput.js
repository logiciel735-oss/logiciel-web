export function formatDateInput(value) {
  if (!value) return "";

  // Firebase Timestamp
  if (value?.toDate) {
    return value
      .toDate()
      .toISOString()
      .split("T")[0];
  }

  // JS Date
  if (value instanceof Date) {
    return value
      .toISOString()
      .split("T")[0];
  }

  // String ISO
  if (typeof value === "string") {
    return value.split("T")[0];
  }

  return "";
}