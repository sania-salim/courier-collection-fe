import axiosClient from '../services/axios';

export const get = <T = unknown>(endpoint: string) => {
    return axiosClient.get<T>(endpoint);
};

export const post = <T = unknown>(
    endpoint: string,
    data: Record<string, unknown>
) => {
    return axiosClient.post<T>(endpoint, data);
};

export const patch = <T = unknown>(
    endpoint: string,
    data: Record<string, unknown>
) => {
    return axiosClient.patch<T>(endpoint, data);
};

export const del = <T = unknown>(endpoint: string) => {
    return axiosClient.delete<T>(endpoint);
};
