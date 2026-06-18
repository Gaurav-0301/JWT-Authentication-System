
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from './components/GoogleLogin'
import Dashboard from './components/Dashboard'
import NotFoundPage from './components/NotFoundPage';


const App = () => {

  const GoogleAuthWrapper=()=>{
    return(
      <GoogleOAuthProvider clientId="174010930498-t9n1ao7jlf6oh4tc9gh2la8h1vo8e5v6.apps.googleusercontent.com">
        <GoogleLogin></GoogleLogin>
      </GoogleOAuthProvider>
    );
    
  }
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<GoogleAuthWrapper/>}></Route>
        <Route path='/' element={<GoogleAuthWrapper/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='*' element={<NotFoundPage/>}></Route>
        
        </Routes>
        
        </BrowserRouter>
    </>
  )
}

export default App

