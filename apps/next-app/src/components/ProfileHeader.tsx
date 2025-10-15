'use client';

import { Briefcase, Calendar, Globe } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  userProfile: any; // Accept raw user data directly
}

export default function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Profile Header Section - Mobile First */}
      <div className="bg-card p-4 sm:p-6 md:p-8 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-center">
          {/* Profile Picture - Better Mobile Layout */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg border-2 border-muted overflow-hidden bg-muted">
                {userProfile?.profilePicture ? (
                  <Image
                    src={userProfile.profilePicture}
                    alt={userProfile.username || 'User'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl sm:text-3xl font-bold">
                    {(userProfile?.username || 'NA').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Info - Responsive Text Sizes */}
          <div className="md:col-span-2 text-center md:text-left space-y-3 md:space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
                {userProfile?.username}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-base sm:text-lg md:text-xl text-muted-foreground mb-2 md:mb-4">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="font-medium">{userProfile?.profession || 'Professional'}</span>
              </div>

              {userProfile?.bio && (
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
                  {userProfile.bio}
                </p>
              )}
            </div>

            {/* Quick Info Tags - Better Mobile Layout */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
              {userProfile?.countryOrigin && (
                <div className="flex items-center gap-1.5 md:gap-2 bg-accent border border-border rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="font-medium text-xs sm:text-sm">
                    {userProfile.countryOrigin}
                  </span>
                </div>
              )}
              {userProfile?.age && (
                <div className="flex items-center gap-1.5 md:gap-2 bg-accent border border-border rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="font-medium text-xs sm:text-sm">{userProfile.age} years</span>
                </div>
              )}
              {userProfile?.profession && (
                <div className="flex items-center gap-1.5 md:gap-2 bg-primary/20 border border-primary/30 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
                  <span className="font-medium text-xs sm:text-sm">{userProfile.profession}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections Divider - Better Mobile Layout */}
      <div className="bg-accent/50 px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            <span>Professional Portfolio</span>
            <span className="hidden sm:inline">•</span>
            <span>{userProfile?.profession || 'Developer'}</span>
            <span className="hidden sm:inline">•</span>
            <span>{userProfile?.countryOrigin || 'Global'}</span>
          </div>
          <div className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
