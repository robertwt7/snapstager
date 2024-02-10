import { FunctionComponent } from "react";
import { AuthGuard } from "src/components";

const DashboardLayout: FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default DashboardLayout;
