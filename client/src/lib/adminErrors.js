// Extracts a user-facing Arabic message from any axios error response,
// falling back to a generic message. Used across all admin manager screens
// so backend validation/reference errors (e.g. HTTP 409 on delete) are
// always shown clearly instead of a generic failure.
export function getErrorMessage(err, fallback = 'حدث خطأ ما، برجاء المحاولة مرة أخرى.') {
  return err?.response?.data?.message || fallback
}
