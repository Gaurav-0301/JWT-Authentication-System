
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate=useNavigate();
  return (
    <div>
      <h1>404-Not Found </h1>
      <button onClick={()=>{navigate("/login")}}>Login</button>
    </div>
  )
}

export default NotFoundPage
