import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronFirst,
  ChevronLast,
  Home,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  AppWindowMac,
} from "lucide-react";
import { ModeToggle } from "../DarkModeToggle/DarkMode";

type SidebarProps = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

export function Sidebar({ expanded, setExpanded }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "h-screen",
        expanded ? "w-64" : "w-16",
        "transition-all duration-300 ease-in-out",
        "bg-secondary text-secondary-foreground",
        "flex flex-col",
        "relative" // Mantém isso para o posicionamento do botão
      )}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          <AppWindowMac />
        </div>
        <ul className="flex-1 px-3">
          {[{ icon: Home, label: "Home", href: "/dashboard" }].map(
            ({ icon: Icon, label, href }) => (
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
            )
          )}
        </ul>

        <div className="border-t flex flex-col p-3">
          {[
            { icon: Bell, label: "Notifications", onClick: () => {} },
            { icon: MessageSquare, label: "Messages", onClick: () => {} },
            { icon: Settings, label: "Settings", onClick: () => {} },
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
          <ModeToggle/>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center p-2 rounded-lg hover:bg-primary/10 w-full justify-start",
              !expanded && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
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
        {expanded ? <ChevronFirst /> : <ChevronLast />}
      </Button>
    </aside>
  );
}