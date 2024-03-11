"use client";
import { User } from "@supabase/supabase-js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { supabase } from "src/services";
import { GetProfileReturn, getProfile } from "./actions";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useUserSession = (): User | null => {
  const [user, setUser] = useState<null | User>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (user?.data !== null) {
          setUser(user.data.user);
        }
      } catch (error) {
        // TODO: handle error with snackbar
      }
    };
    getUser();
  }, []);

  return user;
};

interface UseUserDataReturn {
  userSession: User | null;
  userProfile: GetProfileReturn;
  setUserProfile: Dispatch<SetStateAction<GetProfileReturn>>;
}
export const useUserData = (): UseUserDataReturn => {
  const user = useUserSession();
  const [userProfile, setUserProfile] = useState<GetProfileReturn>({
    firstName: "",
    lastName: "",
    credit: 0,
  });
  useEffect(() => {
    const getUserCredit = async () => {
      if (user !== null) {
        try {
          const profile = await getProfile(user?.id);
          if (profile) {
            setUserProfile(profile);
          }
        } catch (e) {
          console.log("Error fetching credit from db", e);
        }
      }
    };
    getUserCredit();
  }, [user]);

  return {
    userProfile,
    userSession: user,
    setUserProfile,
  };
};
