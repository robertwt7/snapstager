"use client";
import { User } from "@supabase/supabase-js";
import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  createContext,
} from "react";
import { GetProfileReturn, useUserData } from "src/helpers";

interface UserContextValue {
  userProfile: GetProfileReturn;
  setUserProfile: Dispatch<SetStateAction<GetProfileReturn>>;
  userSession: User | null;
}
export const UserContext = createContext<UserContextValue>({
  userProfile: {
    firstName: "",
    lastName: "",
    credit: 0,
  },
  setUserProfile: () => {},
  userSession: null,
});

export const UserContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const { userProfile, setUserProfile, userSession } = useUserData();
  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, userSession }}>
      {children}
    </UserContext.Provider>
  );
};
