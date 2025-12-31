// Helper for Badge Colors
export const getBadgeClass = (status: string) => {
  switch (status) {
    case "Done":
      return "status-badge done";
    case "In Progress":
      return "status-badge in-progress";
    case "In Review":
      return "status-badge in-review";
    default:
      return "status-badge incomplete";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
