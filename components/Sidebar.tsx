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
import Profile from "./icons/Profile";
import Model from "./icons/Model";
import Form from "./icons/Form";
import Users from "./icons/Users";

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
      id: "Overview",
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
      id: "users",
      label: "Users",
      icon: <Users isActive={pathname === "/dashboard/users"} />,
      href: "/dashboard/users",
    },
    {
      id: "model",
      label: "Model",
      icon: <Model isActive={pathname === "/dashboard/model"} />,
      href: "/dashboard/model",
    },
    {
      id: "prompt",
      label: "Prompt",
      icon: <Model isActive={pathname === "/dashboard/prompt"} />,
      href: "/dashboard/prompt",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <Profile isActive={pathname === "/dashboard/profile"} />,
      href: "/dashboard/profile",
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
          fixed z-50 top-0 left-0 h-full w-[230px] border border-r-stone-300 bg-white flex flex-col 
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        {/* Logo */}
        <div className="h-[110px] flex justify-center items-center mt-4">
          <Link href="/dashboard" className="flex flex-col items-center ">

            <Image
              src="/images/logo-2.png"
              alt="InterviewFIo Logo"
              width={80}
              height={46}
            />

            <h1 className="text-2xl font-bold text-[#7D68BC]">InterviewFIo</h1>
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="text-black ms-4 md:ms-0 md:hidden"
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
                        ? "text-white"
                        : "text-black hover:bg-gradient-to-r hover:from-[#A78BFA] hover:to-[#5835C0] hover:text-white"
                    }
                  `}
                  style={
                    isActive(item.href)
                      ? {
                          background:
                            "linear-gradient(to right, #A78BFA, #5835C0)",
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
