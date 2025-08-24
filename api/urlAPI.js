const URL_SERVICES = "https://sulandecom.onrender.com"
const URL_IMG = "https://sulandecom.onrender.com"

const getAll = (endPoint) => {
    return new Promise((resolve, reject) => {
        let XHR = new XMLHttpRequest();
        XHR.onload = () => {
            let objResult = JSON.parse(XHR.responseText)
            resolve(objResult);
        }
        let urlAPI = ` ${URL_SERVICES}/${endPoint}`;
        XHR.open("GET", urlAPI);
        XHR.send();
    })
}

const apiOrder = (listOrder) => {
    return new Promise((resolve, reject) => {
        let XHR = new XMLHttpRequest();
        XHR.onload = () => {
            let objResult = JSON.parse(XHR.responseText)
            resolve(objResult);
        }
        let endPoint = "ORDER";
        let urlAPI = `${URL_SERVICES}/${endPoint}`;
        XHR.open("POST", urlAPI);
        XHR.send(JSON.stringify(listOrder));
    })
}

const apiSendMail = (userContact) => {
    return new Promise((resolve, reject) => {
        let XHR = new XMLHttpRequest();
        XHR.onload = () => {
            let objResult = JSON.parse(XHR.responseText)
            resolve(objResult);
        }
        let endPoint = "CONTACT";
        let urlAPI = `${URL_SERVICES}/${endPoint}`;
        XHR.open("POST", urlAPI);
        XHR.send(JSON.stringify(userContact));
    })

}
export { URL_SERVICES, URL_IMG, getAll, apiOrder, apiSendMail }