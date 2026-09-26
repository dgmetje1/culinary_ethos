import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/context/Search";

import HomePageBanner from "./Banner";
import HomePageContent from "./Content";
import HomePageProvider from "./Context";

const HomePage = () => {
  const { setShowSearch } = useSearch();

  useEffect(() => {
    setShowSearch(true);
    return () => setShowSearch(false);
  }, [setShowSearch]);

  return (
    <HomePageProvider>
      <div className={cn("min-h-screen", "bg-[#faf9f7] dark:bg-stone-950")}>
        <section className={cn("pt-12 pb-5")}>
          <HomePageBanner />
        </section>
        <HomePageContent />
      </div>
    </HomePageProvider>
  );
};

export default HomePage;
