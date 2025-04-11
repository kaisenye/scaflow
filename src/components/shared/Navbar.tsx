'use client'

import Link from "next/link";
import NavbarLink from "./NavbarLink";
import { VscGithubProject } from "react-icons/vsc";
import { LuUser, LuSettings } from "react-icons/lu";
import { PiFiles } from "react-icons/pi";
import { usePathname } from "next/navigation";


export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  
  return (
    <div className="w-full top-0 left-0 flex flex-col justify-between h-screen pl-4 pr-2 py-4 bg-gray-100 text-black">
      <div>
        {/* Logo and title */}
        <Link href="/" className="flex items-center mb-8">
          {/* <Image src="/logo.png" alt="ScaFlow Logo" width={32} height={32} /> */}
          <h2 className="text-xl font-bold ml-2">ScaFlow</h2>
        </Link>

        <nav>
          <ul className="space-y-2">
            <li className="mb-1">
              <NavbarLink href="/vault" icon={<PiFiles />} isActive={isActive('/vault')}>Vault</NavbarLink>
            </li>
            <li className="mb-1">
              <NavbarLink href="/projects" icon={<VscGithubProject />} isActive={isActive('/projects')}>Projects</NavbarLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col gap-1 mb-10">
        <NavbarLink href="/profile" icon={<LuUser />} isActive={isActive('/profile')}>Profile</NavbarLink>
        <NavbarLink href="/settings" icon={<LuSettings />} isActive={isActive('/settings')}>Settings</NavbarLink>
      </div>
    </div>
  );
} 