type UserLike = {
  email?: string | null;
  user_metadata?: {
    name?: string;
    full_name?: string;
  } | null;
};

export function getUserDisplayName(user?: UserLike | null) {
  const metadataName =
    user?.user_metadata?.full_name?.trim() || user?.user_metadata?.name?.trim();

  if (metadataName) {
    return metadataName;
  }

  const email = user?.email?.trim();

  if (!email) {
    return "Account";
  }

  return email.split("@")[0];
}
