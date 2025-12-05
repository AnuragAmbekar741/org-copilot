// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LandingPage, Home, Scenario, Login, Signup } from "@/views";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/home" element={<Home />} />
          <Route path="/dashboard/scenario" element={<Scenario />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
