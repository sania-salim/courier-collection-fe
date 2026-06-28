import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import PackageTimeline from '@/components/PackageTimeline/PackageTimeline';
import { PackageScanLog } from '@/types/package';

type ScanLogDialogProps = {
    open: boolean;
    onClose: () => void;
    scanLogs: PackageScanLog[];
};

const ScanLogDialog = ({ open, onClose, scanLogs }: ScanLogDialogProps) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            Scan log history
            <IconButton aria-label="Close" onClick={onClose} size="small">
                <Close />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <PackageTimeline scanLogs={scanLogs} />
        </DialogContent>
    </Dialog>
);

export default ScanLogDialog;
