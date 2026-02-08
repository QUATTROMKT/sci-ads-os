import { LayoutDashboard, Users, CreditCard, CheckSquare, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Clientes', href: '/clients' },
    { icon: CreditCard, label: 'Financeiro', href: '/finance' },
    { icon: CheckSquare, label: 'Tarefas', href: '/tasks' },
    { icon: FileText, label: 'Contratos', href: '/contracts' },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold text-primary">Sci Ads OS</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t p-4">
                <nav className="space-y-1">
                    <Link
                        to="/settings"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Link>
                    <button
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                    <div className="px-3 py-2 text-xs text-muted-foreground opacity-50">
                        v1.2 (Latest)
                    </div>
                </nav>
            </div>
        </div>
    );
}
