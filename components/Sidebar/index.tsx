"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  ChatBubbleIcon,
  GearIcon,
  ExitIcon,
  ListBulletIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { ModeToggle } from "../DarkModeToggle/DarkMode";
import { AudioAlert } from "../Alert/audio-alert";

export function Sidebar({
  expanded,
  setExpanded,
  className,
}: {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  className?: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <aside
      className={cn(
        "h-full",
        expanded ? "w-40" : "w-16",
        "transition-all duration-300 ease-in-out",
        "text-secondary-foreground border",
        "flex flex-col",
        "relative",
        className
      )}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 flex justify-center items-center">
          <ModeToggle />
        </div>
        <ul className="flex-1 px-2 pt-4 border-t">
          {[
            { icon: HomeIcon, label: "Home", href: "/dashboard" },
            { icon: ListBulletIcon, label: "Filas", href: "/Queue" },
            {
              icon: ExclamationTriangleIcon,
              label: "Incidentes",
              href: "/Incidentes",
            },
          ].map(({ icon: Icon, label, href }) => (
            <li key={label} className="mb-1">
              <Link
                href={href}
                className={cn(
                  "flex items-center p-2 rounded-lg hover:bg-primary/10",
                  !expanded && "justify-center"
                )}
              >
                <Icon className="h-5 w-5" />
                {expanded && (
                  <span className="ml-3 tracking-wider">{label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t flex flex-col p-3 pt-5">
          <div className="flex items-center mb-2">
            <AudioAlert />
            {expanded && (
              <Button
                variant="ghost"
                className="flex items-center p-2 rounded-lg tracking-wider hover:bg-primary/10 w-full justify-start ml-2"
              >
                <span>Notifications</span>
              </Button>
            )}
          </div>
          {[
            { icon: ChatBubbleIcon, label: "Messages", onClick: () => {} },
            { icon: GearIcon, label: "Settings", onClick: () => {} },
          ].map(({ icon: Icon, label, onClick }) => (
            <Button
              key={label}
              variant="ghost"
              className={cn(
                "flex items-center p-1 rounded-lg hover:bg-primary/10 w-full justify-start mb-2",
                !expanded && "justify-center"
              )}
              onClick={onClick}
            >
              <Icon className="h-5 w-5" />
              {expanded && <span className="ml-3 tracking-wider">{label}</span>}
            </Button>
          ))}
          <Button
            variant="ghost"
            className={cn(
              "flex items-center p-1 rounded-lg hover:bg-primary/10 w-full justify-start",
              !expanded && "justify-center"
            )}
            onClick={handleLogout}
          >
            <ExitIcon className="h-5 w-5" />
            {expanded && <span className="ml-3 tracking-wider">Logout</span>}
          </Button>
        </div>
      </nav>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-3 bg-secondary",
          "hover:bg-primary/10",
          "p-1.5 h-7 w-6"
        )}
      >
        {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Button>
    </aside>
  );
}
