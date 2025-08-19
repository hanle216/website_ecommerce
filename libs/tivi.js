import { getAll, URL_IMG } from "../api/urlAPI.js"
import { exportCarousel } from "../libs/carousel.js"

let listTmp = [];
let listTivi = [];
let listCate = [
  { Ma_so: "ALL", Ten: "All" },
  { Ma_so: "SAMSUNG", Ten: "Samsung" },
  { Ma_so: "SONY", Ten: "Sony" },
  { Ma_so: "LG", Ten: "LG" },
  { Ma_so: "OTHER", Ten: "Other" }
];

const loadData = () => {
  document.getElementById("btnLoad").click();
  getAll("LIST_TIVI").then((result) => {
    listTivi = result;
    listTmp = result; //gán để lưu danh sách gốc của Tivi, nếu ko gán = result. thì listTmp = [] như ban đầu
    list.tivi = result;

    //Hiển thị danh sách và category của Tivi
    exportListTivi(displayListTivi);
    exportCateTivi();

    //Xử lý lọc sản phẩm theo Category
    let cateTivi = document.querySelectorAll(".list-group-item");

    //lặp qua từng phần tử category
    cateTivi.forEach((item) => {
      item.onclick = () => {
        document.getElementsByClassName("activeCategory")[0].classList.remove("activeCategory");
        item.classList.add("activeCategory");

        let idCategory = item.getAttribute("idCategory");
        if (idCategory == "ALL") {
          listTmp = listTivi;
        } else {
          listTmp = listTivi.filter((item) => item.Nhom.Ma_so == idCategory);
        }
        exportListTivi(displayListTivi);
      }
    });
    exportCarousel(listTivi, displayCarousel)
    document.getElementById("btnCloseLoad").click();
  });
}
loadData();

//Đổi chiều mũi tên khi click btn Price
document.getElementById("btnPrice").onclick = () => {
  let keySort = document.getElementById("btnPrice").getAttribute("sort");
  //keySort == 1 -> tăng; keySort == 0 -> giảm
  if (Number(keySort == 1)) {
    document.getElementById("btnPrice").setAttribute("sort", 0);
    document.getElementById("btnPrice").innerHTML = "Price &UpArrow;"
    //Sắp xếp theo dạng number
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
  exportListTivi(displayListTivi);
}

//Đổi chiều mũi tên khi click btn Name
document.getElementById("btnName").onclick = () => {
  let keySort = document.getElementById("btnName").getAttribute("sort");
  if (Number(keySort == 1)) {
    document.getElementById("btnName").setAttribute("sort", 0);
    document.getElementById("btnName").innerHTML = "Name &UpArrow;"
    listTmp.sort((a, b) => {
      return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase());
    })
  } else {
    document.getElementById("btnName").setAttribute("sort", 1);
    document.getElementById("btnName").innerHTML = "Name &DownArrow;"
    //Sắp xếp theo dạng chuỗi
    listTmp.sort((a, b) => {
      return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase());
    })
  }
  exportListTivi(displayListTivi);
}
//Click tìm sản phẩm
document.getElementById("btnSearch").onclick = () => {
  // Lấy giá trị người dùng nhập vào ô tìm kiếm (có id là "displaySearch")
  let resultSearch = document.getElementById("displaySearch").value;
  listTmp = listTivi.filter((item) => item.Ten.toLowerCase().includes(resultSearch.toLowerCase()));
  exportListTivi(displayListTivi);
}
/* 
filter(): lọc các phần tử trong mảng dựa trên một điều kiện và trả về một mảng mới
includes(): kiểm tra xem tên tivi có chứa từ khóa tìm kiếm không
 */

const exportListTivi = (elementID) => {
  let html = ``;
  listTmp.forEach((item) => {
    html += `
            <div class="col-6 col-md-3 col-xl-3 mb-2">
          <div class="card text-center pt-2">
            <img class="card-img-top" src="${URL_IMG}/${item.Ma_so}.png" alt="" />
            <div class="card-body">
              <h4 class="card-title titillium-web-light">${item.Ten}</h4>
              <p class="card-text titillium-web-semibold-italic">Price: ${item.Don_gia_Ban.toLocaleString()}<sup>VND</sup></p>
              <h6 class="text-right titillium-web-extralight"> ${item.Nhom.Ma_so} </h6>
            </div>
            <div class="card-footer d-flex flex-wrap justify-content-between">
                  <a href="javascript:void(0)" onclick="showModal(this)" class="btn btn-sm btn-org mb-2"><i class="fa fa-info-circle" aria-hidden="true"></i> Detail</a>
                  <a href="javascript:void(0)" onclick= "addToCart('${item.Ma_so}',1)" class="btn btn-sm btn-org mb-2"><i class="fa fa-shopping-cart" aria-hidden="true"></i> Add</a>
            </div>
          </div>
        </div>
    `
  });
  document.getElementById("displayTitleTivi").innerHTML = `Total: ${listTmp.length}`;
  elementID.innerHTML = html;
}

const exportCateTivi = () => {
  let html = ``;
  listCate.forEach((item) => {
    html += `
    <a href="javascript:void(0)" idCategory="${item.Ma_so}" class="${item.Ma_so == 'ALL' ? 'activeCategory' : ''} list-group-item list-group-item-action">${item.Ten}</a>
    `
  })
  document.getElementById("displayCateTivi").innerHTML = html;
}

