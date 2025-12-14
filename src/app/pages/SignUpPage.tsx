import { useNavigate } from "react-router-dom";
import { SignUpForm, AuthLayout } from "@/auth";

export const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // After successful signup, redirect to login
    navigate("/login", {
      state: { message: "Account created successfully. Please sign in." },
    });
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join Jura today">
      <SignUpForm onSuccess={handleSuccess} onSignInClick={handleSignInClick} />
    </AuthLayout>
  );
};
