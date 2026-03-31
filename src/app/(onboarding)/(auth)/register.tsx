import RegisterScreen from "@/features/auth/register/Registerscreen";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { router } from "expo-router";

export default function RegisterRoute() {
  const onRegisterSuccess = () => {
    const payload = useBuildRoutineStore.getState().getQuickPayload();

    if (payload) {
      router.replace("/(onboarding)/(build-routine)/generating");
    } else {
      router.replace("/(app)/(tabs)/routines");
    }
  };

  return <RegisterScreen onSuccess={onRegisterSuccess} />;
}
