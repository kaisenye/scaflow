import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavbarLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  isActive?: boolean;
  className?: string;
}

export default function NavbarLink({ href, children, icon, isActive = false, className }: NavbarLinkProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        `flex flex-col gap-0 px-2 py-2 rounded transition-colors duration-200 ${
          isActive 
            ? "bg-gray-200 font-medium" 
            : "hover:bg-gray-200"
        }`,
        className
      )}
    >
      <span className="flex items-center gap-4">
        <span className={`text-base ${isActive ? "text-black" : ""}`}>{icon}</span>
        <span className="text-sm">{children}</span>
      </span>
    </Link>
  );
} 