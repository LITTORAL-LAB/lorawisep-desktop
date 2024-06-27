import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function NavBar({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const location = useLocation();

    // Function to determine if the link is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="hidden flex-col md:flex bg-sky-950">
            <div className="border-b">
                <div className="flex justify-center h-16 items-center px-4">
                    <nav
                        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
                        {...props}
                    >
                        <Link
                            to="/"
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-muted-foreground",
                                isActive('/') ? "text-white" : "text-primary"
                            )}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/Simuações"
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-muted-foreground",
                                isActive('/') ? "text-white" : "text-primary"
                            )}
                        >
                            Simuações
                        </Link>
                        <Link
                            to="/Simuações"
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-muted-foreground",
                                isActive('/') ? "text-white" : "text-primary"
                            )}
                        >
                            Histórico
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
