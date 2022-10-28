import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function middleware(request = NextRequest) {
  const cookiesToken = request.cookies.get("token");
  const cookiesRefreshToken = request.cookies.get("refreshToken");
  const cookiesRole = request.cookies.get("role");
  const cookiesId = request.cookies.get("id");
  const cookiesLockCredential = request.cookies.get("lockCredential");

  let url = request.url;
  let urlRedirect = request.nextUrl.clone();
  const response = NextResponse.next();

  if (cookiesToken && cookiesRefreshToken && cookiesRole && cookiesId && cookiesLockCredential) {
    // if (url.includes("/verification")) {
    //   // if (!request.nextUrl.searchParams.get('id') && !request.nextUrl.searchParams.get('token')) {
    //   //    urlRedirect.pathname = '/'
    //   //    return NextResponse.rewrite(urlRedirect)
    //   // } else if (request.nextUrl.searchParams.get('id') && request.nextUrl.searchParams.get('token')) {
    //   //   return response
    //   // }
    // }
  } else {
    if (url.includes("/recruiter/profile") || url.includes("/users/profile")) {
      urlRedirect.pathname = "/sign-in";
      return NextResponse.redirect(urlRedirect);
    }

  }

 
 



  

  return response;
}