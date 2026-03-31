import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}