import {GRAMMY_FETCH_URL, MAIN_FETCH_URL} from "@/app/constants";

export type SearchParamType = {
    key: string;
    value: string;
}

export type ErrorResponse = {
    code: string;
    message: string;
}

export const fetchUrl = ({path, params, options, mainApi = true}: {path: string, params?: SearchParamType[],  options?: RequestInit, mainApi?: boolean}): Promise<Response> => {
    let url = `${mainApi ? MAIN_FETCH_URL : GRAMMY_FETCH_URL}${path}`;

    if (params) {
        url += customURLSearchParams(params);
    }

    return fetch(url, options);
};

export function customURLSearchParams(params: SearchParamType[]) {
    let result = '';

    params.forEach(({key, value}, index) => {
        if (index === 0){
            result += `?${key}=${value}`;
        }
        else {
            result += `\&${key}=${value}`;
        }
    })
    return result;
}

export function getErrorMessage(text: string) {
    const response: ErrorResponse = JSON.parse(text);
    return response.message;
}

export function getErrorMessages(text: string) {
    const response: ErrorResponse = JSON.parse(text);
    if (typeof response.message === 'object') {
        const resultMap = Object.values(response.message);
        return resultMap.join(". ");
    }
   return getErrorMessage(text);
}