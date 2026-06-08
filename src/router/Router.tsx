import Error from '@/pages/Error/Error';
import PackageListing from '@/pages/PackageListing/PackageListing';
import Tracking from '@/pages/Tracking/Tracking';
import Layout from '@/components/Layout/Layout';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import paths from './routes';

const RouterContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path={paths.ROOT_PATH} element={<Layout />}>
                    <Route index element={<PackageListing />} />
                    <Route path="tracking" element={<Tracking />} />
                </Route>
                <Route path={paths.ERROR_PATH} element={<Error />} />
                <Route path="*" element={<Navigate to="/error" />} />
            </Routes>
        </Router>
    );
};

export default RouterContainer;
