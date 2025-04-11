import Link from "next/link";
import { ReactNode } from "react";

interface NavbarLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  isActive?: boolean;
}

export default function NavbarLink({ href, children, icon, isActive = false }: NavbarLinkProps) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col gap-0 px-2 py-2 rounded transition-colors duration-200 ${
        isActive 
          ? "bg-gray-200 font-medium" 
          : "hover:bg-gray-200"
      }`}
    >
      <span className="flex items-center gap-4">
        <span className={`text-lg ${isActive ? "text-black" : ""}`}>{icon}</span>
        <span className="text-sm">{children}</span>
      </span>
    </Link>
  );
} 