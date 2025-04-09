import Link from "next/link";
import { ReactNode } from "react";

interface NavbarLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function NavbarLink({ href, children, icon }: NavbarLinkProps) {
  return (
    <Link href={href} className="block px-2 py-2 rounded hover:bg-gray-200 transition-colors duration-200">
      <span className="flex items-center gap-4">
        <span className="text-lg">{icon}</span>
        <span className="text-tiny">{children}</span>
      </span>
    </Link>
  );
} 