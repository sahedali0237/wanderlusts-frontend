import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export default async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })
    const user = session?.user
    if (!user) {
        return NextResponse.redirect(new URL('/signIn', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/add-destinations', '/myBookings', '/destination/:path*'],
}

export const runtime = 'nodejs'
