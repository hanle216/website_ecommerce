import dotenv from 'dotenv'; //để lấy được PORT,DBNAME,URL
dotenv.config();
import { createTransport } from "nodemailer";

class handleMail {
    sendGMail(from, to, subject, body) {
        let transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PWD_GMAIL
            }
        });
        //Tạo email
        let mailOptions = {
            from: `SuLand Product <${from}>`,
            to: to,
            subject: subject,
            html: body
        }
        //Gọi phương thức sendMal -> trả về dạng Promoise
        return transporter.sendMail(mailOptions);
    }
}
var sendMail = new handleMail();
export default sendMail;