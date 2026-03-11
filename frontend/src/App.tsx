import { BrowserRouter, Routes, Route } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import SignInPage from "./pages/SignInPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

function App() {
  const { isDark, setTheme } = useThemeStore();
  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);
  return (
    <>
      <Toaster></Toaster>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
