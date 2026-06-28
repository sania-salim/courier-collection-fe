import Header from '../Header/Header';
import Sidebar, { DRAWER_WIDTH } from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useState } from 'react';

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header
                onMenuToggle={() => setMobileOpen((open) => !open)}
            />
            <Sidebar
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
