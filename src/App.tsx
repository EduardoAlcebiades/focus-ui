import { Routes } from "./routes";
import { AuthProvider } from "./context/AuthContext";

import "./global/styles.scss";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
