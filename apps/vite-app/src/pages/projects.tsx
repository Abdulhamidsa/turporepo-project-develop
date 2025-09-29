import { AuthProvider } from '../../context/AuthContext';
import ProjectsGallery from '../components/ProjectsGallery';

export default function Projects() {
  return (
    <AuthProvider>
      <ProjectsGallery />
    </AuthProvider>
  );
}
