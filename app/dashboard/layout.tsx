import Script from "next/script";
import { FunctionComponent } from "react";
import { AuthGuard } from "src/components";
import { Layout } from "src/components/Dashboard/Layout/Layout";

const DashboardLayout: FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Layout>
        <AuthGuard>{children}</AuthGuard>
      </Layout>
      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
    </>
  );
};

export default DashboardLayout;
