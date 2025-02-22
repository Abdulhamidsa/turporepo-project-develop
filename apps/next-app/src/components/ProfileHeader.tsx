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
    <Card className="flex flex-col items-center p-6 shadow-lg md:flex-row md:p-8">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="border-border bg-background h-28 w-28 overflow-hidden rounded-full border-4 shadow-lg sm:h-32 sm:w-32 md:h-36 md:w-36"
      >
        {userProfile.profilePicture ? (
          <Image
            src={userProfile.profilePicture}
            alt={userProfile.username || 'User'}
            width={144}
            height={144}
            className="object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-2xl font-bold sm:text-3xl">
            {(userProfile.username || 'NA').slice(0, 2).toUpperCase()}
          </div>
        )}
      </motion.div>

      {/* Details */}
      <div className="mt-4 flex-1 text-center md:ml-6 md:mt-0 md:text-left">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-foreground text-2xl font-bold sm:text-3xl md:text-4xl"
        >
          {userProfile.username}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground flex items-center justify-center gap-2 text-base sm:text-lg md:justify-start"
        >
          <Briefcase className="text-primary h-5 w-5" />
          {userProfile.profession || 'No profession listed'}
        </motion.p>
        {userProfile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mt-2 text-sm italic sm:text-base md:text-lg"
          >
            {userProfile.bio}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start"
        >
          {userProfile.countryOrigin && (
            <Badge
              variant="secondary"
              className="bg-card text-foreground border-border flex items-center gap-2 border px-3 py-2 text-sm sm:text-base"
            >
              <Globe className="text-primary h-4 w-4" />
              {userProfile.countryOrigin}
            </Badge>
          )}
          {userProfile.age && (
            <Badge
              variant="secondary"
              className="bg-card text-foreground border-border flex items-center gap-2 border px-3 py-2 text-sm sm:text-base"
            >
              <Calendar className="text-primary h-4 w-4" />
              {userProfile.age} yrs
            </Badge>
          )}
        </motion.div>
      </div>
    </Card>
  );
}
