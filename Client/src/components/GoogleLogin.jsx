
 import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from './Api';
import { useNavigate } from 'react-router-dom';

const GoogleLogin = () => {
   const navigate=useNavigate();
    const responseGoogle=async(authResult)=>{
        console.log("AUTH RESULT:", authResult);
   try {
    if(authResult.code){
        const result=await googleAuth(authResult.code);
        const{email,name,image}=result.data.newUser;
        const {token}=result.data.token;
        const obj={email,name,image,token};
        localStorage.setItem("user-info",JSON.stringify(obj));
        navigate("/dashboard")
        console.log(result.data.newUser)
    }
    console.log(authResult);
   } catch (error) {
    console.error("error "+error.message);
   }
    }
    const googleLogin=useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
        flow:"auth-code"
    })

  return (
    <div>
     <button onClick={googleLogin}>
  Google Login
</button>
    </div>
  )
}

export default GoogleLogin
