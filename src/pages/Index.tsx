import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>VaultGuard – Secure Password Manager</title>
        <meta name="description" content="VaultGuard is a modern, secure password manager. Register, login and manage your passwords safely." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Secure Passwords, Effortless Control</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">A clean, privacy-first password manager. Store, generate and retrieve passwords with confidence.</p>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
