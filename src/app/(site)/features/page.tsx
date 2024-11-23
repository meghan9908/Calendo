import { cookies } from 'next/headers';

export default async function FeaturesPage() {
  console.log((await cookies()).getAll());
  return <div>Check Logs</div>;
}
