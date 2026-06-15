import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API } from "../lib/axios";
import { useNavigate } from "react-router";

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

  const { data } =
    useQuery({
      queryKey: ["me"],
      queryFn: async () => {
        const res =
          await API.get("/users/user");

        return res.data.data;
      },
      retry: false,
    });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
