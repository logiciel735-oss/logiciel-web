import ResetPasswordForm from "../features/auth/ui/ResetPasswordForm";
import { useResetPasswordForm } from "../features/auth/model/useResetPasswordForm";

export default function ResetPasswordPage() {
  const resetPasswordForm = useResetPasswordForm();

  return <ResetPasswordForm {...resetPasswordForm} />;
}
