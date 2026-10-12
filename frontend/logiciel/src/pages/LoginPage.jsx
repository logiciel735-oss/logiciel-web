import LoginForm from "../features/auth/ui/LoginForm";
import { useLoginForm } from "../features/auth/model/useLoginForm";

export default function LoginPage() {
  const loginForm = useLoginForm();

  return <LoginForm {...loginForm} />;
}