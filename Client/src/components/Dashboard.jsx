import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";




const Dashboard = () => {
  const [userInfo,setUserInfo]=useState(null);
  useEffect(()=>{
    const data=localStorage.getItem('user-info');
    const userData=JSON.parse(data);
    setUserInfo(userData);
  },[])
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem("user-info");
    navigate("/login");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{userInfo?.name}</h2>
      <h3>{userInfo?.email}</h3>
      <img src={userInfo?.image} alt={userInfo?.email}/>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
