export function getErrorMessage(err) {
  return err?.response?.data?.message ?? err?.message ?? "An unexpected error occurred";
}

export function formatRating(val) {
  if (val === null || val === undefined) return "No ratings yet";
  return Number(val).toFixed(1);
}

export function roleBadgeClass(role) {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-700";
    case "STORE_OWNER":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
}

export function roleLabel(role) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "STORE_OWNER":
      return "Store Owner";
    default:
      return "User";
  }
}
