import { URL_IMG, getAll } from "../api/urlAPI.js"
import { exportCarousel } from "../libs/carousel.js"
let listMobile = [];
let listTmp = [];
let listCate = [
  { Ma_so: "ALL", Ten: "All" },
  { Ma_so: "ANDROID", Ten: "Android" },
  { Ma_so: "IPHONE", Ten: "IPHONE" }
]


const loadData = () => {
  document.getElementById("btnLoad").click();
  //Lấy dữ liệu từ API và khởi tạo
  getAll("LIST_MOBILE").then((result) => {
    listMobile = result; //list được gán dữ liệu từ server thông qua API => list là dữ liệu gốc
    listTmp = result;
    list.mobile = result;
    const displayListMobile = document.getElementById("displayListMobile");
    exportListMobile(displayListMobile);
    exportCateMobile();

    let cateMobile = document.querySelectorAll('.list-group-item');
    cateMobile.forEach((item) => {
      item.onclick = () => {
        document.getElementsByClassName("activeCategory")[0].classList.remove("activeCategory");
        item.classList.add("activeCategory");

        let idCategory = item.getAttribute("idCategory");
        if (idCategory == "ALL") {
          listTmp = listMobile;
        } else {
          listTmp = listMobile.filter((item) => (item.Nhom.Ma_so == idCategory))
        }
        exportListMobile(displayListMobile);
      };
    });
    exportCarousel(listMobile, displayCarousel);
    document.getElementById("btnCloseLoad").click();
  });
}
loadData();

document.getElementById("btnPrice").onclick = () => {
  let keySort = document.getElementById("btnPrice").getAttribute("sort");
  if (Number(keySort == 1)) {
    document.getElementById("btnPrice").setAttribute("sort", 0);
    document.getElementById("btnPrice").innerHTML = "Price &UpArrow;"
    listTmp.sort((a, b) => {
      return Number(a.Don_gia_Ban) - Number(b.Don_gia_Ban)
    })
  } else {
    document.getElementById("btnPrice").setAttribute("sort", 1);
    document.getElementById("btnPrice").innerHTML = "Price &DownArrow;"
    listTmp.sort((a, b) => {
      return Number(b.Don_gia_Ban) - Number(a.Don_gia_Ban)
    })
  }
  exportListMobile(displayListMobile);
}
document.getElementById("btnName").onclick = () => {
  let keySort = document.getElementById("btnName").getAttribute("sort");
  if (Number(keySort == 1)) {
    document.getElementById("btnName").setAttribute("sort", 0);
    document.getElementById("btnName").innerHTML = "Name &UpArrow;"
    listTmp.sort((a, b) => {
      return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase());
    });
  } else {
    document.getElementById("btnName").setAttribute("sort", 1);
    document.getElementById("btnName").innerHTML = "Name &DownArrow;"
    listTmp.sort((a, b) => {
      return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase());
    });
  }
  exportListMobile(displayListMobile);
}
document.getElementById("btnSearch").onclick = () => {
  let resultSearch = document.getElementById("displaySearch").value;
  listTmp = listMobile.filter((item) => item.Ten.toLowerCase().includes(resultSearch.toLowerCase()));
  exportListMobile(displayListMobile);
}

const exportListMobile = (elementID) => {
  let html = ``;
  listTmp.forEach((item) => {
    html += `
         <div class="col-6 col-md-3 col-xl-3 mb-2">
          <div class="card text-center pt-2">
            <img class="card-img-top" src="${URL_IMG}/${item.Ma_so}.png" alt="" />
            <div class="card-body">
              <h4 class="card-title titillium-web-light">${item.Ten}</h4>
              <p class="card-text titillium-web-semibold-italic">Price: ${item.Don_gia_Ban.toLocaleString()}<sup>VND</sup></p>
              <h6 class="text-right titillium-web-extralight">${item.Nhom.Ma_so}</h6>
            </div>
            <div class="card-footer d-flex flex-wrap justify-content-between">
                  <a href="javascript:void(0)" onclick="showModal(this)" class="btn btn-sm btn-org mb-2"><i class="fa fa-info-circle" aria-hidden="true"></i> Read detail</a>
                  <a href="javascript:void(0)" onclick="addToCart('${item.Ma_so}',2)" class="btn btn-sm btn-org mb-2"><i class="fa fa-shopping-cart" aria-hidden="true"></i> Add</a>
            </div>
          </div>
        </div>
        `
  });
  document.getElementById("displayTitleMobile").innerHTML = `Total: ${listTmp.length}`;
  elementID.innerHTML = html;
};

const exportCateMobile = () => {
  let html = ``;
  listCate.forEach((item) => {
    html += `
    <a href="javascript: void(0)" idCategory= ${item.Ma_so} class="${item.Ma_so == 'ALL' ? 'activeCategory' : ''} list-group-item list-group-item-action">${item.Ten}</a>
    `
  })
  document.getElementById("displayCateMobile").innerHTML = html;
}


