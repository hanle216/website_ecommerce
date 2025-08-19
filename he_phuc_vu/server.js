// Tham chiếu thư viện http của node => tạo server
import http from "http";
// Tham chiếu thư viện File của node (fs) => đọc file trên máy
import fs from "fs";

// Tham chiếu đến tập tin .env
import dotenv from "dotenv";
dotenv.config();

// Khai báo cổng cho dịch vụ từ tập tin .env
const port = process.env.PORT;
//Tham chiếu đến thư viện MongoDB
import db from "./libs/mongoDB.js"
//Tham chiếu đến thư viện sendMail
import sendMail from "./libs/sendMail.js" //do export là default nên đặt tên gi cũng dc

// Cấu hình Dịch vụ
const server = http.createServer((req, res) => {
  let method = req.method;
  let url = req.url;
  // result: là chuỗi, chuỗi JSON
  let result = `Server Node JS - Method: ${method} - Url: ${url}`;
  //Cấp quyền
  res.setHeader("Access-Control-Allow-Origin", '*');
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, OPTIONS, DELETE");
  res.setHeader("ccess-Control-Allow-Credentials", true);


  if (method == "GET") {
    if (url.match(".png$")) {
      let imagePath = `images${url}`;
      if (!fs.existsSync(imagePath)) {
        imagePath = `images/noImage.png`; // Nếu không có, dùng ảnh mặc định
      }
      let fileStream = fs.createReadStream(imagePath);
      res.writeHead(200, { "content-type": "image/png" });
      fileStream.pipe(res); // Gửi nội dung ảnh về trình duyệt
    } else {
      res.writeHead(200, { "content-type": "text/json; charset=utf-8" });
      let collectionName = db.collectionNames[url.replace("/", "")];
      if (collectionName) {
        db.getAll(collectionName).then((result) => {
          res.end(JSON.stringify(result));
        }).catch((err) => {
          console.log(err);
        })
      } else {
        res.end(JSON.stringify("Wrong endpoint: " + " " + result));
      }
    }
  } else if (method == "POST") {
    //Server nhận dữ liệu từ Client gửi về
    let noiDUngNhan = "";
    //Khai báo biến để nhận dữ liệu về
    req.on("data", (data) => {
      noiDUngNhan += data;
    });
    //Server Xử lý dữ liệu và trả kết quả lại cho Client
    if (url == "/LOGIN") {
      req.on("end", () => {
        let ketQua = {
          "noi_dung": true
        }
        let user = JSON.parse(noiDUngNhan);
        // filter chỉ là điều kiện để tìm, Kết quả trả về là toàn bộ document thỏa mãn điều kiện đó
        let filter = {
          $and: [
            { "Ten_Dang_nhap": user.Ten_Dang_nhap },
            { "Mat_khau": user.Mat_khau }
          ]
        }
        db.getOne("user", filter).then((result) => {
          console.log(result);
          if (result) {
            //nếu result có, thì đổi nội dung của noi_dung thành:
            ketQua.noi_dung = {
              Ho_ten: result.Ho_ten,
              Nhom_Nguoi_dung: result.Nhom_Nguoi_dung
            }
            res.end(JSON.stringify(ketQua));
          } else {
            ketQua.noi_dung = false;
            res.end(JSON.stringify(ketQua))
          }
        }).catch((err) => {
          console.log(err);
        })
      });
    } else if (url == "/ORDER") {
      req.on("end", () => {
        let listOrder = [];
        listOrder = JSON.parse(noiDUngNhan); //parse JSON string thành object mảng
        let ketQua = { "noiDung": [] };
        listOrder.forEach(item => {
          let filter = {
            "Ma_so": item.key
          }
          let collectionName = (item.nhom == 1) ? "tivi" : (item.nhom == 2) ? "mobile" : (item.nhom == 3) ? "laptop" : "tablet";
          console.log("Đang tìm với filter:", filter, "collection:", collectionName);
          db.getOne(collectionName, filter).then((result) => {
            if (!result) {
              console.log(`Không tìm thấy sản phẩm với Ma_so = ${item.key} trong collection ${collectionName}`);
              return;
            }
            //item.order = đơn hàng mới người dùng gửi lên
            item.order.So_Phieu_Dat = result.Danh_sach_Phieu_Dat.length + 1; //đếm số phiếu đặt
            result.Danh_sach_Phieu_Dat.push(item.order); //thêm đơn hàng mới vào Danh_sach_Phieu_Dat
            //Cập nhật trở lại mongo db
            let update = {
              $set: { Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat }
            }
            //Dùng để báo cho client biết đơn nào thành công / thất bại.
            let obj = {
              "id": result.Ma_so,
              "Update": true
            }
            db.updateOne(collectionName, filter, update).then((result) => {
              if (result.modifiedCount == 0) {
                obj.Update = false;
              }
              ketQua.noiDung.push(obj);
              console.log("Kết quả:", ketQua.noiDung);
              if (ketQua.noiDung.length == listOrder.length) {
                res.end(JSON.stringify(ketQua)); //Gửi JSON string chứa kết quả về cho client (trình duyệt)
              }
            }).catch((err) => {
              console.log(err);
            })
          })
        });
      });
    } else if (url == "/CONTACT") {
      req.on("end", () => {
        //Lấy dữ liệu mà client gửi lên
        let contactInfo = JSON.parse(noiDUngNhan);
        // Lấy tiêu đề và nội dung email từ client gửi
        let subject = contactInfo.title;
        let body = contactInfo.body;
        body += "<hr>"
        let ketQua = { "noiDung": true };
        let from = process.env.USER_GMAIL;
        let to = "tester21699@gmail.com";
        // body += "<hr>Nội dung: Hello Su Su!!";
        sendMail.sendGMail(from, to, subject, body).then((result) => {
          console.log(result);
          res.end(JSON.stringify(ketQua)); // Trả kết quả cho client
        }).catch((err) => {
          console.log(err);
          ketQua.noiDung = false;
          res.end(JSON.stringify(ketQua));
        })
      })
    } else if (url == "/INSERT_MOBILE") {
      req.on("end", () => {
        let ketQua = {
          "noiDung": true
        }
        let newDocument = JSON.parse(noiDUngNhan);
        db.insertOne("mobile", newDocument).then((result) => {
          console.log(result);
          res.end(JSON.stringify(ketQua));
        }).catch((err) => {
          console.error("Error insert user: ", err);
          ketQua.noiDung = false;
          res.end(JSON.stringify(ketQua));
        })
      })
    } else if (url == "/UPLOAD_IMG_MOBILE") {
      res.on("end", () => {
        let img = JSON.parse(noiDUngNhan);
        let ketQua = {
          "noiDung": true
        }
        //Upload image in images server
        let ketQuaImg = saveMedia(img.name, img.src)
        if (ketQuaImg == "OK") {
          res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" })
          res.end(JSON.stringify(ketQua));
        } else {
          ketQua.noiDung = false;
          res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" })
          res.end(JSON.stringify(ketQua));
        }
      })

    } else {
      res.end(result);
    }
  } else if (method == "PUT") {
    //Server nhận dữ liệu gửi từ Client
    let noiDungNhan = "";
    req.on("data", (data) => {
      noiDungNhan += data;
    });
    //Server Xử lý dữ liệu và trả kết quả lại cho Client
    if (url == "/UPDATE_MOBILE") {
      req.on("end", () => {
        let mobileUpdate = JSON.parse(noiDungNhan);
        let ketQua = {
          "noiDung": true
        }
        db.updateOne("mobile", mobileUpdate.condition, mobileUpdate.update).then((result) => {
          console.log(result);
          res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" })
          res.end(JSON.stringify(ketQua));
        }).catch((err) => {
          console.log(err);
          ketQua.noiDung = false;
          res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" })
          res.end(JSON.stringify(ketQua));
        });
      });
    } else {
      res.end(result);
    }
  } else if (method == "DELETE") {
    //Server nhận dữ liệu gửi từ Client
    let noiDUngNhan = "";
    req.on("data", (data) => {
      noiDUngNhan += data;
    });
    //Server Xử lý dữ liệu và trả kết quả lại cho Client
    if (url == "/DELETE_MOBILE") {
      req.on("end", () => {
        let ketQua = {
          "noiDung": true
        }
        let filter = JSON.parse(noiDUngNhan);
        db.deleteOne("mobile", filter).then((result) => {
          console.log(result);
          res.end(JSON.stringify(result));
        }).catch((err) => {
          console.error("Error delete mobile", err);
          ketQua.noiDung = false;
          res.end(JSON.stringify(result));
        });
      })
    } else {
      res.end(result);
    }
  } else {
    res.end(result);
  }
});

// Khai báo cổng cho hệ phục vụ (port web)
server.listen(port, () => {
  console.log(`Dịch vụ thực thi tại địa chỉ: http://localhost:${port}`);
});

//Upload media
let decodeBase64Image = (dataString) => {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Error ...');
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], 'base64');

  return response;
}
//Save media
let saveMedia = (Ten, Chuoi_nhi_phan) => {
  var ketQua = "OK"
  try {
    var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
    var Duong_dan = "images//" + Ten
    fs.writeFileSync(Duong_dan, Nhi_phan.data);
  } catch (Loi) {
    ketQua = Loi.toString()
  }
  return ketQua;
}
