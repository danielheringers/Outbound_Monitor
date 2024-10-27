import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  ChatBubbleIcon,
  BellIcon,
  GearIcon,
  ExitIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import { ModeToggle } from "../DarkModeToggle/DarkMode";
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

  const handleLogout = () => {
    router.push("/login");
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
        <div className="p-4 pb-2 flex justify-center items-center">
          <ModeToggle />
        </div>
        <ul className="flex-1 px-3">
          {[
            { icon: HomeIcon, label: "Home", href: "/dashboard" },
            { icon: ListBulletIcon, label: "Filas", href: "/Queue" },
          ].map(({ icon: Icon, label, href }) => (
            <li key={label} className="mb-2">
              <Link
                href={href}
                className={cn(
                  "flex items-center p-2 rounded-lg hover:bg-primary/10",
                  !expanded && "justify-center"
                )}
              >
                <Icon className="h-5 w-5" />
                {expanded && <span className="ml-3">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t flex flex-col p-3">
          {[
            { icon: BellIcon, label: "Notifications", onClick: () => {} },
            { icon: ChatBubbleIcon, label: "Messages", onClick: () => {} },
            { icon: GearIcon, label: "Settings", onClick: () => {} },
          ].map(({ icon: Icon, label, onClick }) => (
            <Button
              key={label}
              variant="ghost"
              className={cn(
                "flex items-center p-2 rounded-lg hover:bg-primary/10 w-full justify-start mb-2",
                !expanded && "justify-center"
              )}
              onClick={onClick}
            >
              <Icon className="h-5 w-5" />
              {expanded && <span className="ml-3">{label}</span>}
            </Button>
          ))}
          <Button
            variant="ghost"
            className={cn(
              "flex items-center p-2 rounded-lg hover:bg-primary/10 w-full justify-start",
              !expanded && "justify-center"
            )}
            onClick={handleLogout}
          >
            <ExitIcon className="h-5 w-5" />
            {expanded && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </nav>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-4 bg-secondary",
          "hover:bg-primary/10",
          "p-1.5 h-8 w-6"
        )}
      >
        {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Button>
    </aside>
  );
}
