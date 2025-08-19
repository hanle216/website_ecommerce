import {getAll} from "../api/urlAPI.js";
let store = {};

const exportStore = (elementID)=>{
    let html = ``;
    html+= `
          <div class="container">
        <h1 class="display-3">${store.Ten}</h1>
        <img src="../images/logo.png" alt="Logo" style="height:60px; margin-bottom:15px;">
        <p class="lead">${store.Dia_chi} - Phone: ${store.Dien_thoai}</p>
        <hr class="my-2" />
        <p>Email: ${store.Email}</p>
        <p class="lead">
          <a
            class="btn btn-org btn-lg"
            href="../about"
            role="button"
            >Read more</a
          >
        </p>
         
      </div>
    `
    elementID.innerHTML = html;
}
getAll("LIST_STORE").then((result)=>{
    store = result[0]
    exportStore(displayStore); //truyền id vô
    console.log(store);
}).catch((err)=>{
    console.log(err);
})
