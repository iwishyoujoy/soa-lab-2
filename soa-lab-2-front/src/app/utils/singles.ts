import {Single} from "@/app/types/single";

export function convertStringToSingles(text: string) {
    const quotes = text.match(/"/g)?.length;
    if (text.length && !quotes) throw new Error("Please use quotes to enter singles");

    let singles = text.split(new RegExp(/"\s*,/));

    if (singles.length * 2 !== quotes) throw new Error("Please use quotes for each single twice");

    singles = singles.map((single) => single.trim().replace(new RegExp(/^"/), '').replace(new RegExp(/"$/), ''));
    const result: Single[] = singles.map((single) => ({name: single}));
    return result;
}