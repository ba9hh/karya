import Home from "./pages/home/home";
import Publication from "./pages/publier/publication";
import Login from "./pages/connecter/login";
import Register from "./pages/connecter/register";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./AuthProvider";
import Account from "./pages/connecter/account";
import HouseDetails from "./pages/house/housedeatiltest";
import ModifierHouse from "./pages/publier/modifierhouse";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId =
    "739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com";
  console.log(clientId);
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publication" element={<Publication />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/houses/:id" element={<HouseDetails />} />
          <Route path="/modifierHouse/:id" element={<ModifierHouse />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
