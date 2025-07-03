import type { ReactNode } from "react";
import './section.css';

interface SectionProps {
    title: string;
    children: ReactNode;
    showAll?: boolean;
    icon?: string;
}

export const Section = ({ title, children, showAll = false, icon }: SectionProps) => (
    <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {icon && `${icon} `}{title}
            </h2>
            {showAll ? (
                <button className="text-gray-400 hover:text-white text-sm">
                    Посмотреть все
                </button>
            ) : (
                <div className="hidden sm:block w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            )}
        </div>
        {children}
    </section>
);