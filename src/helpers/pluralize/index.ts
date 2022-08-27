import logger from "../../middlewares/logger";

export default (count: number, noun: string, suffix?: string): string => {
  const result = `${count} ${noun}${count !== 1 ? suffix || "s" : ""}`;
  logger?.silly(`Pluralized ${count} to ${result}`);
  return result;
};
