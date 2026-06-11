const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
    tls: {
        
        rejectUnauthorized: false
    }
});

const sendOtpEmail=async(toEmail,otpCode)=>{
    try {
        const mailOption={
           from: `"Security Team" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Your OTP Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #333; text-align: center;">Verification Code</h2>
                    <p>Hello,</p>
                    <p>Thank you for choosing our platform. Use the following OTP to complete your verification process. This code is valid for <b>10 minutes</b>:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #4F46E5; border-radius: 4px; margin: 20px 0;">
                        ${otpCode}
                    </div>
                    <p style="font-size: 12px; color: #666;">If you did not request this code, please ignore this email or contact support if you have concerns.</p>
                </div>
            `,
        };
        const info=await transporter.sendMail(mailOption);
        console.log("Email sent successfully: %s", info.messageId);
        return true;
        
    } catch (error) {
        console.error("Nodemailer Error: Failed to send email", error);
        throw new Error("Email delivery failed");
    }
}

module.exports=sendOtpEmail;