import { Navigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Loader2 } from "lucide-react";

export function CreatorRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
