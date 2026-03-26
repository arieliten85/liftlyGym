import LoginScreen from "@/features/auth/login/LoginScreen";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { router } from "expo-router";

export default function LoginRoute() {
  const onLoginSuccess = () => {
    const payload = useBuildRoutineStore.getState().getQuickPayload();

    if (payload) {
      router.replace("/(onboarding)/(build-routine)/generating");
    } else {
      router.replace("/(app)/(tabs)/rutinas");
    }
  };

  return <LoginScreen onSuccess={onLoginSuccess} />;
}
