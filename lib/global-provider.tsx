import { createContext, ReactNode, useContext } from "react";
import { getSessionUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

type User = {
  $id: string;
  name: string;
  email: string;
  [key: string]: any;
};

type GlobalContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, loading, refetch } = useAppwrite({ fn: getSessionUser });

  return (
    <GlobalContext.Provider
      value={{ user, isLoggedIn: !!user, loading, refetch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};

export default GlobalProvider;
