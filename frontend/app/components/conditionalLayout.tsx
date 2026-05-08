"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import StoreProvider from "../StoreProvider";

export default function ConditionalLayout({ children, }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    // Nếu là admin route, chỉ render children (không có Header/Footer)
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Nếu là user route, render với Header/Footer
    return (
        <StoreProvider>
            <Header />
            {children}
            <Footer />
        </StoreProvider>
    );
}