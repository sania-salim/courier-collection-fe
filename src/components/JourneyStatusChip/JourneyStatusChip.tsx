import { Chip } from '@mui/material';
import { JourneyStatus } from '@/types/journey';
import {
    getJourneyStatusLabel,
    JOURNEY_STATUS_CHIP_COLORS,
} from '@/utils/statusUtils';

type JourneyStatusChipProps = {
    status: JourneyStatus;
    size?: 'small' | 'medium';
};

const JourneyStatusChip = ({
    status,
    size = 'small',
}: JourneyStatusChipProps) => (
    <Chip
        label={getJourneyStatusLabel(status)}
        color={JOURNEY_STATUS_CHIP_COLORS[status]}
        size={size}
        variant="filled"
    />
);

export default JourneyStatusChip;
