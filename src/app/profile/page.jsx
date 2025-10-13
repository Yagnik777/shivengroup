"use client";

import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  // No auto-fetch, user fills manually
  const userData = null;

  return <UserProfile initialData={userData} />;
}
