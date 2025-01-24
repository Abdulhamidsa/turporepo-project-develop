import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { useAuth } from "../features/user/hooks/use.auth";
import { useUserProfile } from "../features/user/hooks/use.user.profile";
import { DarkModeToggle } from "./DarkModeToggle";

export function NavbarApp() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();

  return (
    <header className="bg-muted border-b border-border shadow-sm sticky top-0 z-50">
      <div className="mx-auto md:ml-16 md:mr-8 flex items-center justify-between h-full p-4">
        <Link to="/" className="text-xl font-bold text-primary hover:text-primary-foreground">
          ProFolio
        </Link>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="text-lg font-semibold text-primary">{userProfile.username || "User"}!</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex border items-center w-12 h-12 space-x-2 rounded-full hover:bg-muted p-2 transition focus-visible:ring">
                <Avatar>{userProfile.profilePicture ? <AvatarImage src={userProfile.profilePicture} alt={userProfile.username || "User avatar"} /> : <AvatarFallback>{userProfile.profilePicture?.charAt(0) || "U".charAt(0)}</AvatarFallback>}</Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-card text-card-foreground rounded-lg shadow-lg">
              <DropdownMenuLabel className="text-muted-foreground">Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
              <div className="flex justify-center py-2">
                <DarkModeToggle />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
