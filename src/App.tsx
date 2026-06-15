import { Route, Routes } from "react-router";
import { LoginPage } from "./pages/login";
import { LoginWrapper } from "./components/login-wrapper";
import { OtpPage } from "./pages/otp";
import { DashboardLayout } from "./components/dashboard-layout";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/product";
import { SignupPage } from "./pages/sign-up";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} >
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
      </Route>
      <Route path="/login" element={<LoginWrapper />} >
        <Route index element={<LoginPage />} />
        <Route path="otp" element={<OtpPage />} />
      </Route>
      <Route path="/signup" element={<LoginWrapper />} >
        <Route index element={<SignupPage />} />
      </Route>
    </Routes>
  )
}

export default App;
