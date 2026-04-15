import { apiFetch } from "@/shared/api/client";

export const getCountries = () => {
    return apiFetch("/countries");
};

export const getCountry = (slug: string) => {
    return apiFetch(`/countries/${slug}`);
};