'use client'

import Link from "next/link";
import NavbarLink from "./NavbarLink";
import { VscGithubProject } from "react-icons/vsc";
import { LuSettings } from "react-icons/lu";
import { PiFiles } from "react-icons/pi";
import { usePathname } from "next/navigation";
import Image from "next/image";
import profile from "../../../public/profile.png";

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  
  return (
    <div className="w-full top-0 left-0 flex flex-col justify-between h-screen pl-4 pr-2 py-2 bg-gray-100 text-black">
      <div>
        {/* Logo and title */}
        <Link href="/" className="flex items-center mb-8">
          {/* <Image src="/logo.png" alt="ScaFlow Logo" width={32} height={32} /> */}
          <h2 className="text-xl font-bold ml-2">ScaFlow</h2>
        </Link>

        {/* Profile and Settings */}
        <div className="mb-2 pb-2 border-b border-gray-200">
          <Link 
            href="/profile" 
            className={`flex items-center gap-3 px-2 py-2 rounded transition-colors duration-200 ${
              isActive('/profile') ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-300">
              <Image
                src={profile}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-gray-500">john.doe@test.com</span>
            </div>
          </Link>
          
          <NavbarLink 
            href="/settings" 
            icon={<LuSettings />} 
            isActive={isActive('/settings')}
            className="mt-2"
          >
            Settings
          </NavbarLink>
        </div>

        <nav>
          <ul className="space-y-2">
            <li className="mb-1">
              <NavbarLink href="/knowledge" icon={<PiFiles />} isActive={isActive('/knowledge')}>Knowledge</NavbarLink>
            </li>
            <li className="mb-1">
              <NavbarLink href="/projects" icon={<VscGithubProject />} isActive={isActive('/projects')}>Projects</NavbarLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
} 