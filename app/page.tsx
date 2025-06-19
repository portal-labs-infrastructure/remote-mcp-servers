import { Hero } from '@/components/hero';
import Servers from '@/components/servers';
import AppBar from '@/components/app-bar';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-20">
      <div className="flex-1 w-full flex flex-col items-center ">
        <AppBar />
        <div className="flex-1 flex flex-col gap-10 max-w-6xl ">
          <Hero />
          <main className="flex-1 flex flex-col gap-6">
            <Servers />
          </main>
        </div>
      </div>
      <Footer />
    </main>
  );
}
