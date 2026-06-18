import axios from "axios"

const Api=axios.create({
    baseURL:"http://localhost:2724/auth"
});


export const googleAuth=(code)=>Api.get(`/google?code=${code}`);