import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

type ThemeMode = 'dark' | 'light';

const isValidTheme = (value: string | null): value is ThemeMode => {
    return value === 'light' || value === 'dark';
};

type IThemeContext = {
    theme: ThemeMode;
    setDarkTheme: () => void;
    setLightTheme: () => void;
};

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (isValidTheme(storedTheme)) {
            return storedTheme;
        }
        return 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const setDarkTheme = () => {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
    };

    const setLightTheme = () => {
        setTheme('light');
        localStorage.setItem('theme', 'light');
    };

    return (
        <ThemeContext.Provider
            value={{ theme, setDarkTheme, setLightTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): IThemeContext => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};
