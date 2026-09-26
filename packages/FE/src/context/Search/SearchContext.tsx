import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextValues {
  search: string;
  setSearch: (value: string) => void;
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextValues | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  return (
    <SearchContext.Provider value={{ search, setSearch, showSearch, setShowSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
