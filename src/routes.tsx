import { useContext } from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthContext } from "./context/AuthContext";

import { DoTrain } from "./pages/DoTrain";
import { Login } from "./pages/Login";
import { Management } from "./pages/Management";

export const Routes: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/training"
          component={DoTrain}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/management"
          component={Management}
        />

        <Redirect to="/training" />
      </Switch>
    </BrowserRouter>
  );
};
