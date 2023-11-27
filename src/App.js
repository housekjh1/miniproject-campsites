import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Nav from "./component/Nav";
import Login from "./component/Login";
import Home from "./component/Home";
import Detail from "./component/Detail";
import NotFound from "./component/NotFound";

function App() {

  const AuthCheck = ({ children }) => {
    const isAuthenticated = localStorage.getItem('jwt');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <main className='container mx-auto'>
      <BrowserRouter>
        <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)]">
          <Nav />
        </div>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthCheck><Home /></AuthCheck>} />
            <Route path="/detail/:area" element={<AuthCheck><Detail /></AuthCheck>} />
            <Route path="*" element={<AuthCheck><NotFound /></AuthCheck>} />
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  );
}

export default App;