import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginApi, signupApi, type AuthResponse } from "@/api/auth";
import { saveAccessToken } from "@/utils/storage";

type LoginPayload = { email: string; password: string };
type SignupPayload = { name: string; email: string; password: string };

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await loginApi(payload);
      return data;
    },
    onSuccess: (data: AuthResponse) => {
      if (data?.data?.accessToken) {
        saveAccessToken(data.data.accessToken);
      }
      toast.success("Welcome back!", {
        description: "You've been signed in successfully.",
        duration: 3000,
      });
      navigate("/dashboard/home", { replace: true });
    },
    onError: (error: Error) => {
      toast.error("Sign in failed", {
        description: error.message || "Invalid email or password.",
        duration: 4000,
      });
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const data = await signupApi(payload);
      return data;
    },
    onSuccess: (data: AuthResponse) => {
      if (data?.data?.accessToken) {
        saveAccessToken(data.data.accessToken);
      }
      toast.success("Account created!", {
        description: "Your workspace has been initialized.",
        duration: 3000,
      });
      navigate("/dashboard/home", { replace: true });
    },
    onError: (error: Error) => {
      toast.error("Sign up failed", {
        description: error.message || "Could not create your account.",
        duration: 4000,
      });
    },
  });
};
