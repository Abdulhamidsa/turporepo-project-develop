import { AuthProvider } from '../../../../context/AuthContext';
import UsersGallery from '../../../components/UsersGallery';

export default function UsersPage() {
  return (
    <AuthProvider>
      <UsersGallery />
    </AuthProvider>
  );
}
