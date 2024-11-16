import { redirect } from "next/navigation";
import Intro from "../components/Intro";
import Trustees from "../components/Trustees";
import { session } from "../libs/session";

export default async function Home() {
  return (
    <main className="container">
    
    <Intro/>
    <Trustees/>
    </main>
  );
}
