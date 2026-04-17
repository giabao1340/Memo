import { BrowserRouter, Routes, Route } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import SignInPage from "./pages/SignInPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import TestPage from "./pages/TestPage";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }
    return () => disconnectSocket();
  }, [accessToken]);
  return (
    <>
      <Toaster></Toaster>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/test" element={<TestPage />} />
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
