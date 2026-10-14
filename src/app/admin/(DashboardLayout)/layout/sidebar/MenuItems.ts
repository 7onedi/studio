import {
  IconLogin,
  IconBuildingCastle,
  IconUser,
  IconMapPin,
  IconTags,
  IconUsersGroup,
  IconBook,
  IconWorld,
  IconPhoto,
  IconPuzzle2,
  IconBulb
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const allMenuItems = [
  { navlabel: true, subheader: "GENERAL" },
  { id: uniqueId(), title: "Profile", icon: IconUser, href: "/admin/profile" },
  { id: uniqueId(), title: "Users", icon: IconUsersGroup, href: "/admin/users", roles: ["OWNER", "ADMIN"] },
  { navlabel: true, subheader: "PRODUCTION" },
  { navlabel: true, subheader: "Articles", sub: true },
  { id: uniqueId(), title: "#CountrysideStudio", icon: IconBuildingCastle, href: "/admin/production/articles" },
  { id: uniqueId(), title: "Youthinsight", icon: IconBulb, href: "/admin/production/youthinsight" },
  { id: uniqueId(), title: "Mozaїka", icon: IconPuzzle2, href: "/admin/production/mozaika" },
  { id: uniqueId(), title: "Imagemapping", icon: IconPhoto, href: "/admin/production/imagemapping" },
  { navlabel: true, subheader: "Management" },
  { id: uniqueId(), title: "Tags", icon: IconTags, href: "/admin/production/tags", roles: ["OWNER", "ADMIN"] },
  { id: uniqueId(), title: "Categories and Sub", icon: IconBook, href: "/admin/production/categories", roles: ["OWNER"] },
  { id: uniqueId(), title: "Subcategories", icon: IconBook, href: "/admin/production/categories", roles: ["ADMIN"] },
  { id: uniqueId(), title: "Projects", icon: IconMapPin, href: "/admin/production/projects", roles: ["OWNER", "ADMIN"] },
  { id: uniqueId(), title: "Partners", icon: IconWorld, href: "/admin/production/partners", roles: ["OWNER", "ADMIN"] },
  { navlabel: true, subheader: "AUTH" },
  { id: uniqueId(), title: "ReLogin", icon: IconLogin, href: "/admin/authentication/login" },
];

export const getMenuItems = (role?: string) =>
  allMenuItems.filter((item) => {
    if (!("roles" in item)) return true; // немає обмежень — показуємо всім
    return item.roles?.includes(role ?? "");
  });

export default allMenuItems;


