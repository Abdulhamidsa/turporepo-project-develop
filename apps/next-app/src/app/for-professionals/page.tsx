import type { Metadata } from 'next';

import ForProfessionals from '../../components/ForProfessionals';

export const metadata: Metadata = {
  title: 'For Professionals - ProFolio',
  description:
    'Learn how professionals can create and grow their portfolio effortlessly with ProFolio.',
};

export default function Page() {
  return <ForProfessionals />;
}
