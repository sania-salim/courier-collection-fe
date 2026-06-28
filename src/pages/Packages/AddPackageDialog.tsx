import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AddEnterpriseDialog from '@/components/AddEnterpriseDialog/AddEnterpriseDialog';
import { ExternalBusiness } from '@/types/business';
import { CreatePackagePayload } from '@/types/package';
import { Region } from '@/types/region';
import { getApiErrorMessage } from '@/utils/errorUtils';
import {
    validateNonNegativeInt,
    validateRequired,
} from '@/utils/formValidation';
import { createPackage } from '@/utils/requests/package.api';

type AddPackageDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
    regions: Region[];
    businesses: ExternalBusiness[];
    onBusinessCreated: (business: ExternalBusiness) => void;
};

type FormFields =
    | 'code'
    | 'fromRegionId'
    | 'toRegionId'
    | 'fromAddressId'
    | 'toAddress'
    | 'weight';

const emptyForm = {
    code: '',
    fromRegionId: '',
    toRegionId: '',
    fromAddressId: '',
    toAddress: '',
    weight: '',
};

const AddPackageDialog = ({
    open,
    onClose,
    onCreated,
    regions,
    businesses,
    onBusinessCreated,
}: AddPackageDialogProps) => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<FormFields, string>>>(
        {}
    );
    const [touched, setTouched] = useState<Partial<Record<FormFields, boolean>>>(
        {}
    );
    const [submitting, setSubmitting] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedBusiness, setSelectedBusiness] =
        useState<ExternalBusiness | null>(null);
    const [selectedFromRegion, setSelectedFromRegion] = useState<Region | null>(
        null
    );
    const [selectedToRegion, setSelectedToRegion] = useState<Region | null>(
        null
    );

    useEffect(() => {
        if (selectedBusiness) {
            setForm((prev) => ({
                ...prev,
                fromAddressId: selectedBusiness.id,
            }));
        }
    }, [selectedBusiness]);

    useEffect(() => {
        if (selectedFromRegion) {
            setForm((prev) => ({
                ...prev,
                fromRegionId: selectedFromRegion.id,
            }));
        }
    }, [selectedFromRegion]);

    useEffect(() => {
        if (selectedToRegion) {
            setForm((prev) => ({
                ...prev,
                toRegionId: selectedToRegion.id,
            }));
        }
    }, [selectedToRegion]);

    const validateField = (
        field: FormFields,
        value: string
    ): string | undefined => {
        switch (field) {
            case 'code':
                return validateRequired(value, 'Package code');
            case 'fromRegionId':
                return validateRequired(value, 'From region');
            case 'toRegionId':
                return validateRequired(value, 'To region');
            case 'fromAddressId':
                return validateRequired(value, 'Sender enterprise');
            case 'toAddress':
                return validateRequired(value, 'Delivery address');
            case 'weight':
                return validateNonNegativeInt(value, 'Weight (kg)');
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
        setSelectedBusiness(null);
        setSelectedFromRegion(null);
        setSelectedToRegion(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateAll = (): boolean => {
        const nextErrors: Partial<Record<FormFields, string>> = {
            code: validateField('code', form.code),
            fromRegionId: validateField('fromRegionId', form.fromRegionId),
            toRegionId: validateField('toRegionId', form.toRegionId),
            fromAddressId: validateField('fromAddressId', form.fromAddressId),
            toAddress: validateField('toAddress', form.toAddress),
            weight: validateField('weight', form.weight),
        };
        setErrors(nextErrors);
        setTouched({
            code: true,
            fromRegionId: true,
            toRegionId: true,
            fromAddressId: true,
            toAddress: true,
            weight: true,
        });
        return !Object.values(nextErrors).some(Boolean);
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;

        const payload: CreatePackagePayload = {
            code: form.code.trim(),
            fromRegionId: form.fromRegionId,
            toRegionId: form.toRegionId,
            fromAddressId: form.fromAddressId,
            toAddress: form.toAddress.trim(),
        };

        if (form.weight.trim()) {
            payload.weight = Number(form.weight);
        }

        setSubmitting(true);
        try {
            await createPackage(payload);
            toast.success('Package added successfully');
            onCreated();
            handleClose();
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to add package'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEnterpriseCreated = (business: ExternalBusiness) => {
        onBusinessCreated(business);
        setSelectedBusiness(business);
        setTouched((prev) => ({ ...prev, fromAddressId: true }));
        setErrors((prev) => ({ ...prev, fromAddressId: undefined }));
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add Package</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
                >
                    <TextField
                        label="Package code"
                        value={form.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        onBlur={() => handleBlur('code')}
                        error={Boolean(touched.code && errors.code)}
                        helperText={touched.code ? errors.code : ' '}
                        required
                        fullWidth
                    />

                    <Autocomplete
                        options={regions}
                        getOptionLabel={(option) =>
                            `${option.name} (${option.regionCode})`
                        }
                        value={selectedFromRegion}
                        onChange={(_e, value) => {
                            setSelectedFromRegion(value);
                            const id = value?.id ?? '';
                            setForm((prev) => ({ ...prev, fromRegionId: id }));
                            if (touched.fromRegionId) {
                                setErrors((prev) => ({
                                    ...prev,
                                    fromRegionId: validateField(
                                        'fromRegionId',
                                        id
                                    ),
                                }));
                            }
                        }}
                        onBlur={() => handleBlur('fromRegionId')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="From region"
                                required
                                error={Boolean(
                                    touched.fromRegionId && errors.fromRegionId
                                )}
                                helperText={
                                    touched.fromRegionId
                                        ? errors.fromRegionId
                                        : ' '
                                }
                            />
                        )}
                    />

                    <Autocomplete
                        options={regions}
                        getOptionLabel={(option) =>
                            `${option.name} (${option.regionCode})`
                        }
                        value={selectedToRegion}
                        onChange={(_e, value) => {
                            setSelectedToRegion(value);
                            const id = value?.id ?? '';
                            setForm((prev) => ({ ...prev, toRegionId: id }));
                            if (touched.toRegionId) {
                                setErrors((prev) => ({
                                    ...prev,
                                    toRegionId: validateField('toRegionId', id),
                                }));
                            }
                        }}
                        onBlur={() => handleBlur('toRegionId')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="To region"
                                required
                                error={Boolean(
                                    touched.toRegionId && errors.toRegionId
                                )}
                                helperText={
                                    touched.toRegionId ? errors.toRegionId : ' '
                                }
                            />
                        )}
                    />

                    <Box>
                        <Autocomplete
                            options={businesses}
                            getOptionLabel={(option) =>
                                `${option.name} (${option.code})`
                            }
                            value={selectedBusiness}
                            onChange={(_e, value) => {
                                setSelectedBusiness(value);
                                const id = value?.id ?? '';
                                setForm((prev) => ({
                                    ...prev,
                                    fromAddressId: id,
                                }));
                                if (touched.fromAddressId) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        fromAddressId: validateField(
                                            'fromAddressId',
                                            id
                                        ),
                                    }));
                                }
                            }}
                            onBlur={() => handleBlur('fromAddressId')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sender enterprise"
                                    required
                                    error={Boolean(
                                        touched.fromAddressId &&
                                            errors.fromAddressId
                                    )}
                                    helperText={
                                        touched.fromAddressId
                                            ? errors.fromAddressId
                                            : ' '
                                    }
                                />
                            )}
                        />
                        <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => setEnterpriseDialogOpen(true)}
                            sx={{ mt: 1 }}
                        >
                            Add new external business
                        </Button>
                    </Box>

                    <TextField
                        label="Delivery address"
                        value={form.toAddress}
                        onChange={(e) =>
                            handleChange('toAddress', e.target.value)
                        }
                        onBlur={() => handleBlur('toAddress')}
                        error={Boolean(touched.toAddress && errors.toAddress)}
                        helperText={touched.toAddress ? errors.toAddress : ' '}
                        required
                        fullWidth
                        multiline
                        minRows={2}
                    />

                    <TextField
                        label="Weight (kg)"
                        value={form.weight}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        onBlur={() => handleBlur('weight')}
                        error={Boolean(touched.weight && errors.weight)}
                        helperText={
                            touched.weight
                                ? errors.weight
                                : 'Optional — defaults to 0'
                        }
                        fullWidth
                        type="number"
                        slotProps={{ htmlInput: { min: 0, step: 1 } }}
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
                        {submitting ? 'Saving…' : 'Add package'}
                    </Button>
                </DialogActions>
            </Dialog>

            <AddEnterpriseDialog
                open={enterpriseDialogOpen}
                onClose={() => setEnterpriseDialogOpen(false)}
                onCreated={handleEnterpriseCreated}
            />
        </>
    );
};

export default AddPackageDialog;
