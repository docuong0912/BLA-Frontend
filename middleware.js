import { NextResponse } from 'next/server';
const middleware = (request) => {
  let token = request.cookies.get('jwt');
  if(!token){
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
    }
  

  
}

export default middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|login).*)',
      ],
}