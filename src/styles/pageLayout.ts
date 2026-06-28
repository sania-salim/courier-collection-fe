/** Shared layout spacing for list and detail pages. */
export const pageShellSx = {
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 3, md: 4 },
    maxWidth: 1440,
    mx: 'auto',
    width: '100%',
} as const;

export const pageActionsSx = {
    mt: 3,
    mb: 3,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
    justifyContent: 'flex-end',
} as const;

export const pageCardSx = {
    p: { xs: 2, sm: 3 },
} as const;
