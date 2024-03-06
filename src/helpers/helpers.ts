"use client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "src/services";
import { getCredit } from "./actions";

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
  credit: number;
  userSession: User | null;
}
export const useUserData = (): UseUserDataReturn => {
  const user = useUserSession();
  const [userCredit, setUserCredit] = useState(0);
  useEffect(() => {
    const getUserCredit = async () => {
      if (user !== null) {
        try {
          const credit = await getCredit(user?.id);
          if (credit) {
            setUserCredit(credit.credit);
          }
        } catch (e) {
          console.log("Error fetching credit from db");
        }
      }
    };
    getUserCredit();
  }, [user]);

  return {
    credit: userCredit,
    userSession: user,
  };
};
