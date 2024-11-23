import nextAppSession from 'next-app-session';

type MySessionData = {
  grantId?: string;
  email?: string;
};

export const session = nextAppSession<MySessionData>({
  name: 'calendix_session',
  secret: process.env.SECRET as string,
  cookie: {
    httpOnly: true, // Keep this true for security
    maxAge: 86400,  // 24 hours in seconds
  },
});
