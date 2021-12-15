import { Redirect, Route, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  ...props
}) => {
  if (!isAuthenticated) return <Redirect to="/login" />;

  return <Route {...props} />;
};
