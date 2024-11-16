import Intro from "../components/Intro";
import Trustees from "../components/Trustees";

export default async function Home() {
  return (
    <main className="container">
    
    <Intro/>
    <Trustees/>
    </main>
  );
}
