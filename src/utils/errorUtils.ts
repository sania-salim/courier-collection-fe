import axios from 'axios';

export const getApiErrorMessage = (
    error: unknown,
    fallback = 'Something went wrong'
): string => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message =
            (error.response?.data as { error?: string } | undefined)?.error;

        if (status === 404) {
            return message ?? 'The requested item was not found.';
        }
        if (status === 409) {
            return message ?? 'This action conflicts with the current state.';
        }
        if (message) return message;
    }

    return fallback;
};
