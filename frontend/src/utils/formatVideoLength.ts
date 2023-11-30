export const formatVideoLength = (length: number): string => {
  const hours = Math.floor(length / 3600);
  const minutes = Math.floor((length % 3600) / 60);
  const seconds = length % 60;

  const formattedHours = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
    const formattedMinutes = minutes > 0 ? `${minutes.toString().padStart(2, "0")}:` : "00:";
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
};
