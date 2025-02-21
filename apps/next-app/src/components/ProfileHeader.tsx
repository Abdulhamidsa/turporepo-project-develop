'use client';

import { Badge } from '@repo/ui/components/ui/badge';
import { Card } from '@repo/ui/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Globe } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  userProfile: any;
}

export default function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  return (
    <Card className="flex flex-col items-center p-8 shadow-2xl md:flex-row md:items-stretch">
      {/* Profile Picture Section */}
      <div className="flex flex-shrink-0 items-center justify-center md:w-1/3">
        {userProfile.profilePicture ? (
          <Image
            src={userProfile.profilePicture}
            alt={userProfile.username}
            width={250}
            height={250}
            className="border-primary rounded-full border-4 shadow-lg"
          />
        ) : (
          <div className="border-primary flex h-64 w-64 items-center justify-center rounded-full border-4 bg-gray-200 text-6xl font-bold text-gray-700 shadow-lg">
            {(userProfile.username || 'NA').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      {/* Details Section */}
      <div className="mt-6 flex flex-col justify-center md:mt-0 md:w-2/3 md:pl-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary text-5xl font-extrabold"
        >
          {userProfile.username}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 flex items-center gap-2 text-2xl text-gray-700"
        >
          <Briefcase className="text-secondary h-6 w-6" />
          {userProfile.profession || 'No Profession Listed'}
        </motion.p>
        {userProfile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg italic text-gray-600"
          >
            {userProfile.bio}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex gap-4"
        >
          {userProfile.countryOrigin && (
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Globe className="text-secondary h-4 w-4" />
              {userProfile.countryOrigin}
            </Badge>
          )}
          {userProfile.age && (
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Calendar className="text-secondary h-4 w-4" />
              {userProfile.age} yrs
            </Badge>
          )}
        </motion.div>
      </div>
    </Card>
  );
}
