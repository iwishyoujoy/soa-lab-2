import {FilterMap} from "@/app/context/filter";

export const getFilterQuery = (filterMap: FilterMap) => {
    const appliedFilters = Object.entries(filterMap)
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        .filter(([_, filter]) => filter.value && filter.operator !== undefined)
        .map(([key, filter], index) => {
            if (index === 0) return encodeURIComponent(`${key}[${filter.operator}]${filter.value}`);
            return "filter=" + encodeURIComponent(`${key}[${filter.operator}]${filter.value}`);
        })

    return appliedFilters.length > 0 ? appliedFilters.join('&') : undefined;
}