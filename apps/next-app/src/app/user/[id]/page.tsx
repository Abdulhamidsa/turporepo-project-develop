import Image from "next/image";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Globe, Calendar } from "lucide-react";
import { getUserProfile } from "../../../lib/api";

// ✅ Force dynamic fetching for latest data
export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: { id: string };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const id = params.id;
  const userProfile = await getUserProfile(id);
  // ✅ Safely access params.id

  if (!userProfile) {
    return <p className="text-center mt-10 text-muted-foreground">User profile not found.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="relative w-full max-w-sm rounded-xl shadow-md bg-card border border-border">
        {/* Cover Image */}
        <div className="relative h-28 bg-muted">{userProfile.coverImage ? <Image src={userProfile.coverImage} alt="Cover Image" layout="fill" className="object-cover w-full h-full" /> : <div className="w-full h-full bg-muted" />}</div>

        {/* Profile Picture */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-card overflow-hidden bg-muted">
            {userProfile.profilePicture ? (
              <Image src={userProfile.profilePicture} alt={userProfile.username || "User"} width={96} height={96} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">{(userProfile.username || "NA").slice(0, 2).toUpperCase()}</div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="mt-16 px-6 pb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">{userProfile.username}</h1>
          <p className="text-sm text-muted-foreground">{userProfile.profession || "No profession listed"}</p>

          {userProfile.bio && <p className="mt-2 text-sm text-muted-foreground italic">"{userProfile.bio}"</p>}

          <div className="mt-4 flex justify-center gap-2">
            {userProfile.countryOrigin && (
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Globe className="h-4 w-4 mr-1" />
                {userProfile.countryOrigin}
              </Badge>
            )}
            {userProfile.age && (
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {userProfile.age} yrs
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(process.env.NEXT_PUBLIC_BASE_URL as string);

// ✅ Generate static params for pre-rendering user pages
export async function generateStaticParams() {
  try {
    const res = await fetch(`${ENDPOINTS.users.fetchAll}`);

    if (!res.ok) {
      console.error("Failed to fetch users for static params.");
      return []; // Return an empty array to avoid build errors
    }

    const users = await res.json();

    // ✅ Check if users.data.users exists and is an array
    if (!Array.isArray(users.data?.users)) {
      console.error("Invalid data format:", users);
      return []; // Return an empty array to prevent errors
    }

    // ✅ Map over users array
    return users.data.users.map((user: any) => ({
      id: user.friendlyId, // Must match [id] in the route
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return []; // Return an empty array if fetching fails
  }
}
