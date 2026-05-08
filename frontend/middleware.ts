import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        const token = request.cookies.get('access_token')?.value;

        if (token) {
            const user = await fetch('http://localhost:3000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json()).catch(() => null);
            if (user?.role === 'admin') {
                return NextResponse.next();
            } else {
                const loginUrl = new URL('/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        } else {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    } catch (error) {
        console.error("Error in middleware:", error);
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/admin/:path*']
};