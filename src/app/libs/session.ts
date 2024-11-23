import { NextApiRequest } from 'next';
import nextAppSession from 'next-app-session';
import { cookies } from 'next/headers';

type MySessionData = {
  grantId?: string;
  email?: string;
};

export const session = nextAppSession<MySessionData>({
  name: 'calendix_session',
  secret: process.env.SECRET as string,
  cookie: {
    httpOnly: true,
    maxAge: 86400, // 24 hours
    path: '/', // Accessible across the app
    secure: process.env.NODE_ENV === 'production',
  },
});

// Helper function to integrate with App Router
export async function getSession() {
  const cookieStore = cookies(); // Get cookies from headers
  const cookieObject: { [key: string]: string } = {};

  // Populate cookieObject with name-value pairs
  (await
    // Populate cookieObject with name-value pairs
    cookieStore).getAll().forEach(({ name, value }) => {
    cookieObject[name] = value;
  });

  // Mock NextApiRequest to pass to nextAppSession
  const mockReq = { cookies: cookieObject };

  return session(mockReq as NextApiRequest); // Cast to satisfy type
}
