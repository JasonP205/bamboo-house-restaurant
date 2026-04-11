import { Outlet, Link } from "react-router-dom";
import { Button } from "@heroui/react";

const CustomerLayOut = () => {
  return (
    <section className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <Link to="/" className="font-serif italic text-xl md:text-2xl text-accent flex items-center gap-2">
            <img src="/img/bamboo-house-icon.png" alt="Bamboo House Logo" className="h-10 rounded-md w-auto" />
            <h1>Bamboo House</h1>
        </Link>
        <Link to="/booking">
          <Button size="sm" className="capitalize shadow-accent/30 shadow-lg rounded-xl flex text-xs items-center tracking-wider text-white">
            Book a Table
          </Button>
        </Link>
      </header>
      <div className="pt-20 flex-1">
        <Outlet />
      </div>
    </section>
  );
};

export default CustomerLayOut;
