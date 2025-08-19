import { apiSendMail } from "../api/urlAPI.js"

document.getElementById("btnSend").onclick = () => {
    document.getElementById("errFullName").innerHTML = "";
    document.getElementById("errEmail").innerHTML = "";
    document.getElementById("errTitle").innerHTML = "";
    document.getElementById("errContent").innerHTML = "";

    let fullName = document.getElementById("displayFullName").value;
    let email = document.getElementById("displayEmail").value;
    let title = document.getElementById("displayTitle").value;
    let content = CKEDITOR.instances.displayContent.getData();

    //Kiểm tra dữ liệu khác rỗng
    if (fullName == "") {
        document.getElementById("errFullName").innerHTML = "(*)";
        document.getElementById("displayFullName").focus()
        return false;

    }
    if (email == "") {
        document.getElementById("errEmail").innerHTML = "(*)";
        document.getElementById("displayEmail").focus();
        return false;
    }
    //Tạo nội dung email gửi
    let html = `<p>Fullname: ${fullName} </p>`;
    html += `<p>Email: ${email} </p>`;
    html += `<p><b></b></p>`;
    html += `Content: ${content}`;
    let userContact = {
        title: title,
        body: html
    }
    //Gọi API sendMail
    apiSendMail(userContact).then((result) => {
        console.log(result); 
        if (result.noiDung) {
            // noiDung lấy từ server hiện lên
            alert(`Your message has been sent successfully. Thank you for contacting us!`);
        } else {
            alert(`We’re experiencing issues with our email system. Please contact us directly via our hotline: (028) 38.351.056.`);
        }
    })
    // window.history.back();
};