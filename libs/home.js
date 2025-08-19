import { getAll, URL_IMG } from "../api/urlAPI.js"
let listProduct = [];
let listTmp = [];
const exportProductBestSeller = (elementID, nhom = 1) => {
  let pageMap = {
    1: "../tivi/",
    2: "../mobile/",
    3: "../laptop/",
    4: "../tablet/"
  }; //console.log(pageMap[1]); // "tivi.html"
  let html = ``;
  listProduct.slice(0, 4).forEach((item) => {
    html += `
            <div class="col-6 col-md-3 col-xl-3">
          <div class="card text-center pt-2">
            <img class="card-img-top" src="${URL_IMG}/${item.Ma_so}.png" alt="" />
            <div class="card-body">
              <h4 class="card-title titillium-web-light">${item.Ten}</h4>
              <p class="card-text titillium-web-semibold-italic">Price: ${item.Don_gia_Ban.toLocaleString()}<sup>VND</sup></p>
              <h6 class="text-right titillium-web-extralight"> ${item.Nhom.Ma_so}</h6>
            </div>
            <div class="card-footer d-flex flex-wrap justify-content-between">
                  <a href="javascript:void(0)" onclick="showModal(this)"class="btn btn-sm btn-org mb-2"><i class="fa fa-info-circle" aria-hidden="true"></i> Detail</a>
                  <a href="javascript:void(0)" onclick= "addToCart('${item.Ma_so}',${nhom})" class="btn btn-sm btn-org mb-2"><i class="fa fa-shopping-cart" aria-hidden="true"></i> Add</a>
            </div>
          </div>
        </div>
    `
  });
  html += `
    <div class="col-12 text-right mt-2">
          <a href="${pageMap[nhom]}" class="btn btn-sm btn-rm">Read more</a>
        </div>
    `
  elementID.innerHTML = html;
}
const loadData = () => {
  //Open modal
  document.getElementById("btnLoad").click();
  getAll("LIST_TIVI").then((result) => {
    listProduct = result;
    // console.log(listProduct);
    list.tivi = result
    console.log(list.tivi);
    exportProductBestSeller(displayTivi, 1);
    getAll("LIST_MOBILE").then((result) => {
      listProduct = result;
      list.mobile = result;
      exportProductBestSeller(displayMobile, 2);
      getAll("LIST_LAPTOP").then((result) => {
        listProduct = result;
        list.laptop = result;
        exportProductBestSeller(displayLaptop, 3);
        getAll("LIST_TABLET").then((result) => {
          listProduct = result;
          list.tablet = result;
          exportProductBestSeller(displayTablet, 4);
          //Close modal
          document.getElementById("btnCloseLoad").click();
        })
      })
    })
  })
}
loadData();


const exportListHome = (elementID, data) => {
  let html = ``;
  data.forEach(item => {
    html += `
      <div class="col-6 col-md-3 col-xl-3 mb-2">
        <div class="card text-center pt-2">
          <img class="card-img-top" src="${URL_IMG}/${item.Ma_so}.png" alt="" />
          <div class="card-body">
            <h4 class="card-title titillium-web-light">${item.Ten}</h4>
            <p class="card-text titillium-web-semibold-italic">
              Price: ${item.Don_gia_Ban.toLocaleString()}<sup>VND</sup>
            </p>
            <h6 class="text-right titillium-web-extralight">${item.Nhom.Ma_so}</h6>
          </div>
          <div class="card-footer d-flex flex-wrap justify-content-between">
            <a href="javascript:void(0)" onclick="showModal(this)" class="btn btn-sm btn-org mb-2">
              <i class="fa fa-info-circle"></i> Detail
            </a>
            <a href="javascript:void(0)" onclick="addToCart('${item.Ma_so}',1)" class="btn btn-sm btn-org mb-2">
              <i class="fa fa-shopping-cart"></i> Add
            </a>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("displayTitleResult").innerHTML = `Total: ${listTmp.length}`;
  elementID.innerHTML = html;
}

document.getElementById("btnSearch").onclick = () => {
  let resultSearch = document.getElementById("displaySearch").value.trim().toLowerCase();

  // Gom tất cả sp vào 1 mảng
  let allProducts = [
    ...list.tivi,
    ...list.mobile,
    ...list.laptop,
    ...list.tablet
  ];

  // Lọc theo tên
  listTmp = allProducts.filter(item =>
    item.Ten.toLowerCase().includes(resultSearch)
  );

  if (resultSearch !== "" && listTmp.length > 0) {
    // Ẩn các section gốc
    document.getElementById("displayTivi").parentElement.style.display = "none";
    document.getElementById("displayMobile").parentElement.style.display = "none";
    document.getElementById("displayLaptop").parentElement.style.display = "none";
    document.getElementById("displayTablet").parentElement.style.display = "none";

    // Hiển thị kết quả tìm kiếm
    exportListHome(displayResult, listTmp);
  } else if (resultSearch === "") {
    // Nếu không có từ khóa hoặc không có kết quả → hiện lại 4 section
    document.getElementById("displayTivi").parentElement.style.display = "block";
    document.getElementById("displayMobile").parentElement.style.display = "block";
    document.getElementById("displayLaptop").parentElement.style.display = "block";
    document.getElementById("displayTablet").parentElement.style.display = "block";

    // Clear kết quả tìm kiếm + tiêu đề
    document.getElementById("displayResult").innerHTML = "";
    document.getElementById("displayTitleResult").innerHTML = "";


  } else {
    document.getElementById("displayTivi").parentElement.style.display = "none";
    document.getElementById("displayMobile").parentElement.style.display = "none";
    document.getElementById("displayLaptop").parentElement.style.display = "none";
    document.getElementById("displayTablet").parentElement.style.display = "none";

    document.getElementById("displayResult").innerHTML =
      `<p class="text-danger">No result.</p>`;

    document.getElementById("displayTitleResult").innerHTML = "";
  }

}
