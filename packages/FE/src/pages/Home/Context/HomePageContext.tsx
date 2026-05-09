import { createContext, useContext, useState, ReactNode } from "react";

interface HomePageContextValues {
  itemsVisible: number;
  setItemsVisible: (value: number | ((prev: number) => number)) => void;
}

const HomePageContext = createContext<HomePageContextValues | undefined>(undefined);

export const HomePageProvider = ({ children }: { children: ReactNode }) => {
  const [itemsVisible, setItemsVisible] = useState(6);

  return (
    <HomePageContext.Provider value={{ itemsVisible, setItemsVisible }}>
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePageContext = () => {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error("useHomePageContext must be used within a HomePageProvider");
  }
  return context;
};