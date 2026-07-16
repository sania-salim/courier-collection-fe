import PlaceIcon from '@mui/icons-material/Place';
import { Marker, Tooltip } from 'react-leaflet';
import { useLeafletReactIcon } from '@/hooks/useLeafletReactIcon';

type RegionMapMarkerProps = {
    position: [number, number];
    color: string;
    label: string;
};

const RegionMapMarker = ({ position, color, label }: RegionMapMarkerProps) => {
    const icon = useLeafletReactIcon(
        <PlaceIcon
            sx={{
                fontSize: 36,
                color,
                filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45))',
                display: 'block',
            }}
        />,
        [color],
        {
            size: [36, 36],
            // Tip of the pin sits on the coordinates
            anchor: [18, 36],
            className: 'region-map-marker-icon',
        }
    );

    if (!icon) return null;

    return (
        <Marker position={position} icon={icon}>
            <Tooltip direction="top" offset={[0, -28]}>
                {label}
            </Tooltip>
        </Marker>
    );
};

export default RegionMapMarker;
