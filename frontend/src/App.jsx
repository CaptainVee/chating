import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
// import SignUp from "./pages/SignUp";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
    <Router>
      <Routes>
        {/* Route without NavbarDashboard and Sidebar */}

        {/* <Route path="/sign-in" element={<SignIn />} /> */}
        <Route index element={<LoginPage />} />

        {/* Route with NavbarDashboard and Sidebar */}

        <Route
          path="/*"
          element={(
            <>
 
                  <Routes>
                    {/* Nested Routes */}
                    
                    <Route path="/chat" element={<ChatPage />} />
                    
                    {/* <Route path="*" element={<NotFound />} /> */}
                  </Routes>

            </>
          )}
        />

      </Routes>
    </Router>
    {/* <ToastContainer /> */}
    </>
  );
};

export default App;
