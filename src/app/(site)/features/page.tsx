import { cookies } from 'next/headers';

export default async function FeaturesPage() {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("calendix_session");
    const email = sessionCookie?.value; // Extract the email from the cookie value if it exists
  
  return (
    <>
    <pre>
        <div>Check Logs{JSON.stringify(cookieStore)}</div>
        <br/>
        <br/>
        {JSON.stringify(email)}
        </pre>    
    </>
);
}
