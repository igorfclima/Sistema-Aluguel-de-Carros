"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
    tipos?: string[];
}

export default function ProtectedRoute({ children, tipos }: Props) {
    const { isAuthenticated, usuario, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push("/login");
                return;
            }
            if (tipos && usuario && !tipos.includes(usuario.tipo)) {
                router.push("/dashboard");
            }
        }
    }, [isAuthenticated, isLoading, usuario, tipos, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground text-sm">Carregando...</p>
            </div>
        );
    }

    return <>{children}</>;
}
