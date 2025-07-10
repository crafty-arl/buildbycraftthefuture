import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if route requires authentication
        const protectedPaths = ['/profile', '/upgrade']
        const isProtectedPath = protectedPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        )
        
        // If it's a protected path, require authentication
        if (isProtectedPath) {
          return !!token
        }
        
        // Allow access to non-protected paths
        return true
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: ['/profile/:path*', '/upgrade/:path*']
} 