'use client';

import { Briefcase, Calendar, Globe } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  userProfile: any;
}

export default function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* CV Header Section */}
      <div className="bg-card p-6 sm:p-8 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Profile Picture */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg border-2 border-muted overflow-hidden bg-muted">
                {userProfile.profilePicture ? (
                  <Image
                    src={userProfile.profilePicture}
                    alt={userProfile.username || 'User'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl font-bold">
                    {(userProfile.username || 'NA').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Professional Badge */}
              {/* <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                PRO
              </div> */}
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-2 text-center lg:text-left space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
                {userProfile.username}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-lg sm:text-xl text-muted-foreground mb-4">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-medium">{userProfile.profession || 'Professional'}</span>
              </div>

              {userProfile.bio && (
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
                  {userProfile.bio}
                </p>
              )}
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {userProfile.countryOrigin && (
                <div className="flex items-center gap-2 bg-accent border border-border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{userProfile.countryOrigin}</span>
                </div>
              )}
              {userProfile.age && (
                <div className="flex items-center gap-2 bg-accent border border-border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{userProfile.age} years</span>
                </div>
              )}
              {userProfile.profession && (
                <div className="flex items-center gap-2 bg-primary bg-opacity-20 border border-primary border-opacity-30 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                  <span className="font-medium text-sm">{userProfile.profession}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Sections Divider */}
      <div className="bg-accent/50 px-4 sm:px-8 py-3 sm:py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider overflow-x-auto pb-1 sm:pb-0">
            <span>Professional Portfolio</span>
            <span className="hidden sm:inline">•</span>
            <span>{userProfile.profession || 'Developer'}</span>
            <span className="hidden sm:inline">•</span>
            <span>{userProfile.countryOrigin || 'Global'}</span>
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
