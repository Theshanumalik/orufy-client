import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API } from "../lib/axios";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
  isLoading: boolean;
};

const UserContext =
  createContext<UserContextType | null>(
    null
  );

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const { data, isLoading } =
    useQuery({
      queryKey: ["me"],
      queryFn: async () => {
        const res =
          await API.get("/users/user");

        return res.data.data;
      },
      retry: false,
    });
  const effectiveUser =
    user ?? data ?? null;

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user: effectiveUser,
        setUser,
        isLoading
      }
      }
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context =
    useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used within UserProvider"
    );
  }

  return context;
};
