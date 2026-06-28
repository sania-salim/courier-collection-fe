import RouterContainer from './router/Router';
import { createTheme, ThemeProvider } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { getMuiTheme } from './styles/theme';
import { ToastContainer } from 'react-toastify';

function App() {
    const { theme } = useThemeContext();
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <ThemeProvider theme={createTheme(getMuiTheme(theme))}>
                <RouterContainer />
            </ThemeProvider>
        </>
    );
}

export default App;
