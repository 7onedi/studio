import {
  // IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  // IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconUser,
  IconMapPin,
  IconTicket,
  IconMap2,
  IconUsersGroup,
  IconPhone,
  IconBook,
  IconVaccine,
  IconWorld,
  IconTableDown
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  // {
  //   navlabel: true,
  //   subheader: "GENERAL",
  // },

  // {    
  //   id: uniqueId(),
  //   title: "Profile",
  //   icon: IconUser,
  //   href: "/admin/profile",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Dashboard",
  //   icon: IconLayoutDashboard,
  //   href: "/admin/dashboard",
  // },
  {
    navlabel: true,
    subheader: "PRODUCTION",
  },

  {
    id: uniqueId(),
    title: "Articles",
    icon: IconTypography,
    href: "/admin/production/articles",
  },
  {
    id: uniqueId(),
    title: "Categories and Sub",
    icon: IconBook,
    href: "/admin/production/categories",
  },
  {
    id: uniqueId(),
    title: "Projects",
    icon: IconMapPin,
    href: "/admin/production/projects",
  },
  // {
  //   id: uniqueId(),
  //   title: "Places",
  //   icon: IconMap2,
  //   href: "/admin/production/places",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Team",
  //   icon: IconUsersGroup,
  //   href: "/admin/production/team",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Contacts",
  //   icon: IconPhone,
  //   href: "/admin/production/contacts",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Methodology",
  //   icon: IconBook,
  //   href: "/admin/production/methodology",
  // },

  // {
  //   navlabel: true,
  //   subheader: "ABOUT NETWORK",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Donors",
  //   icon: IconVaccine,
  //   href: "/admin/production/donors",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Partners",
  //   icon: IconWorld,
  //   href: "/admin/production/partners",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Submissions",
  //   icon: IconTableDown,
  //   href: "/admin/production/submissions",
  // },

  // {
  //   navlabel: true,
  //   subheader: "UTILITIES",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Typography",
  //   icon: IconTypography,
  //   href: "/admin/utilities/typography",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Shadow",
  //   icon: IconCopy,
  //   href: "/admin/utilities/shadow",
  // },
  // {
  //   navlabel: true,
  //   subheader: "AUTH",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Login",
  //   icon: IconLogin,
  //   href: "/admin/authentication/login",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Register",
  //   icon: IconUserPlus,
  //   href: "/admin/authentication/register",
  // },
  // {
  //   navlabel: true,
  //   subheader: " EXTRA",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Icons",
  //   icon: IconMoodHappy,
  //   href: "/admin/icons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/admin/sample-page",
  // },

];

export default Menuitems;


