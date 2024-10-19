import {SortOrderMap} from "@/app/context/sort";
import {SortOrder} from "@/app/types/sort";

export const getSortQuery = (sortMap: SortOrderMap) => {
    const appliedSorts = Object.entries(sortMap)
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        .filter(([_, order]) => order !== SortOrder.UNDEFINED)
        .map(([key, order], index) => {
            if (index === 0) return encodeURIComponent(`${key}[${order}]`);
            return "sort=" + encodeURIComponent(`${key}[${order}]`);
        });

    return appliedSorts.length > 0 ? appliedSorts.join('&') : undefined;
}