import nextAppSession from 'next-app-session';

type MySessionData = {
   grant_id?: string;
   email?: string;
};

export const session = nextAppSession<MySessionData>({
   name: 'calendix_session',
   secret: process.env.SECRET as string,
   cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
   },
});

// Debugging example:
const userSession = session();
await userSession.set('email', 'user@example.com');
const email = await userSession.get('email');
console.log('Session email:', email);
