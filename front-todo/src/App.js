import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginReg from "./pages/auth/LoginReg";
import Layout from "./pages/Layout";
import { useSelector } from "react-redux";
// import Todo from "./components/tod";
import Card from "./components/Card";
// import "./App.css"
function App() {
  const { access_token } = useSelector(state => state.auth)
  const chekcenv = () => {
    const env_c = `${process.env.REACT_APP_BASE_URL}`
    console.log("-----",env_c)
    if (env_c){
      console.log("-----",`${process.env.REACT_APP_BASE_URL}`)
      return "working"
    }
    else{
      return "not working"
    }
  }
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            { <Route index element={!access_token ? <LoginReg /> : <Navigate to="/home" />} /> }
            <Route path="login" index element={!access_token ? <LoginReg /> : <Navigate to="/home" />} />
            </Route>

          <Route path="/home" element={access_token ? <Card /> : <Navigate to="/login" />} />
          {/* <Route path="/home" element={<Card />} /> */}

          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
