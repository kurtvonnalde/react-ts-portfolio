import {clsx} from "clsx";
import type { ReactNode } from "react";
import "./coming-soon.css";


export interface ComingSoonProps {
    text?: string;
    className?: string;
    children?: ReactNode;
}

export function ComingSoon({
    text = "Coming Soon...",
    className,
    children
}: ComingSoonProps) {
    return (
        <div className={clsx("coming-soon-wrapper", className)}>
            <div className="coming-soon-overlay">
                <span className="coming-soon-text">{text}</span>
            </div>
            {children && (
                <div className="coming-soon-blurred">
                    {children}
                </div>
            )}
        </div>
    );
}
