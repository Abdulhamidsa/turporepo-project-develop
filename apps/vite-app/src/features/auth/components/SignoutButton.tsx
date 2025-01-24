// import { useSignOut } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignOutButton() {
  // const signOut = useSignOut();

  const handleSignOut = async () => {
    try {
      // await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Link to="/" onClick={handleSignOut}>
      <div className="flex items-center space-x-2 bg-transparent">
        <LogOut className=" h-4 w-4" />
        <span>Sign Out</span>
      </div>
    </Link>
  );
}
