import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Business,
    Inventory2,
    LocalShipping,
    Place,
    Route,
    ShoppingBag,
    Timeline,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
import paths from '@/router/routes';

const DRAWER_WIDTH = 260;

type NavItem = {
    label: string;
    path: string;
    icon: ReactNode;
};

const navItems: NavItem[] = [
    { label: 'Packages', path: paths.PACKAGES_PATH, icon: <Inventory2 /> },
    { label: 'Sealed Bags', path: paths.BAGS_PATH, icon: <ShoppingBag /> },
    { label: 'Vehicles', path: paths.VEHICLES_PATH, icon: <LocalShipping /> },
    { label: 'Journeys', path: paths.JOURNEYS_PATH, icon: <Timeline /> },
    { label: 'Routes', path: paths.ROUTES_PATH, icon: <Route /> },
    { label: 'Regions', path: paths.REGIONS_PATH, icon: <Place /> },
    {
        label: 'External Businesses',
        path: paths.BUSINESSES_PATH,
        icon: <Business />,
    },
];

type SidebarProps = {
    mobileOpen: boolean;
    onMobileClose: () => void;
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <Box sx={{ overflow: 'auto' }}>
        <Toolbar sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
                Navigation
            </Typography>
        </Toolbar>
        <List sx={{ px: 1 }}>
            {navItems.map((item) => (
                <ListItemButton
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    onClick={onNavigate}
                    sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&.active': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '& .MuiListItemIcon-root': {
                                color: 'primary.contrastText',
                            },
                            '&:hover': { bgcolor: 'primary.dark' },
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                </ListItemButton>
            ))}
        </List>
    </Box>
);

const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <SidebarContent onNavigate={onMobileClose} />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        borderRight: 1,
                        borderColor: 'divider',
                    },
                }}
                open={isDesktop}
            >
                <SidebarContent />
            </Drawer>
        </>
    );
};

export { DRAWER_WIDTH };
export default Sidebar;
