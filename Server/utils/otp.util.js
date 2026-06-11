const otpGenerator=async(req,res)=>{
     let otp = 0;

        for (let i = 0; i < 6; i++) {

            otp = otp * 10 + Math.floor(Math.random() * 10);
        }

        console.log(otp);
}

module.exports=otpGenerator;