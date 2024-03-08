"use client";
import { User } from "@supabase/supabase-js";
import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  createContext,
} from "react";
import { useUserData } from "src/helpers";

interface UserContextValue {
  userCredit: number;
  setUserCredit: Dispatch<SetStateAction<number>>;
  userSession: User | null;
}
export const UserContext = createContext<UserContextValue>({
  userCredit: 0,
  setUserCredit: () => {},
  userSession: null,
});

export const UserContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const { userCredit, setUserCredit, userSession } = useUserData();
  return (
    <UserContext.Provider value={{ userCredit, setUserCredit, userSession }}>
      {children}
    </UserContext.Provider>
  );
};
