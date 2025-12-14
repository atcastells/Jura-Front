import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm, AuthLayout } from "@/auth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from state, or default to dashboard
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <AuthLayout title="Sign in to Jura" subtitle="Your AI Career Agent">
      <LoginForm onSuccess={handleSuccess} onSignUpClick={handleSignUpClick} />
    </AuthLayout>
  );
};
