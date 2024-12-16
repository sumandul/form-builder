/* eslint-disable import/prefer-default-export */
export function getStartDate() {
  const currentDate = new Date();
  //   currentDate.setDate(currentDate.getDate() - Number(dateValue));
  return `${currentDate.toISOString().split('T')[0]} 00:00:00`;
}
