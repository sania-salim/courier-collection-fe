import {
    DependencyList,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createRoot, Root } from 'react-dom/client';
import L from 'leaflet';

type LeafletReactIconOptions = {
    size?: [number, number];
    anchor?: [number, number];
    className?: string;
};

/**
 * Renders a React node into a Leaflet DivIcon via createRoot.
 * Pass `null` content to hide the icon (returns null).
 */
export function useLeafletReactIcon(
    content: ReactNode | null,
    deps: DependencyList,
    options: LeafletReactIconOptions = {}
): L.DivIcon | null {
    const {
        size = [32, 32],
        anchor = [16, 16],
        className = 'leaflet-react-icon',
    } = options;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);
    const [icon, setIcon] = useState<L.DivIcon | null>(null);

    const sizeKey = `${size[0]}x${size[1]}`;
    const anchorKey = `${anchor[0]}x${anchor[1]}`;

    useEffect(() => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.width = `${size[0]}px`;
        container.style.height = `${size[1]}px`;
        containerRef.current = container;

        const root = createRoot(container);
        rootRef.current = root;

        const divIcon = L.divIcon({
            className,
            html: container,
            iconSize: size,
            iconAnchor: anchor,
        });
        setIcon(divIcon);

        return () => {
            const rootToUnmount = rootRef.current;
            rootRef.current = null;
            containerRef.current = null;
            setIcon(null);
            // Avoid "unmount while rendering" warnings from React
            queueMicrotask(() => {
                rootToUnmount?.unmount();
            });
        };
        // size/anchor/className identity via keys
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sizeKey, anchorKey, className]);

    useEffect(() => {
        if (!rootRef.current) return;
        rootRef.current.render(content ?? null);
        // Caller supplies deps for when content should refresh
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return content == null ? null : icon;
}
