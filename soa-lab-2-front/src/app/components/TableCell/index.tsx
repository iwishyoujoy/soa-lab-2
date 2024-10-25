'use client'

import styles from './styles.module.css';
import {PropsWithChildren, useState, useEffect, useRef} from "react";
import {Sort} from "@/app/components/Sort";
import {Property} from "@/app/types/property";

type TableCellProps = {
    cellKey?: Property;
    className?: string;
    withSort?: boolean;
    overflow?: boolean;
    cellLength?: number;
}

export const TableCell = ({ className, cellKey, cellLength, withSort = false, overflow = false, children }: PropsWithChildren<TableCellProps>) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (overflow && cellLength && cellLength > 30) {
            setShowPopup(true);
        }
    };

    const handleMouseLeave = () => {
        if (showPopup) {
            setShowPopup(false);
        }
    };

    return (
        <div className={`${styles.container} ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={popupRef}>
            <div
                className={styles.cell}
            >
                {children}
            </div>
            {(withSort === true && cellKey !== undefined) &&
                <Sort sortKey={cellKey}/>
            }
            {showPopup && overflow && (
                <div className={styles.popup}>
                    {children}
                </div>
            )}
        </div>
    )
}
