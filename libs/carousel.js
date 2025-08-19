import { URL_IMG } from "../api/urlAPI.js"
const exportCarousel = (ds = [], elementID) => {
    let html = ``;
    html += `<div id="carouselId" class="carousel slide text-center" data-ride="carousel">`;
    html += `<div class="carousel-inner" role="listbox">`
    ds.slice(0, 4).forEach((item, index) => {
        let clsActive = (index == 0) ? "active" : "";
        html += `
        <div class="carousel-item ${clsActive}">
            <img src="${URL_IMG}/${item.Ma_so}.png" alt="First slide" class="img-fluid">
            <div class="carousel-caption d-none d-md-block">
               
            </div>
            <div class="text-center mt-2">
            <h4 class ="titillium-web-light text-dark">${item.Ten}</h4>
                <p class ="titillium-web-semibold-italic text-dark">Price: ${item.Don_gia_Ban.toLocaleString()}<sup>đ</sup> </p>
                </div>
        </div>
        `
    })
    html += `
    
    </div>
        <a class="carousel-control-prev" href="#carouselId" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselId" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>
    `
    elementID.innerHTML = html;
}

export { exportCarousel }
/*
    css/myStyle.css
    .carousel-control-prev-icon{
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23f00' viewBox='0 0 8 8'%3e%3cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3e%3c/svg%3e");
}
    .carousel-control-next-icon{
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23f00' viewBox='0 0 8 8'%3e%3cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3e%3c/svg%3e");
}
========================

tivi/index.html
<div id="displayCarousel"></div>
*/