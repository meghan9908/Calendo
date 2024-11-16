import nextAppSession from 'next-app-session';

type MySessionData = {
   grant_id?: string;
   email?: string;
};

export const session = nextAppSession<MySessionData>({
   name: 'calendix_session',
   secret: process.env.SECRET as string,
   cookie: {
      maxAge: 0,  // Set cookie to expire immediately on destroy
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
   },
});
