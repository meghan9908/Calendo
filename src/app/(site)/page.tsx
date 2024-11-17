import { Suspense } from "react";
import Intro from "../components/Intro";
import Trustees from "../components/Trustees";
import { ClipLoader } from "react-spinners";

export default async function Home() {
  return (
    <main className="container">
      {/* Suspense boundary for Intro */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-20">
            <ClipLoader size={35} color="#3498db" />
          </div>
        }
      >
        <Intro />
      </Suspense>
      {/* Suspense boundary for Trustees */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-20">
            <ClipLoader size={35} color="#3498db" />
          </div>
        }
      >
        <Trustees />
      </Suspense>
    </main>
  );
}
