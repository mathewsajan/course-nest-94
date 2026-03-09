import { BookOpen, Library, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function Navbar() {
  const location = useLocation();
  const isCreator = location.pathname.startsWith("/creator");
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();

  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Learnify</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              !isCreator ? "text-foreground" : "text-muted-foreground"
            )}
          >
            My Courses
          </Link>
          {isAdmin && (
            <Link
              to="/creator"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                isCreator ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Creator
            </Link>
          )}
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
