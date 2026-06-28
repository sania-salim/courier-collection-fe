import { Box, Card, CardContent, Typography } from '@mui/material';
import { Construction } from '@mui/icons-material';
import { pageCardSx, pageShellSx } from '@/styles/pageLayout';

const ComingSoon = () => {
    return (
        <Box sx={pageShellSx}>
            <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent
                    sx={{
                        ...pageCardSx,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minHeight: 400,
                    }}
                >
                    <Construction
                        sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                    />
                    <Typography color="text.secondary" maxWidth={400}>
                        This section is not built yet. Check back in a future
                        release.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ComingSoon;
