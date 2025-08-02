"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectingPage() {
  const router = useRouter();

  useEffect(() => {
    // Force reload so server components like Header are refreshed with new cookies
    router.replace("/");
  }, [router]);

  return <p>Redirecting...</p>;
}
