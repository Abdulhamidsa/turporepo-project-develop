'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, Globe } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  userProfile: any;
}

export default function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  return (
    <div className="px-8 py-12 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Professional Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="flex-shrink-0"
        >
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-primary-foreground shadow-xl overflow-hidden bg-primary-foreground/10">
            {userProfile.profilePicture ? (
              <Image
                src={userProfile.profilePicture}
                alt={userProfile.username || 'User'}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-foreground text-3xl lg:text-4xl font-bold bg-primary-foreground/20">
                {(userProfile.username || 'NA').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </motion.div>

        {/* Professional Details */}
        <div className="flex-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
              {userProfile.username}
            </h1>
            <div className="flex items-center gap-3 text-xl lg:text-2xl text-primary-foreground/90">
              <Briefcase className="w-6 h-6" />
              <span className="font-medium">{userProfile.profession || 'Professional'}</span>
            </div>
          </motion.div>

          {userProfile.bio && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl"
            >
              <p className="text-lg text-primary-foreground/80 leading-relaxed font-light">
                {userProfile.bio}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            {userProfile.countryOrigin && (
              <div className="flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Globe className="w-5 h-5 text-primary-foreground/80" />
                <span className="text-primary-foreground font-medium">
                  {userProfile.countryOrigin}
                </span>
              </div>
            )}
            {userProfile.age && (
              <div className="flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-5 h-5 text-primary-foreground/80" />
                <span className="text-primary-foreground font-medium">
                  {userProfile.age} years old
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
