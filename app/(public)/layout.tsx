import { Header } from "src/components";
import Footer from "src/components/Footer";

export default function SignedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center py-2">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
