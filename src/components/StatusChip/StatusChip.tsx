import { Chip } from '@mui/material';
import { PackageStatus } from '@/types/package';
import { getStatusLabel, STATUS_CHIP_COLORS } from '@/utils/statusUtils';

type StatusChipProps = {
    status: PackageStatus;
    size?: 'small' | 'medium';
};

const StatusChip = ({ status, size = 'small' }: StatusChipProps) => {
    const color = STATUS_CHIP_COLORS[status];
    const isDelayed = status === 'DELAYED';

    return (
        <Chip
            label={getStatusLabel(status)}
            color={color}
            size={size}
            variant="filled"
            sx={
                isDelayed
                    ? {
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.75 },
                          },
                      }
                    : undefined
            }
        />
    );
};

export default StatusChip;
