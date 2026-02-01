"use client";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Content from "./icons/Content";
import History from "./icons/History";
import Keywords from "./icons/Keywords";
import OverviewIcon from "./icons/Overview";
import Settings from "./icons/Settings";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // navItems same as before
  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <OverviewIcon
          isActive={
            pathname === "/dashboard" ||
            pathname.startsWith("/dashboard/overview")
          }
        />
      ),
      href: "/dashboard",
    },
    {
      id: "content",
      label: "Content",
      icon: <Content isActive={pathname === "/dashboard/content"} />,
      href: "/dashboard/content",
    },
    {
      id: "keywords",
      label: "Keywords",
      icon: <Keywords isActive={pathname === "/dashboard/keywords"} />,
      href: "/dashboard/keywords",
    },
    {
      id: "history",
      label: "History",
      icon: <History isActive={pathname === "/dashboard/history"} />,
      href: "/dashboard/history",
    },
    {
      id: "setting",
      label: "Setting",
      icon: <Settings isActive={pathname === "/dashboard/settings"} />,
      href: "/dashboard/settings",
    },
  ];

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    return (
      pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-[230px] bg-[#003D3D] flex flex-col rounded-r-[30px]
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b-[2px] border-white/24 h-[110px] flex justify-between items-center">
          <Link href="/dashboard">
            {" "}
            <Image
              src="/images/logo.png"
              alt="Polymath Logo"
              width={188}
              height={46}
            />
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="text-white ms-4 md:ms-0 md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-[24px] overflow-y-auto">
          <ul className="px-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${
                      isActive(item.href)
                        ? "text-black"
                        : "text-teal-200 hover:bg-teal-700 text-white"
                    }
                  `}
                  style={
                    isActive(item.href)
                      ? {
                          background:
                            "linear-gradient(to right, #00FF7F, #00C260)",
                        }
                      : {}
                  }
                >
                  {item.icon}
                  <span className="text-[18px] font-normal">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
