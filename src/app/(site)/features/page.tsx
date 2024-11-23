import { getSession } from '@/app/libs/session';
import { cookies } from 'next/headers';

export default async function FeaturesPage() {
    const cookie = (await cookies()).getAll()
  return (
    <>
    <pre>
        <div>Check Logs{JSON.stringify(cookie)}</div>
        <br/>
        <br/>
        {JSON.stringify(getSession())}
        </pre>    
    </>
);
}
