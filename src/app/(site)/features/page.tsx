import { cookies } from 'next/headers';

export default async function FeaturesPage() {
    const cookie = (await cookies()).getAll()
  return (
  <div>Check Logs{JSON.stringify(cookie)}</div>
);
}
