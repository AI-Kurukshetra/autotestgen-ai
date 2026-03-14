const DEFAULT_APP_URL = "http://localhost:3000";

function normalizeAppUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return DEFAULT_APP_URL;
  }

  const urlWithProtocol =
    trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")
      ? trimmedValue
      : trimmedValue.startsWith("localhost") || trimmedValue.startsWith("127.0.0.1")
        ? `http://${trimmedValue}`
        : `https://${trimmedValue}`;

  return urlWithProtocol.endsWith("/")
    ? urlWithProtocol.slice(0, -1)
    : urlWithProtocol;
}

export function getAppUrl() {
  const envAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (envAppUrl) {
    return normalizeAppUrl(envAppUrl);
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return normalizeAppUrl(window.location.origin);
  }

  return DEFAULT_APP_URL;
}

export function getDashboardUrl() {
  return `${getAppUrl()}/dashboard`;
}

export function getPasswordUpdateUrl() {
  return `${getAppUrl()}/auth/update-password`;
}
