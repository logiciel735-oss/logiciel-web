import { useAuth } from "../features/auth/model/useAuth";
import { useProfile } from "../features/auth/model/useProfile";
import ProfileForm from "../features/auth/ui/ProfileForm";

export default function ProfilePage() {

  const { user } = useAuth();

  const profileForm = useProfile();

  return (
    <ProfileForm
      {...profileForm}
      user={user}
    />
  );
}