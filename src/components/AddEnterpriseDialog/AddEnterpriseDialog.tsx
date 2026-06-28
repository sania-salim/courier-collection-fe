import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ExternalBusiness } from '@/types/business';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { validateRequired } from '@/utils/formValidation';
import { createExternalBusiness } from '@/utils/requests/business.api';

type AddEnterpriseDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreated: (business: ExternalBusiness) => void;
};

type FormFields = 'name' | 'code' | 'address';

const emptyForm = { name: '', code: '', address: '' };

const AddEnterpriseDialog = ({
    open,
    onClose,
    onCreated,
}: AddEnterpriseDialogProps) => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<FormFields, string>>>(
        {}
    );
    const [touched, setTouched] = useState<Partial<Record<FormFields, boolean>>>(
        {}
    );
    const [submitting, setSubmitting] = useState(false);

    const validateField = (field: FormFields, value: string): string | undefined => {
        switch (field) {
            case 'name':
                return validateRequired(value, 'Business name');
            case 'code':
                return validateRequired(value, 'Business code');
            case 'address':
                return validateRequired(value, 'Address');
            default:
                return undefined;
        }
    };

    const handleBlur = (field: FormFields) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, form[field]),
        }));
    };

    const handleChange = (field: FormFields, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (touched[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: validateField(field, value),
            }));
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setErrors({});
        setTouched({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateAll = (): boolean => {
        const nextErrors: Partial<Record<FormFields, string>> = {
            name: validateField('name', form.name),
            code: validateField('code', form.code),
            address: validateField('address', form.address),
        };
        setErrors(nextErrors);
        setTouched({ name: true, code: true, address: true });
        return !Object.values(nextErrors).some(Boolean);
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;

        setSubmitting(true);
        try {
            const res = await createExternalBusiness({
                name: form.name.trim(),
                code: form.code.trim(),
                address: form.address.trim(),
            });
            toast.success('External business added successfully');
            onCreated(res.data);
            handleClose();
        } catch (err) {
            toast.error(
                getApiErrorMessage(err, 'Failed to add external business')
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add External Business</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                    label="Business name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name ? errors.name : ' '}
                    required
                    fullWidth
                />
                <TextField
                    label="Business code"
                    value={form.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    onBlur={() => handleBlur('code')}
                    error={Boolean(touched.code && errors.code)}
                    helperText={touched.code ? errors.code : 'Unique identifier, e.g. ACME-01'}
                    required
                    fullWidth
                />
                <TextField
                    label="Address"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address ? errors.address : ' '}
                    required
                    fullWidth
                    multiline
                    minRows={2}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Saving…' : 'Add business'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEnterpriseDialog;
