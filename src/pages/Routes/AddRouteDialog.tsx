import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    ArrowDownward,
    ArrowUpward,
    Delete,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import RouteStopsMap from '@/components/RouteStopsMap/RouteStopsMap';
import { Region } from '@/types/region';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { validateRequired } from '@/utils/formValidation';
import { fetchRegions } from '@/utils/requests/region.api';
import { addRouteStop, createRoute } from '@/utils/requests/route.api';

type AddRouteDialogProps = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

type FormFields = 'name' | 'code';

const emptyForm = { name: '', code: '' };

const AddRouteDialog = ({ open, onClose, onSuccess }: AddRouteDialogProps) => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<FormFields, string>>>(
        {}
    );
    const [touched, setTouched] = useState<Partial<Record<FormFields, boolean>>>(
        {}
    );
    const [stops, setStops] = useState<Region[]>([]);
    const [stopsTouched, setStopsTouched] = useState(false);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadRegions = useCallback(async () => {
        setLoadingRegions(true);
        try {
            const res = await fetchRegions();
            setRegions(res.data);
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to load regions'));
        } finally {
            setLoadingRegions(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            setForm(emptyForm);
            setErrors({});
            setTouched({});
            setStops([]);
            setStopsTouched(false);
            setSelectedRegion(null);
            loadRegions();
        }
    }, [open, loadRegions]);

    const availableRegions = useMemo(
        () =>
            regions.filter(
                (region) => !stops.some((stop) => stop.id === region.id)
            ),
        [regions, stops]
    );

    const validateField = (
        field: FormFields,
        value: string
    ): string | undefined => validateRequired(value, field === 'name' ? 'Route name' : 'Route code');

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

    const handleAddStop = () => {
        if (!selectedRegion) return;
        setStops((prev) => [...prev, selectedRegion]);
        setSelectedRegion(null);
        setStopsTouched(true);
    };

    const moveStop = (index: number, direction: -1 | 1) => {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= stops.length) return;
        setStops((prev) => {
            const next = [...prev];
            [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
            return next;
        });
    };

    const removeStop = (index: number) => {
        setStops((prev) => prev.filter((_, i) => i !== index));
        setStopsTouched(true);
    };

    const validateAll = (): boolean => {
        const nextErrors: Partial<Record<FormFields, string>> = {
            name: validateField('name', form.name),
            code: validateField('code', form.code),
        };
        setErrors(nextErrors);
        setTouched({ name: true, code: true });
        setStopsTouched(true);
        return (
            !Object.values(nextErrors).some(Boolean) && stops.length >= 2
        );
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;

        setSubmitting(true);
        try {
            const routeRes = await createRoute({
                name: form.name.trim(),
                code: form.code.trim(),
            });

            await Promise.all(
                stops.map((stop, index) =>
                    addRouteStop({
                        routeId: routeRes.data.id,
                        regionId: stop.id,
                        stopOrder: index + 1,
                    })
                )
            );

            toast.success('Route created');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to create route'));
        } finally {
            setSubmitting(false);
        }
    };

    const stopsError =
        stopsTouched && stops.length < 2
            ? 'Add at least two region stops'
            : undefined;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add Route</DialogTitle>
            <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Route Name"
                            required
                            fullWidth
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                            error={Boolean(touched.name && errors.name)}
                            helperText={touched.name ? errors.name : undefined}
                        />
                        <TextField
                            label="Route Code"
                            required
                            fullWidth
                            value={form.code}
                            onChange={(e) => handleChange('code', e.target.value)}
                            onBlur={() => handleBlur('code')}
                            error={Boolean(touched.code && errors.code)}
                            helperText={touched.code ? errors.code : undefined}
                        />
                    </Stack>

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Region stops
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                            <Autocomplete
                                options={availableRegions}
                                loading={loadingRegions}
                                value={selectedRegion}
                                onChange={(_, value) => setSelectedRegion(value)}
                                getOptionLabel={(option) =>
                                    `${option.name} (${option.regionCode})`
                                }
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                sx={{ flex: 1 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Add region stop"
                                        size="small"
                                    />
                                )}
                            />
                            <Button
                                variant="outlined"
                                onClick={handleAddStop}
                                disabled={!selectedRegion}
                                sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                            >
                                Add stop
                            </Button>
                        </Stack>
                        {stopsError && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: 'block' }}
                            >
                                {stopsError}
                            </Typography>
                        )}
                    </Box>

                    {stops.length > 0 && (
                        <List dense disablePadding sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                            {stops.map((stop, index) => (
                                <ListItem
                                    key={stop.id}
                                    secondaryAction={
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => moveStop(index, -1)}
                                                disabled={index === 0}
                                                aria-label="Move stop up"
                                            >
                                                <ArrowUpward fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => moveStop(index, 1)}
                                                disabled={index === stops.length - 1}
                                                aria-label="Move stop down"
                                            >
                                                <ArrowDownward fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => removeStop(index)}
                                                aria-label="Remove stop"
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    }
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${stop.name}`}
                                        secondary={stop.regionCode}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Route preview
                        </Typography>
                        {stops.length >= 2 ? (
                            <RouteStopsMap regions={stops} />
                        ) : (
                            <Box
                                sx={{
                                    height: 160,
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'action.hover',
                                }}
                            >
                                <Typography color="text.secondary" variant="body2">
                                    Add at least two stops to preview the route on the map
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting || loadingRegions}
                >
                    Create route
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRouteDialog;
