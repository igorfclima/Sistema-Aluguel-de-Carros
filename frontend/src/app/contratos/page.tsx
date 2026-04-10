"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function ContratosPage() {
    return (
        <ProtectedRoute tipos={["AGENTE", "BANCO"]}>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                    <h1 className="text-xl font-semibold">Contratos</h1>
                    <p className="text-sm text-muted-foreground">Listagem</p>
                </main>
            </div>
        </ProtectedRoute>
    );
}
