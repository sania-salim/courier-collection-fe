import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { DarkMode, LightMode, LocalShipping, Menu } from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useThemeContext } from '@/contexts/ThemeContext';
import { StyledHeaderActionsContainer, StyledLogoMark } from './Header.style';
import { DRAWER_WIDTH } from '../Sidebar/Sidebar';
import paths, { getPageTitle } from '@/router/routes';

type HeaderProps = {
    onMenuToggle: () => void;
};

const Header = ({ onMenuToggle }: HeaderProps) => {
    const { theme, setDarkTheme, setLightTheme } = useThemeContext();
    const location = useLocation();
    const muiTheme = useTheme();
    const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'));
    const lightMode = theme === 'light';
    const pageTitle = getPageTitle(location.pathname);

    const toggleMode = () => {
        if (lightMode) setDarkTheme();
        else setLightTheme();
    };

    return (
        <AppBar
            color="transparent"
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                ml: { md: `${DRAWER_WIDTH}px` },
                backdropFilter: 'blur(12px)',
                backgroundColor: (t) =>
                    t.palette.mode === 'light'
                        ? 'rgba(255,255,255,0.85)'
                        : 'rgba(15,23,42,0.85)',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    {!isDesktop && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="Open navigation"
                            onClick={onMenuToggle}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    {isDesktop ? (
                        <Typography variant="h6" fontWeight={600} noWrap>
                            {pageTitle}
                        </Typography>
                    ) : (
                        <NavLink
                            to={paths.PACKAGES_PATH}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <StyledLogoMark>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: (t) =>
                                            `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                                    }}
                                >
                                    <LocalShipping sx={{ color: '#fff', fontSize: 20 }} />
                                </Box>
                                <Typography variant="subtitle2" fontWeight={700} noWrap>
                                    {pageTitle}
                                </Typography>
                            </StyledLogoMark>
                        </NavLink>
                    )}
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
        </AppBar>
    );
};

export default Header;
