export function getAuthErrorMessage(errorMessage: string) {
  const normalizedMessage = errorMessage.trim().toLowerCase();

  if (normalizedMessage.includes("email rate limit exceeded")) {
    return "Too many confirmation emails were requested recently. Please wait a minute and try again.";
  }

  if (normalizedMessage.includes("rate limit exceeded")) {
    return "Too many auth requests were made recently. Please wait a minute and try again.";
  }

  if (normalizedMessage.includes("email address not authorized")) {
    return "This project cannot send auth emails to that address yet. Use an authorized team email or configure custom SMTP.";
  }

  return errorMessage;
}
