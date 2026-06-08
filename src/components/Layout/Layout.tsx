import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const Layout = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <main>
                <Outlet />
            </main>
        </Box>
    );
};

export default Layout;
