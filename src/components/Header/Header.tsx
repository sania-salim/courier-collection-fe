import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    LocalShipping,
    Search,
    ViewList,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
    StyledHeaderActionsContainer,
    StyledLogoMark,
} from './Header.style';
import paths from '@/router/routes';

const navButtonSx = {
    textTransform: 'none' as const,
    fontWeight: 600,
    borderRadius: 2,
    px: 2,
    '&.active': {
        bgcolor: 'primary.light',
        color: 'primary.dark',
    },
};

const Header = () => {
    const { theme, setDarkTheme, setLightTheme } = useThemeContext();
    const lightMode = theme === 'light';

    const toggleMode = () => {
        if (lightMode) setDarkTheme();
        else setLightTheme();
    };

    return (
        <AppBar
            color="transparent"
            position="sticky"
            elevation={0}
            sx={{
                backdropFilter: 'blur(12px)',
                backgroundColor: (t) =>
                    t.palette.mode === 'light'
                        ? 'rgba(255,255,255,0.85)'
                        : 'rgba(15,23,42,0.85)',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{ justifyContent: 'space-between', py: 1.5 }}
                >
                    <NavLink
                        to={paths.ROOT_PATH}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <StyledLogoMark>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: (t) =>
                                        `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                                }}
                            >
                                <LocalShipping
                                    sx={{ color: '#fff', fontSize: 22 }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Courier Collection
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Package operations
                                </Typography>
                            </Box>
                        </StyledLogoMark>
                    </NavLink>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            component={NavLink}
                            to={paths.ROOT_PATH}
                            startIcon={<ViewList />}
                            sx={navButtonSx}
                        >
                            Packages
                        </Button>
                        <Button
                            component={NavLink}
                            to={paths.TRACKING_PATH}
                            startIcon={<Search />}
                            sx={navButtonSx}
                        >
                            Track
                        </Button>
                    </Box>

                    <StyledHeaderActionsContainer>
                        <IconButton
                            title="Switch theme"
                            color="primary"
                            onClick={toggleMode}
                        >
                            {lightMode ? <DarkMode /> : <LightMode />}
                        </IconButton>
                    </StyledHeaderActionsContainer>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
