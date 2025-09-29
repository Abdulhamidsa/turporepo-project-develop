import { useEffect, useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { Briefcase, Clock, Users } from 'lucide-react';

import { swrFetcher } from '../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

interface UserType {
  id: string;
  username: string;
  profession: string;
  friendlyId: string | null;
}

interface ProjectType {
  id: string;
  title: string;
  description: string;
}

export default function PlatformStats() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersResponse = await swrFetcher<{
          users: UserType[];
          pagination: {
            total: number;
          };
        }>(`${ENDPOINTS.users.fetchAll}?limit=1`);

        // Fetch projects count
        const projectsResponse = await swrFetcher<{
          projects: ProjectType[];
          pagination: {
            total: number;
          };
        }>(`${ENDPOINTS.projects.fetchAll}?limit=1`);

        setStats({
          users: usersResponse?.pagination?.total || 0,
          projects: projectsResponse?.pagination?.total || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-12 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time insights into our growing community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center">
            <div className="bg-primary/10 rounded-full p-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {stats.loading ? (
                <div className="h-9 w-16 bg-muted animate-pulse rounded-md mx-auto"></div>
              ) : (
                stats.users.toLocaleString()
              )}
            </h3>
            <p className="text-muted-foreground">Active Users</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center">
            <div className="bg-secondary/10 rounded-full p-3 mb-4">
              <Briefcase className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {stats.loading ? (
                <div className="h-9 w-16 bg-muted animate-pulse rounded-md mx-auto"></div>
              ) : (
                stats.projects.toLocaleString()
              )}
            </h3>
            <p className="text-muted-foreground">Total Projects</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center">
            <div className="bg-accent/10 rounded-full p-3 mb-4">
              <Clock className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-3xl font-bold mb-1">24/7</h3>
            <p className="text-muted-foreground">Platform Availability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
