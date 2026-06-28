import { Box, Typography } from '@mui/material';
import { PackageStatus } from '@/types/package';
import { getStatusIndex } from '@/utils/statusUtils';

type Milestone = {
    label: string;
    color: string;
};

const MILESTONES: Milestone[] = [
    { label: 'Package dropped off', color: '#ef4444' },
    { label: 'Shipped', color: '#eab308' },
    { label: 'Out for delivery', color: '#06b6d4' },
    { label: 'Delivered', color: '#86efac' },
];

const getActiveMilestoneIndex = (status: PackageStatus): number => {
    if (status === 'DELAYED') return 1;
    const idx = getStatusIndex(status);
    if (idx <= 1) return 0;
    if (idx <= 4) return 1;
    if (idx <= 6) return 2;
    return 3;
};

type PackageTrackingStepperProps = {
    status: PackageStatus;
};

const PackageTrackingStepper = ({ status }: PackageTrackingStepperProps) => {
    const activeIndex = getActiveMilestoneIndex(status);

    return (
        <Box sx={{ pl: 1 }}>
            {MILESTONES.map((milestone, index) => {
                const isComplete = index < activeIndex;
                const isCurrent = index === activeIndex;
                const isUpcoming = index > activeIndex;

                return (
                    <Box
                        key={milestone.label}
                        sx={{ display: 'flex', gap: 2, minHeight: 72 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 48,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    bgcolor: isUpcoming
                                        ? 'grey.300'
                                        : milestone.color,
                                    border: isCurrent ? 3 : 0,
                                    borderColor: 'primary.dark',
                                    boxShadow: isCurrent
                                        ? `0 0 0 4px rgba(13, 148, 136, 0.25)`
                                        : 'none',
                                }}
                            />
                            {index < MILESTONES.length - 1 && (
                                <Box
                                    sx={{
                                        width: 2,
                                        flex: 1,
                                        bgcolor: isComplete
                                            ? milestone.color
                                            : 'grey.300',
                                        my: 0.5,
                                    }}
                                />
                            )}
                        </Box>
                        <Box sx={{ pt: 0.25, pb: 2 }}>
                            <Typography
                                variant="body1"
                                fontWeight={isCurrent ? 700 : 400}
                                color={
                                    isUpcoming ? 'text.disabled' : 'text.primary'
                                }
                            >
                                {milestone.label}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default PackageTrackingStepper;
