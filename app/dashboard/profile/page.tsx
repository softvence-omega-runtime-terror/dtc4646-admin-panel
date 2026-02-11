
import ProfileClient from "@/components/ProfileClient";
import { getUser } from "@/lib/api/getUser";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <ProfileClient user={user} />;
}