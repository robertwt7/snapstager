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
            pricing-table-id="prctbl_1Q0biaEuRNR1WDrX66n42VXi"
            publishable-key="pk_live_51PjoJjEuRNR1WDrXMc9opL7x2bGLn58Vx7xWSUD65DlLtGRvMENE5zZNIDTTzYHAy5NdSxsje5PCYN5HvxnIJWyP00vfdUTIkJ"
            client-reference-id={user.id}
          ></stripe-pricing-table>
        </div>
      </div>
    </>
  ) : null;
};
