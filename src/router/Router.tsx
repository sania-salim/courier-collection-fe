import Error from '@/pages/Error/Error';
import EntityDetailStub from '@/pages/EntityDetailStub/EntityDetailStub';
import BusinessList from '@/pages/Businesses/BusinessList';
import JourneyList from '@/pages/Journeys/JourneyList';
import PackageDetail from '@/pages/Packages/PackageDetail';
import PackageList from '@/pages/Packages/PackageList';
import RegionList from '@/pages/Regions/RegionList';
import RouteList from '@/pages/Routes/RouteList';
import SealedBagList from '@/pages/SealedBags/SealedBagList';
import VehicleList from '@/pages/Vehicles/VehicleList';
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
                    <Route index element={<Navigate to={paths.PACKAGES_PATH} replace />} />
                    <Route path={paths.PACKAGES_PATH} element={<PackageList />} />
                    <Route
                        path={`${paths.PACKAGES_PATH}/:code`}
                        element={<PackageDetail />}
                    />
                    <Route path={paths.BAGS_PATH} element={<SealedBagList />} />
                    <Route
                        path={`${paths.BAGS_PATH}/:id`}
                        element={
                            <EntityDetailStub
                                entityLabel="Sealed Bag"
                                listPath={paths.BAGS_PATH}
                            />
                        }
                    />
                    <Route path={paths.VEHICLES_PATH} element={<VehicleList />} />
                    <Route
                        path={`${paths.VEHICLES_PATH}/:id`}
                        element={
                            <EntityDetailStub
                                entityLabel="Vehicle"
                                listPath={paths.VEHICLES_PATH}
                            />
                        }
                    />
                    <Route path={paths.JOURNEYS_PATH} element={<JourneyList />} />
                    <Route
                        path={`${paths.JOURNEYS_PATH}/:id`}
                        element={
                            <EntityDetailStub
                                entityLabel="Journey"
                                listPath={paths.JOURNEYS_PATH}
                            />
                        }
                    />
                    <Route path={paths.ROUTES_PATH} element={<RouteList />} />
                    <Route path={paths.REGIONS_PATH} element={<RegionList />} />
                    <Route
                        path={`${paths.REGIONS_PATH}/:id`}
                        element={
                            <EntityDetailStub
                                entityLabel="Region"
                                listPath={paths.REGIONS_PATH}
                            />
                        }
                    />
                    <Route path={paths.BUSINESSES_PATH} element={<BusinessList />} />
                </Route>
                <Route path={paths.ERROR_PATH} element={<Error />} />
                <Route path="*" element={<Navigate to="/error" />} />
            </Routes>
        </Router>
    );
};

export default RouterContainer;
