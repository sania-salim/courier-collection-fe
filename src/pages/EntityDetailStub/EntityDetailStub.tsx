import { ArrowBack } from '@mui/icons-material';
import { pageShellSx } from '@/styles/pageLayout';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

type EntityDetailStubProps = {
    entityLabel: string;
    listPath: string;
    idParam?: string;
};

const EntityDetailStub = ({
    entityLabel,
    listPath,
    idParam = 'id',
}: EntityDetailStubProps) => {
    const params = useParams();
    const navigate = useNavigate();
    const id = params[idParam];

    return (
        <Box sx={pageShellSx}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(listPath)}
                sx={{ mb: 3 }}
            >
                Back to {entityLabel.toLowerCase()}s
            </Button>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                ID: {id}
            </Typography>
            <Typography color="text.secondary">
                Detail view coming soon.
            </Typography>
        </Box>
    );
};

export default EntityDetailStub;
