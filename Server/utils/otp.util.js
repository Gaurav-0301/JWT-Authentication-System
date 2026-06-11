const otpGenerator = () => {
    let otp = 0;

    for (let i = 0; i < 6; i++) {
        otp = otp * 10 + Math.floor(Math.random() * 10);
    }

    
    return otp.toString();
}

module.exports = otpGenerator;