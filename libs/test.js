const jsonString = '{"name": "John Doe", "age": 30, "city": "New York"}';
const javascriptObject = JSON.parse(jsonString);

console.log(javascriptObject, typeof (javascriptObject));
console.log(javascriptObject.name); // Output: John Doe
console.log(javascriptObject.age);  // Output: 30

const jsonArrayString = '[{"item": "apple", "price": 1.0}, {"item": "banana", "price": 0.5}]';
const javascriptArray = JSON.parse(jsonArrayString);

console.log(javascriptArray,typeof(javascriptArray));
console.log(javascriptArray[0].item); // Output: apple

// const doTask = (taskName, callback) => {
//     console.log(`Dang thuc hien ${taskName}`);  //in ra đầu tiên
//     setTimeout(() => {
//         console.log(`${taskName} done!`); //sau 2 giây sẽ in ra
//         callback();                       //sau khi set timeout dc in, mới tới hàm callback
//     }, 2000)
// }
// doTask("Rửa chén", () => {
//     console.log(`Nghỉ ngơi`);
// });


// const doTask = (taskName) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (taskName !== "Hỏng việc") {
//                 console.log(`${taskName} sắp xong.`);
//                 resolve(`${taskName} đã hoàn thành!`)
//             } else {
//                 reject(`Lỗi xảy ra khi đang làm.`);
//             }
//         }, 2000)
//     })
// }
// doTask("Rửa chén").then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

const doTask = (taskName) => {
    return new Promise((resolve) => {
        console.log(`Đang thực hiện ${taskName}`); //2
        setTimeout(() => {
            console.log(`${taskName} sắp xong.`);  //sau 2 giây, thứ 3
            resolve(`${taskName} đã hoàn thành!`); //4
        }, 2000)
    });
};
const main = async () => {
    console.log(`Bắt đầu công việc`);  //in ra đầu tiên
    const result1 = await doTask("Quét nhà") //Chờ doTask("Quét nhà") hoàn tất
    console.log(result1);    //In kết quả "Quét nhà" sau khi resolve
    const result2 = await doTask("Giặt đồ")
    console.log(result2);
    console.log(`Tất cả công việc đã hoàn thành!`);
};
main();