import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';



interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const route = useRouter();
  const path = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const getHeaderName = () => {
    switch (path) {
      case '/dashboard/content':
        return 'Content';
      case '/dashboard/analytics':
        return 'Analytics';
      case '/dashboard/keywords':
        return 'Keyword Research with AI';
      case '/dashboard/settings':
        return 'Settings';
      case '/dashboard/history/preview':
        return (
          <span className="flex items-center gap-2">
            <span className="text-gray-400">History</span> <ArrowRight size={22} /> Preview
          </span>
        );
      default:
        return 'Overview';
    }
  };

  const handleSignOut = () => {
    Cookies.remove('auth_token');
    toast.success('You have been signed out successfully.');
    route.push('/login');
  };

  const userInfo = Cookies.get('user');
  const user = userInfo ? JSON.parse(userInfo) : null;

  return (
    <header className="relative h-[110px] bg-[#0D1117] ps-4 md:ps-8 pe-4 md:pe-12 py-4 flex items-center justify-between">
      <div className="absolute bottom-0 left-4 md:left-8 right-4 md:right-12 h-[2px] bg-white/24" />

      <div className="flex items-center space-x-3 z-10">
        <button onClick={onMenuClick} className="md:hidden text-white">
          <Menu size={28} />
        </button>
        <h1 className="text-xl md:text-[32px] font-semibold text-white">{getHeaderName()}</h1>
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
            <span className="text-[#00FFFF] text-xl md:text-[24px] font-normal">{user?.username}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''
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
            <div className="absolute right-0 mt-2 w-64 bg-[#0D1117] rounded-xl shadow-xl border border-gray-700 z-50">
              <div className="px-5 py-5 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00FFFF] shadow-md">
                  <Image
                    src="/images/user-avatar.png"
                    alt="User Avatar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4 w-full text-left space-y-2">
                  <div>
                    <p className="text-[#00FFFF] font-medium text-sm">Name</p>
                    <p className="text-white font-semibold text-sm">{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-[#00FFFF] font-medium text-sm">Email</p>
                    <p className="text-white break-all text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-4">
                <button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
