import axiosClient from '../services/axios';

export const get = <T = unknown>(endpoint: string) => {
    return axiosClient.get<T>(endpoint);
};

export const patch = <T = unknown>(
    endpoint: string,
    data: Record<string, unknown>
) => {
    return axiosClient.patch<T>(endpoint, data);
};
