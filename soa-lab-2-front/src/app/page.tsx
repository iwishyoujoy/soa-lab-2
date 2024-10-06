'use client'

import styles from "./page.module.css";
import {bandsList} from "@/app/mocks/bands";
import {Table} from "@/app/components/Table";
import {DEFAULT_SORT_ORDER, SortContext, SortOrderMap} from "@/app/context/sort";
import {useState} from "react";
import {Button} from "@/app/components/Button";
import {FilterIcon, PlusIcon} from "@/static/icons";

export default function Home() {
    const [sortOrder, setSortOrder] = useState<SortOrderMap>(DEFAULT_SORT_ORDER);

    return (
        <SortContext.Provider value={{sortOrder, setSortOrder}}>
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Bands</h1>
                    <div className={styles.controls}>
                        <Button style='secondary' size='m'>
                            <FilterIcon className={styles.icon}/>
                            Filter
                        </Button>
                        <Button style='primary' size='l'>
                            <PlusIcon className={`${styles.icon} ${styles.inverted}`}/>
                            Create new band
                        </Button>
                    </div>
                </div>
                <Table bands={bandsList}/>
            </div>
        </SortContext.Provider>
    );
}
