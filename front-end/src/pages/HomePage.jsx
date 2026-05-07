import Navbar from "../components/layout/Navbar/Navbar.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import Hero from "../components/home/Hero/Hero.jsx";
import Stats from "../components/home/Stats/Stats.jsx";
import Workflow from "../components/home/Workflow/Workflow.jsx";
import AudienceSplit from "../components/home/AudienceSplit/AudienceSplit.jsx";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Workflow />
        <AudienceSplit />
      </main>
      <Footer />
    </>
  );
}