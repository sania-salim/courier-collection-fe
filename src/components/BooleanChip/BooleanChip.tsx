import { Chip } from '@mui/material';

type BooleanChipProps = {
    value: boolean;
    trueLabel?: string;
    falseLabel?: string;
    size?: 'small' | 'medium';
};

const BooleanChip = ({
    value,
    trueLabel = 'Yes',
    falseLabel = 'No',
    size = 'small',
}: BooleanChipProps) => (
    <Chip
        label={value ? trueLabel : falseLabel}
        color={value ? 'error' : 'default'}
        size={size}
        variant="filled"
    />
);

export default BooleanChip;
