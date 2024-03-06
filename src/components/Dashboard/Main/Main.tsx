"use client";
import { FunctionComponent } from "react";
import { PricingTable } from "src/components/PricingTable/PricingTable";
import { StageForm } from "src/components/StageForm";
import { useUserData } from "src/helpers";

export const Main: FunctionComponent = () => {
  const { credit, userSession } = useUserData();

  return userSession !== null && credit !== 0 ? (
    <StageForm user={userSession} />
  ) : (
    <PricingTable />
  );
};
