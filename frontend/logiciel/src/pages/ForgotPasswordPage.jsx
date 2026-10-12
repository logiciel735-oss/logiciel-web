import ForgotPasswordForm from "../features/auth/ui/ForgotPasswordForm";
import { useForgotPasswordForm } from "../features/auth/model/useForgotPasswordForm";

export default function ForgotPasswordPage() {
  const forgotPasswordForm = useForgotPasswordForm();

  return <ForgotPasswordForm {...forgotPasswordForm} />;
}
