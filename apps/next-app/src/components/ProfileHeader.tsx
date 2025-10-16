'use client';

import { Badge } from '@repo/ui/components/ui/badge';
import { Briefcase, Calendar, GitHub, Globe, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getProfileImageUrl } from '../utils/imageOptimization';

interface ProfileHeaderProps {
  userProfile: any; // Accept raw user data directly
}

export default function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  // Using imported utility function for profile images

  return (
    <>
      {/* Modern Hero Banner with Image */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/hero-bg.png"
          alt="Profile header background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background"></div>
      </div>

      {/* Modern Profile Header */}
      <div className="relative px-4 sm:px-6 md:px-8 pb-6 -mt-20 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Profile Picture with Prominent Positioning */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div className="relative z-10 mx-auto md:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-card shadow-lg overflow-hidden bg-card">
                {userProfile?.profilePicture ? (
                  <Image
                    src={getProfileImageUrl(userProfile.profilePicture, 512)}
                    alt={userProfile.username || 'User'}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    priority
                    quality={95}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl sm:text-5xl font-bold">
                    {(userProfile?.username || 'NA').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Main Profile Info */}
            <div className="flex-1 text-center md:text-left pt-2 md:pt-0 pb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                {userProfile?.username}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-xl text-muted-foreground">
                <Briefcase className="h-5 w-5" />
                <span>{userProfile?.profession || 'Professional'}</span>
              </div>
            </div>
          </div>

          {/* Detailed Profile Information */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Bio Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold mb-3">About</h2>
                {userProfile?.bio ? (
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {userProfile.bio}
                  </p>
                ) : (
                  <p className="text-muted-foreground">This user hasn&apos;t added a bio yet.</p>
                )}
              </div>
            </div>

            {/* Details Column */}
            <div className="space-y-4">
              {/* Info Card */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Details</h2>
                <ul className="space-y-3">
                  {userProfile?.countryOrigin && (
                    <li className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{userProfile.countryOrigin}</p>
                      </div>
                    </li>
                  )}

                  {userProfile?.profession && (
                    <li className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Profession</p>
                        <p className="font-medium">{userProfile.profession}</p>
                      </div>
                    </li>
                  )}

                  {userProfile?.age && (
                    <li className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">{userProfile.age} years</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Skills Section */}
              {userProfile?.skills?.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {userProfile.skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="px-2.5 py-0.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {userProfile?.socialLinks && (
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Connect</h2>
                  <div className="flex gap-3">
                    {userProfile.socialLinks.github && (
                      <Link
                        href={userProfile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent hover:bg-accent/80 p-2.5 rounded-lg transition-colors"
                      >
                        <GitHub className="w-5 h-5" />
                      </Link>
                    )}

                    {userProfile.socialLinks.twitter && (
                      <Link
                        href={userProfile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent hover:bg-accent/80 p-2.5 rounded-lg transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </Link>
                    )}

                    {userProfile.socialLinks.linkedin && (
                      <Link
                        href={userProfile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent hover:bg-accent/80 p-2.5 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section Header */}
      <div className="bg-accent/50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t border-b border-border mt-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Portfolio Projects</h2>
            <p className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
