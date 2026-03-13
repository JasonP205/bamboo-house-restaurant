import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { Toast } from "@heroui/react";

function App() {
  return (
    <>
      <Toast.Provider placement="top"/>
      <Router>
        <div className="min-w-screen min-h-svh">
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="auth" element={<Outlet />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
