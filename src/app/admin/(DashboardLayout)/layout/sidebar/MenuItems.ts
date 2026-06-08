import {
  IconLogout,
  IconTypography,
  IconUser,
  IconMapPin,
  IconTags,
  IconUsersGroup,
  IconBook,
  IconWorld,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const allMenuItems = [
  { navlabel: true, subheader: "GENERAL" },
  { id: uniqueId(), title: "Profile", icon: IconUser, href: "/admin/profile" },
  { id: uniqueId(), title: "Users", icon: IconUsersGroup, href: "/admin/users", roles: ["OWNER", "ADMIN"] },
  { navlabel: true, subheader: "PRODUCTION" },
  { id: uniqueId(), title: "Articles", icon: IconTypography, href: "/admin/production/articles" },
  { id: uniqueId(), title: "Tags", icon: IconTags, href: "/admin/production/tags", roles: ["OWNER", "ADMIN"] },
  { id: uniqueId(), title: "Categories and Sub", icon: IconBook, href: "/admin/production/categories", roles: ["OWNER"] },
  { id: uniqueId(), title: "Subcategories", icon: IconBook, href: "/admin/production/categories", roles: ["ADMIN"] },
  { id: uniqueId(), title: "Projects", icon: IconMapPin, href: "/admin/production/projects", roles: ["OWNER", "ADMIN"] },
  { id: uniqueId(), title: "Partners", icon: IconWorld, href: "/admin/production/partners", roles: ["OWNER", "ADMIN"] },
  { navlabel: true, subheader: "AUTH" },
  { id: uniqueId(), title: "Logout", icon: IconLogout, href: "/admin/authentication/login" },
];

export const getMenuItems = (role?: string) =>
  allMenuItems.filter((item) => {
    if (!("roles" in item)) return true; // немає обмежень — показуємо всім
    return item.roles?.includes(role ?? "");
  });

export default allMenuItems;


