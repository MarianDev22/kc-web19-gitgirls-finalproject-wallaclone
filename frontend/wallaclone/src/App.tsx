import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateAdvertPage from "./pages/CreateAdvertPage";
import AdvertDetailPage from "./pages/AdvertDetailPage";
import EditAdvertPage from "./pages/EditAdvertPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/adverts/new" element={<CreateAdvertPage />} />
          <Route path="/adverts/:advertId" element={<AdvertDetailPage />} />
          <Route path="/adverts/:advertId/edit" element={<EditAdvertPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
