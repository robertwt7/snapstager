import { Header } from "src/components";
import Footer from "src/components/Footer";

export default function SignedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
