let URL_IMG = "https://server-6fed.onrender.com";
let carts = [];
let list = {}; //biến toàn cục, script ko phải type = module (window.list))
/* Quy định
Tivi: 1
Mobile: 2
Laptop: 3
Tablets: 4
 */

const addToCart = (maSo, Nhom) => {
    let result = (Nhom == 1) ? list.tivi : (Nhom == 2) ? list.mobile : (Nhom == 3) ? list.laptop : list.tablet
    console.log(`${maSo} - ${Nhom}`);
    let key = maSo;
    let value = 1;
    let position = -1;

    //Lưu vào session storage
    if (sessionStorage.getItem("carts") != undefined) {
        carts = JSON.parse(sessionStorage.getItem("carts")); //dữ liệu của session storage chỉ lưu dưới dạng chuỗi (string) nên cần parse sang object dạng array
        position = carts.findIndex(item => item.id == key);
    }
    if (position == -1) {
        let tmp = result.find(x => x.Ma_so == key)
        let cart = {
            id: key,
            soLuong: value,
            ten: tmp.Ten,
            donGiaBan: Number(tmp.Don_gia_Ban),
            nhom: Nhom
        }
        carts.push(cart);
    } else {
        carts[position].soLuong += value; //cập nhật lại số lượng
    }
    console.log("Carts:", carts);
    if (carts.length > 0) {
        sessionStorage.setItem("carts", JSON.stringify(carts));
    } else {
        sessionStorage.removeItem("carts");
    }
    let totalItems = carts.reduce((sum, item) => sum + item.soLuong, 0); //sum: biến tích luỹ; item: từng sp trong mảng carts
    displayCart.innerHTML = `(${totalItems})`;
    //thể hiện số lượng khi user click Add
};

const openCart = () => {
    if (sessionStorage.getItem("carts") != undefined) {
        window.location = `../cart/`
    }
};

const deleteCart = () => {
    sessionStorage.removeItem("carts");
    window.history.back();
};

const totalPrice = () => {
    let sum = 0;
    carts = JSON.parse(sessionStorage.getItem("carts"));
    carts.forEach(item => {
        sum += Number(item.soLuong) * Number(item.donGiaBan);
    });
    displayTotalPrice.innerHTML = `Order summary: ${sum.toLocaleString()}<sup>VND</sup>`
};

const deleteItem = (key) => {
    // console.log(key);
    carts = JSON.parse(sessionStorage.getItem("carts"));
    let position = carts.findIndex(item => item.id == key);
    //Delete key cart
    carts.splice(position, 1);
    //Update cart session storage
    sessionStorage.setItem("carts", JSON.stringify(carts));
    //Export cart
    if (carts.length !== 0) {
        exportBuyingProduct(carts);
    } else {
        deleteCart();
    }
};

const updateQuantity = (key, tagQuantiy) => {
    console.log(`${key} - ${tagQuantiy.value}`);
    let newQuantiy = tagQuantiy.value;
    carts = JSON.parse(sessionStorage.getItem("carts"));
    let position = carts.findIndex(item => item.id == key);
    carts[position].soLuong = newQuantiy;
    let newPrice = (newQuantiy) * (carts[position].donGiaBan);
    //Update cart session storage
    sessionStorage.setItem("carts", JSON.stringify(carts));
    document.getElementById(`${key}`).innerHTML = `${newPrice.toLocaleString()}<sup>VND</sup>`
    totalPrice();
};

const orderProduct = () => {
    let listOrder = [];
    //Lấy thông tin khách hàng từ form HTML
    let customer = {
        "fullName": document.querySelector("#fullName").value,
        "phoneNumber": document.querySelector("#phoneNumber").value,
        "email": document.querySelector("#email").value,
        "address": document.querySelector("#address").value
    }
    carts.forEach(item => {
        let oneOrder = {
            "orderDate": new Date().toLocaleDateString(),
            "shippingDate": document.querySelector("#shippingDate").value,
            "quantity": Number(item.soLuong),
            "price": Number(item.donGiaBan),
            "total": Number(item.soLuong) * Number(item.donGiaBan),
            "status": "CHUA_GIAO_HANG",
            "customer": customer
        }
        let id = item.id;
        let customerOrder = {
            nhom: item.nhom,
            key: id,
            order: oneOrder
        }
        listOrder.push(customerOrder);
        console.log(listOrder);
    })
    return listOrder;
};

const exportBuyingProduct = (carts = []) => {
    let html = ``;
    carts.forEach((item) => {
        let totalPrice = item.soLuong * item.donGiaBan;
        html += `
        <tr class="text-nowrap">
              <td scope="row" class="text-center" style="width:10%">
                <img class="img-fluid" src="${URL_IMG}/${item.id}.png" alt="">
              </td>
              <td>${item.ten}</td>
              <td class="text-right">
                <input type="number" min="1" max="10" value="${item.soLuong}" onchange="updateQuantity('${item.id}',this)">
              </td>
              <td class="text-right">
              ${item.donGiaBan.toLocaleString()}<sup>VND</sup>
              </td>
              <td class="text-right" id="${item.id}">
              ${totalPrice.toLocaleString()}<sup>đ</sup>
              </td>
              <td class="text-center">
                <button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
        `
    });
    html += `
    <tr class="text-nowrap">
        <td colspan="6" class="text-right text-danger">
            <span id="displayTotalPrice" style="font-weight: bold;">Order summary: 19.000.000<sup>VND</sup></span>
        </td>
    </tr>
    `
    displayBuyCart.innerHTML = html;
    totalPrice();
};