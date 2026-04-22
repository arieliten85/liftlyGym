import { useUserStore } from "@/features/auth/store/userStore";
import { Redirect } from "expo-router";

export default function Index() {
  const user = useUserStore((s) => s.user);

  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(onboarding)" />;
}
