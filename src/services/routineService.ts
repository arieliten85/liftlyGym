import axiosClient from "@/api/axiosClient";

export const generateRoutineOnboarding = async (payload: any) => {
  try {
    const response = await axiosClient.post(
      "/routines/generate-onboarding",
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error generating routine:", error);
    throw error;
  }
};
