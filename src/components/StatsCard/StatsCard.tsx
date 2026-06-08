import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { ReactNode } from 'react';

type StatsCardProps = {
    title: string;
    value: number | string;
    icon: ReactNode;
    accent: string;
    loading?: boolean;
};

const StatsCard = ({ title, value, icon, accent, loading }: StatsCardProps) => {
    if (loading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Skeleton width="60%" />
                    <Skeleton width="40%" height={40} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                },
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: accent,
                            color: '#fff',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
