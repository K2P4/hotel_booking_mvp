export function handleError<T>(data: T, error: { message: string } | null) {
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
