import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorOutline } from '@mui/icons-material';
import paths from '@/router/routes';

const Error = () => {
    return (
        <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
            <ErrorOutline sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Page Not Found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                The page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <Button
                component={Link}
                to={paths.ROOT_PATH}
                variant="contained"
                sx={{ textTransform: 'none' }}
            >
                Back to Packages
            </Button>
        </Container>
    );
};

export default Error;
