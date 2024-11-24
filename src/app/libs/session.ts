import { ResponseCookies } from '@edge-runtime/cookies';

type MySessionData = {
  grantId?: string;
  email?: string;
};

const COOKIE_NAME = 'calendix_session';

export const session = {
  setSession: (cookies: ResponseCookies, value: string) => {
    cookies.set(COOKIE_NAME, value, {
      maxAge: 86400,
      path: '/',
      httpOnly: true,
      secure: true, // Only send over HTTPS
      sameSite: 'strict',
    });
  },

  getSession: (cookies: ResponseCookies): string | undefined => {
    return cookies.get(COOKIE_NAME)?.value;
  },

  deleteSession: (cookies: ResponseCookies) => {
    // Correct usage of delete() method
    cookies.delete(COOKIE_NAME); // No second parameter
  },
};

// Example usage in an API route or server function
export async function GET() {
  const headers = new Headers();
  const responseCookies = new ResponseCookies(headers);

  // Set a new session cookie
  session.setSession(responseCookies, 'example-session-value');

  // Retrieve session cookie
  const sessionValue = session.getSession(responseCookies);
  console.log('Session Value:', sessionValue);

  // Delete an old cookie
  session.deleteSession(responseCookies);

  return new Response(null, { headers, status: 200 });
}
