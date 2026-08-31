//
// src/constants/navLinks.ts
//
import { LayoutDashboard } from "lucide-react";
import { Users } from 'lucide-react';
import { CirclePile } from 'lucide-react';
import { Coffee } from 'lucide-react';
import { Summary } from 'lucide-react';
import { Settings } from 'lucide-react';
import { ChartColumnStacked } from 'lucide-react';


export const links = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Staff",
    path: "/admin/staff",
    icon: Users,
  },
  {
    label: "Category",
    path: "/admin/category",
    icon: ChartColumnStacked,
  },
  // {
  //   label: "Inventory",
  //   path: "/admin/inventory",
  //   icon: CirclePile,
  // },
  {
    label: "Products",
    path: "/admin/products",
    icon: Coffee,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: Summary,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];