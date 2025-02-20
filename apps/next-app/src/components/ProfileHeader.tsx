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
    <Card className="relative overflow-hidden rounded-lg shadow-lg">
      <div className="relative h-60 w-full">
        <Image
          src={userProfile.coverImage || '/placeholder.jpg'}
          alt="Cover"
          layout="fill"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative flex flex-col items-center p-6 text-center md:flex-row md:items-end md:space-x-6 md:text-left">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="border-border bg-background h-36 w-36 overflow-hidden rounded-full border-4 shadow-lg"
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
            <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-3xl font-bold">
              {(userProfile.username || 'NA').slice(0, 2).toUpperCase()}
            </div>
          )}
        </motion.div>

        <div className="mt-4 md:mt-0">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-foreground text-4xl font-bold"
          >
            {userProfile.username}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-1 flex items-center gap-2 text-xl"
          >
            <Briefcase className="text-primary h-5 w-5" />
            {userProfile.profession || 'No profession listed'}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mt-2 italic"
          >
            &quot;{userProfile.bio}&quot;
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start"
          >
            {userProfile.countryOrigin && (
              <Badge
                variant="secondary"
                className="bg-card text-foreground border-border flex items-center gap-2 border p-2"
              >
                <Globe className="text-primary h-4 w-4" />
                {userProfile.countryOrigin}
              </Badge>
            )}
            {userProfile.age && (
              <Badge
                variant="secondary"
                className="bg-card text-foreground border-border flex items-center gap-2 border p-2"
              >
                <Calendar className="text-primary h-4 w-4" />
                {userProfile.age} yrs
              </Badge>
            )}
          </motion.div>
        </div>
      </div>
    </Card>
  );
}
