import AppBar from '@/components/app-bar';
import Footer from '@/components/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <AppBar />
        <div className="flex-1 flex flex-col gap-16 max-w-7xl p-2 w-full">
          {children}
        </div>

        <Footer />
      </div>
    </main>
  );
}
