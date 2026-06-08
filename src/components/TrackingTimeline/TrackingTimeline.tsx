import {
    Box,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import { PackageStatus } from '@/types/package';
import {
    getStatusIndex,
    getStatusLabel,
    STATUS_ORDER,
} from '@/utils/statusUtils';
import StatusChip from '../StatusChip/StatusChip';

type TrackingTimelineProps = {
    currentStatus: PackageStatus;
};

const TrackingTimeline = ({ currentStatus }: TrackingTimelineProps) => {
    const activeStep = getStatusIndex(currentStatus);
    const isDelayed = currentStatus === 'delayed';

    return (
        <Box>
            {isDelayed && (
                <Box sx={{ mb: 2 }}>
                    <StatusChip status="delayed" size="medium" />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        This shipment is experiencing delays. We&apos;re working
                        to get it back on track.
                    </Typography>
                </Box>
            )}
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{ mt: 2 }}
            >
                {STATUS_ORDER.map((step) => (
                    <Step key={step} completed={getStatusIndex(step) < activeStep}>
                        <StepLabel>
                            <Typography variant="caption" fontWeight={600}>
                                {getStatusLabel(step)}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default TrackingTimeline;
