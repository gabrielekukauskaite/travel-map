export const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString("en-GB", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });
};
