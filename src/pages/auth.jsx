// auth.jsx — redirect to login
import { Navigate } from 'react-router-dom';
const Auth = () => <Navigate to="/login" replace />;
export default Auth;
