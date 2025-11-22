import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Bot, Users, Settings, DollarSign, MessageSquare, Megaphone, Calendar } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation()
    const pathname = location.pathname

    const items = [
        {
            title: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
        },
        {
            title: "Bot Builder",
            href: "/bots",
            icon: Bot,
        },
        {
            title: "Clients",
            href: "/clients",
            icon: Users,
        },
        {
            title: "Chats",
            href: "/chats",
            icon: MessageSquare,
        },
        {
            title: "Deals",
            href: "/deals",
            icon: DollarSign,
        },
        {
            title: "Marketing",
            href: "/marketing",
            icon: Megaphone,
        },
        {
            title: "Calendar",
            href: "/calendar",
            icon: Calendar,
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ]

    return (
        <div className={cn("pb-12 w-64 border-r min-h-screen bg-gray-50/40", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
                        BotX
                    </h2>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
