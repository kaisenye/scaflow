import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavbarLink from "./NavbarLink";
import { VscGithubProject } from "react-icons/vsc";
import { LuUser, LuSettings } from "react-icons/lu";
import { PiFiles } from "react-icons/pi";


export default function Navbar() {
  return (
    <div className="w-full top-0 left-0 flex flex-col justify-between h-screen px-2 py-4 bg-gray-100 text-black">
      <div>
        {/* Logo and title */}
        <Link href="/" className="flex items-center mb-8">
          {/* <Image src="/logo.png" alt="ScaFlow Logo" width={32} height={32} /> */}
          <h2 className="text-xl font-bold ml-2">ScaFlow</h2>
        </Link>

        <nav>
          <ul className="space-y-2">
            <li>
              <NavbarLink href="/vault" icon={<PiFiles />}>Vault</NavbarLink>
            </li>
            <li>
              <NavbarLink href="/projects" icon={<VscGithubProject />}>Projects</NavbarLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <NavbarLink href="/profile" icon={<LuUser />}>User Profile</NavbarLink>
        <NavbarLink href="/settings" icon={<LuSettings />}>Settings</NavbarLink>
      </div>
    </div>
  );
} 