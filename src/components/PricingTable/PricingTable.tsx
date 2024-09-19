"use client";
import { useUserSession } from "src/helpers";
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
export const PricingTable = () => {
  const user = useUserSession();
  return user !== null ? (
    <>
      <div className="mt-4 mb-8 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mb-0">
        <h1 className="font-display mx-auto mb-5 max-w-4xl text-4xl font-bold tracking-normal md:text-6xl">
          Buy credits to use SpaceShift
        </h1>
        <div className="mt-8 w-full">
          <stripe-pricing-table
            pricing-table-id="prctbl_1OrIMPJCBxIyLk4DUbhMpN2v"
            publishable-key="pk_live_LuPm5zLm8llOnBiswfnHcqXI00NZxyvhRx"
            client-reference-id={user.id}
          ></stripe-pricing-table>
        </div>
      </div>
    </>
  ) : null;
};
