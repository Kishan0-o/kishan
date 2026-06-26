"use client";

import { ReactNode, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";

function ScrollHandler() {
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenis]);

    return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const isMobile = useMobile();

    // On mobile, skip Lenis entirely — native scroll is smoother and cheaper
    if (isMobile) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.07, duration: 1.5, smoothWheel: true }}>
            <ScrollHandler />
            {children}
        </ReactLenis>
    );
}
