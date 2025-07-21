'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, Globe } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  userProfile: any;
}

export default function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* CV Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 border-b-4 border-indigo-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-lg border-4 border-indigo-400 shadow-2xl overflow-hidden bg-slate-600">
                {userProfile.profilePicture ? (
                  <Image
                    src={userProfile.profilePicture}
                    alt={userProfile.username || 'User'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300 text-3xl font-bold bg-slate-600">
                    {(userProfile.username || 'NA').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Professional Badge */}
              <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                PRO
              </div>
            </div>
          </motion.div>

          {/* Main Info */}
          <div className="lg:col-span-2 text-center lg:text-left space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                {userProfile.username}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-xl text-indigo-300 mb-4">
                <Briefcase className="w-6 h-6" />
                <span className="font-medium">
                  {userProfile.profession || 'Professional Developer'}
                </span>
              </div>

              {userProfile.bio && (
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  {userProfile.bio}
                </p>
              )}
            </motion.div>

            {/* Quick Info Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {userProfile.countryOrigin && (
                <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-200 font-medium text-sm">
                    {userProfile.countryOrigin}
                  </span>
                </div>
              )}
              {userProfile.age && (
                <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-200 font-medium text-sm">
                    {userProfile.age} years
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-indigo-600 border border-indigo-500 rounded-lg px-4 py-2">
                <span className="text-white font-medium text-sm">Available for hire</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CV Sections Divider */}
      <div className="bg-slate-750 px-8 py-4 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium uppercase tracking-wider">
            <span className="text-indigo-400">Professional Portfolio</span>
            <span>•</span>
            <span>Software Developer</span>
            <span>•</span>
            <span>Creative Professional</span>
          </div>
          <div className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
