import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components from v6
import TopHeader from "./Components/Layouts/Header/TopHeader";
import Header from "./Components/Layouts/Header/Header";
import Footer from "./Components/Layouts/Footer/Footer";
import ShopByBrands from "./Components/Layouts/Body/ShopByBrands";
import CollectionPage from "./Components/Layouts/Body/CollectionProducts"; // Import your new CollectionPage
import Enquiry from "./Components/Layouts/Body/Enquiry";
import ProductDetails from "./Components/Layouts/Body/ProductDetails";
import Register from "./Components/Layouts/Auth/User/Register";
import Login from "./Components/Layouts/Auth/User/Login";
import EmailVerificationForm from "./Components/Layouts/Auth/User/Email";
import AuthPage from "./Components/Layouts/Auth/AuthPage";
import ProductList from "./Components/Layouts/Body/ProductList";


function App() {
  const productId = ["8929771684077"];

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProductDetails productId={productId} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<ProductList/>} />
      </Routes>
    </Router>
  );
}

export default App;
