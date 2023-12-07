import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Nav from "./component/Nav";
import Login from "./component/Login";
import Join from "./component/Join";
import Home from "./component/Home";
import Search from "./component/Search";
import Campsite from "./component/Campsite";
import NotFound from "./component/NotFound";

function App() {

  // const AuthCheck = ({ children }) => {
  //   const isAuthenticated = localStorage.getItem('jwt');
  //   return isAuthenticated ? children : <Navigate to="/login" />;
  // };

  return (
    <main className='container mx-auto'>
      <BrowserRouter>
        <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)]">
          <Nav />
        </div>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/" element={<Home />} />
            <Route path="/search/:area" element={<Search />} />
            <Route path="/campsite/:area/:camp" element={<Campsite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  );
}

export default App;