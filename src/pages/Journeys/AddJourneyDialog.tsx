import { useCallback, useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Route } from '@/types/route';
import { Vehicle } from '@/types/vehicle';
import { fetchRoutes } from '@/utils/requests/route.api';
import { createJourney } from '@/utils/requests/journey.api';
import { fetchUnassignedVehicles } from '@/utils/requests/vehicle.api';
import { fromDateTimeLocalValue } from '@/utils/journeyUtils';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { validateRequired } from '@/utils/formValidation';

type AddJourneyDialogProps = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

type FormState = {
    vehicle: Vehicle | null;
    route: Route | null;
    isLocal: boolean;
    scheduledDepartureAt: string;
};

type TouchedState = {
    vehicle: boolean;
    route: boolean;
    scheduledDepartureAt: boolean;
};

const initialForm: FormState = {
    vehicle: null,
    route: null,
    isLocal: false,
    scheduledDepartureAt: '',
};

const initialTouched: TouchedState = {
    vehicle: false,
    route: false,
    scheduledDepartureAt: false,
};

const AddJourneyDialog = ({ open, onClose, onSuccess }: AddJourneyDialogProps) => {
    const [form, setForm] = useState<FormState>(initialForm);
    const [touched, setTouched] = useState<TouchedState>(initialTouched);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadOptions = useCallback(async () => {
        setLoadingOptions(true);
        try {
            const [vehicleRes, routeRes] = await Promise.all([
                fetchUnassignedVehicles(),
                fetchRoutes(),
            ]);
            setVehicles(vehicleRes.data);
            setRoutes(routeRes.data);
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to load form options'));
        } finally {
            setLoadingOptions(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            setForm(initialForm);
            setTouched(initialTouched);
            loadOptions();
        }
    }, [open, loadOptions]);

    const vehicleError =
        touched.vehicle && !form.vehicle ? 'Vehicle is required' : '';
    const routeError = touched.route && !form.route ? 'Route is required' : '';
    const scheduledError = touched.scheduledDepartureAt
        ? validateRequired(form.scheduledDepartureAt, 'Scheduled departure')
        : undefined;

    const handleSubmit = async () => {
        setTouched({
            vehicle: true,
            route: true,
            scheduledDepartureAt: true,
        });

        if (!form.vehicle || !form.route || !form.scheduledDepartureAt) {
            return;
        }

        setSubmitting(true);
        try {
            await createJourney({
                vehicleId: form.vehicle.id,
                routeId: form.route.id,
                isLocal: form.isLocal,
                scheduledDepartureAt: fromDateTimeLocalValue(
                    form.scheduledDepartureAt
                ),
            });
            toast.success('Journey created');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to create journey'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Journey</DialogTitle>
            <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <Autocomplete
                        options={vehicles}
                        loading={loadingOptions}
                        value={form.vehicle}
                        onChange={(_, value) =>
                            setForm((prev) => ({ ...prev, vehicle: value }))
                        }
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, vehicle: true }))
                        }
                        getOptionLabel={(option) =>
                            `Vehicle ${option.vehicleNumber}`
                        }
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Vehicle"
                                required
                                error={Boolean(vehicleError)}
                                helperText={
                                    vehicleError ||
                                    (vehicles.length === 0 && !loadingOptions
                                        ? 'No unassigned vehicles available'
                                        : 'Unassigned vehicles only')
                                }
                            />
                        )}
                    />

                    <Autocomplete
                        options={routes}
                        loading={loadingOptions}
                        value={form.route}
                        onChange={(_, value) =>
                            setForm((prev) => ({ ...prev, route: value }))
                        }
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, route: true }))
                        }
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Route"
                                required
                                error={Boolean(routeError)}
                                helperText={routeError}
                            />
                        )}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.isLocal}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isLocal: event.target.checked,
                                    }))
                                }
                            />
                        }
                        label="Is Local (pickup run)"
                    />

                    <TextField
                        label="Scheduled Departure"
                        type="datetime-local"
                        required
                        fullWidth
                        value={form.scheduledDepartureAt}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                scheduledDepartureAt: event.target.value,
                            }))
                        }
                        onBlur={() =>
                            setTouched((prev) => ({
                                ...prev,
                                scheduledDepartureAt: true,
                            }))
                        }
                        error={Boolean(scheduledError)}
                        helperText={scheduledError}
                        InputLabelProps={{ shrink: true }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting || loadingOptions}
                >
                    Create journey
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddJourneyDialog;
