import { cookies } from 'next/headers';

export default async function FeaturesPage() {
    const cookieStore = await cookies();
    const sessionCookie = (await cookieStore).get("calendix_session");
    const email =await sessionCookie?.value; // Extract the email from the cookie value if it exists
  
  return (
    <>
    <pre>
        <div>Check Logs{JSON.stringify(sessionCookie)}</div>
        <br/>
        <br/>
        {JSON.stringify(email)}
        </pre>    
    </>
);
}
