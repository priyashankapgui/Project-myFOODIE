"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/store/local_storage";

const publicRoutes = ["/signin", "/signup", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        // If not logged in and accessing protected route → redirect to signin
        if (!token && !publicRoutes.includes(pathname)) {
            router.replace("/signin");
        }

        // If logged in and trying to access auth routes → redirect to dashboard
        if (token && publicRoutes.includes(pathname)) {
            router.replace("/");
        }

        setLoading(false);
    }, [pathname, router]);

    // While checking auth, show nothing or a spinner
    if (loading) return null;

    return <>{children}</>;
}
