"use client";
import { DocumentDuplicateIcon, HomeIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export enum Route {
  DASHBOARD = "/dashboard",
  LOGIN = "/login",
  LOGOUT = "/logout",
  SIGNUP = "/signup",
  IMAGES = "/dashboard/images",
}
export const userNavigation = [
  { name: "Buy Credits", href: "#" },
  { name: "Sign out", href: Route.LOGOUT },
];

export const useNavigationItems = () => {
  const pathName = usePathname();
  return [
    {
      name: "Generate",
      href: Route.DASHBOARD,
      icon: HomeIcon,
      current: pathName === Route.DASHBOARD,
    },
    {
      name: "Images",
      href: Route.IMAGES,
      icon: DocumentDuplicateIcon,
      current: pathName === Route.IMAGES,
    },
    // { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
  ];
};
export const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
];

export const nonAuthRoutes = [Route.LOGIN, Route.SIGNUP];
