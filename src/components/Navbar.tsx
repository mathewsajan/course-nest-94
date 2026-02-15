import { BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();
  const isCreator = location.pathname.startsWith("/creator");

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
          <Link
            to="/creator"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              isCreator ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Creator
          </Link>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}