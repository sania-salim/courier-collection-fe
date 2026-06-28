import { Box, Card, CardContent, Container, Typography } from '@mui/material';

const Home = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Courier Collection — Stage 2
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Frontend scaffold is ready. Pass your requirements and design
                files to start building pages.
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                }}
            >
                {[
                    {
                        title: 'Pages',
                        body: 'Add screens under src/pages/ with co-located types and styles.',
                    },
                    {
                        title: 'Components',
                        body: 'Reusable UI lives in src/components/ (Table, Layout, Header, etc.).',
                    },
                    {
                        title: 'API layer',
                        body: 'Wire endpoints in src/constants/endpoints.ts and src/utils/requests/.',
                    },
                ].map((item) => (
                    <Card key={item.title} variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.body}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default Home;
