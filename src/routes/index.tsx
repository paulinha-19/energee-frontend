import { createBrowserRouter } from 'react-router-dom';

// project-imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, LoginRoutes]);

export default router;
