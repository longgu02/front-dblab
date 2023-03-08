export function getFormatedTime(dateObj: Date) {
  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = year + "-" + month + "-" + day;
  return output;
}
