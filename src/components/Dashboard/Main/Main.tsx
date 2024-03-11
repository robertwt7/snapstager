"use client";
import { FunctionComponent, useContext } from "react";
import { PricingTable } from "src/components/PricingTable/PricingTable";
import { StageForm } from "src/components/StageForm";
import { UserContext } from "../Layout/UserContext";

export const Main: FunctionComponent = () => {
  const {
    userProfile: { credit },
    userSession,
  } = useContext(UserContext);
  return userSession !== null && credit > 0 ? (
    <StageForm user={userSession} />
  ) : (
    <PricingTable />
  );
};
