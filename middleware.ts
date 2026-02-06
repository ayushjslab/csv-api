import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
    'https://visible-ai-nine.vercel.app',
    'http://localhost:3000'
]

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin')

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 })
        if (origin && ALLOWED_ORIGINS.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin)
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            response.headers.set('Access-Control-Max-Age', '86400')
        }
        return response
    }

    const response = NextResponse.next()

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
    }

    return response
}

export const config = {
    matcher: '/api/:path*',
}
