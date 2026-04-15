import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import SiteDetails from "./pages/SiteDetails";
import Anomalies from "./pages/Anomalies";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/sites/:id" element={<SiteDetails />} />
          <Route path="/anomalies" element={<Anomalies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;