import { Chip } from '@mui/material';
import { BagStatus } from '@/types/sealedBag';
import {
    BAG_STATUS_CHIP_COLORS,
    getBagStatusLabel,
} from '@/utils/statusUtils';

type BagStatusChipProps = {
    status: BagStatus;
    size?: 'small' | 'medium';
};

const BagStatusChip = ({ status, size = 'small' }: BagStatusChipProps) => (
    <Chip
        label={getBagStatusLabel(status)}
        color={BAG_STATUS_CHIP_COLORS[status]}
        size={size}
        variant="filled"
    />
);

export default BagStatusChip;
