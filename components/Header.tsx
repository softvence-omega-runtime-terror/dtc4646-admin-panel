import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const route = useRouter();
  const path = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getHeaderName = () => {
    switch (path) {
      case "/dashboard/profile":
        return "Profile";
      case "/dashboard/users":
        return "Users";
      case "/dashboard/model":
        return "Model";
      case "/dashboard/prompt":
        return "Prompt";
      case "/dashboard/provider":
        return "Provider";
      default:
        return "Overview";
    }
  };

  const handleSignOut = () => {
    Cookies.remove("auth_token");
    toast.success("You have been signed out successfully.");
    route.push("/login");
  };

  const userInfo = Cookies.get("user");
  const user = userInfo ? JSON.parse(userInfo) : null;

  return (
    <header
      className="relative bg-[#fff] ps-8 pe-8 sm:ps-8 sm:pe-8 py-4
flex items-center justify-between border border-b-stone-300"
    >
      <div className="absolute bottom-0 left-4 md:left-8 right-4 md:right-12 h-[2px] bg-white/24" />

      <div className="flex items-center space-x-3 z-10">
        <button onClick={onMenuClick} className="md:hidden text-[#7D68BC]">
          <Menu size={28} />
        </button>
        <h1 className="text-xl md:text-[32px] font-semibold text-[#7D68BC]">
          {getHeaderName()}
        </h1>
      </div>

      <div className="flex items-center space-x-3 z-10">
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 bg-gray-600 rounded-full overflow-hidden">
              <Image
                src="/images/user-avatar.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[#7D68BC] text-xl md:text-[24px] font-normal">
              Admin
            </span>
            <svg
              className={`w-4 h-4 text-[#7D68BC] transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-[#F5F3FF] via-[#EFF6FF] to-[#F0FDFA] rounded-xl shadow-xl border border-[#A78BFA] z-50">
              <div className="px-6 py-5 border-b border-[#A78BFA]/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#5835C0] shadow-md flex-shrink-0">
                    <Image
                      src="/images/user-avatar.png"
                      alt="User Avatar"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="text-black font-bold text-xl truncate">
                        Admin
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          user?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-[#7D68BC] font-medium text-xs mb-1">
                    Email Address
                  </p>
                  <p className="text-black text-sm break-all">{user?.email}</p>
                </div>

                <div>
                  <p className="text-[#7D68BC] font-medium text-xs mb-1">
                    Email Status
                  </p>
                  <div className="flex items-center gap-2">
                    {user?.isEmailVerified ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-green-700 text-sm font-medium">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-600 text-sm">
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 pb-5 pt-2 border-t border-[#A78BFA]/30 space-y-2">
                <button
                  className="w-full bg-gradient-to-r from-[#A78BFA] to-[#5835C0] hover:from-[#9370DB] hover:to-[#4B2DA8] text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
