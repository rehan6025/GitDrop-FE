import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/auth";

interface Props {
    children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "checking") return null;

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}
