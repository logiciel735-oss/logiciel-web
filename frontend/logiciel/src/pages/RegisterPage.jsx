import RegisterForm from "../features/auth/ui/RegisterForm";
import { useRegisterForm } from "../features/auth/model/useRegisterForm";

export default function RegisterPage() {
  const registerForm = useRegisterForm();

  return <RegisterForm {...registerForm} />;
}