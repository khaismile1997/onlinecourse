// Variables
const courses = document.querySelector('#courses-list'),
        shoppingCartContent = document.querySelector('#cart-content tbody'),
        clearCartBtn = document.querySelector('#clear-cart');
// Listener
loadEventListeners();
function loadEventListeners(){
    // Khi thêm vào khóa học mới
    courses.addEventListener('click', buyCourse);
    // Xóa khóa học
    shoppingCartContent.addEventListener('click', removeCourse);
    // Xóa all khóa học
    clearCartBtn.addEventListener('click', clearCart);
    // Load dữ liệu từ local storage
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);
}
//Functions
function buyCourse(e){
    //console.log("Course added");
    //console.log(e.target);
    e.preventDefault(); // ngăn chặn cách xử lý mặc định của browser khi xảy ra sự kiện
    // dùng delegation để tìm khóa học được thêm vào
    if(e.target.classList.contains('add-to-cart')){
        // đọc values của khóa học
        const course = e.target.parentElement.parentElement;
        
        getCourseInfo(course);
    }
}   
// Đọc HTML của khóa học được chọn
function getCourseInfo(course){
    //console.log(course);
    // Tạo object
    const courseInfo = {
        image: course.querySelector('img').src,
        title: course.querySelector('h4').textContent,
        price: course.querySelector('.price span').textContent,
        id: course.querySelector('a').getAttribute('data-id')
    }
    addIntoCart(courseInfo);
}
function addIntoCart(course){
    // tạo thẻ <tr>
    const row = document.createElement('tr');
    // tạo template
    row.innerHTML = `<tr>
    <td>
        <img src="${course.image}" width=100>
    </td>
    <td>${course.title}</td>
    <td>${course.price}</td>
    <td>
        <a href="#" class="remove" data-id="${course.id}">X</a>
    </td>    
    </tr>`;

    // Thêm vào giỏ hàng
    shoppingCartContent.appendChild(row);
    // Lưu vào local storage sau khi thêm
    saveIntoStorage(course);
}
// Hàm lưu vào local storage
function saveIntoStorage(course){
    let courses = getCourseFromStorage();
    // thêm course vào mảng
    courses.push(course);
    // trên storage chỉ lữu kiểu string => convert sang string
    localStorage.setItem('courses', JSON.stringify(courses));
}
// Hàm lấy giá trị từ local storage
function getCourseFromStorage(){
    let courses;
    const coursesLS = localStorage.getItem('courses');
    // nếu dữ liệu trên storage null thì tạo mảng rỗng, ngược lại thì parse dữ liệu ra
    if(coursesLS === null){
        courses = [];
    }else{
        courses = JSON.parse(coursesLS);
    }
    //console.log(courses); //mảng có nhiều object
    return courses;
}
// Xóa khóa học
function removeCourse(e){
    if (e.target.classList.contains('remove')){
        //console.log(e.target.parentElement.parentElement);
        e.target.parentElement.parentElement.remove();
        course = e.target.parentElement.parentElement;
        courseId = course.querySelector('a').getAttribute('data-id');
    }
    //console.log(course);
    //console.log(courseId);
    removeCourseLS(courseId);
}
// Hàm xóa course trên local storage
function removeCourseLS(id){
    let coursesLS = getCourseFromStorage(); // lấy dữ liệu từ local storage

    coursesLS.forEach(function(kh, index){ // vòng lặp trong mảng coursesLS với kh là mỗi object trong mảng
        if(kh.id === id){
            coursesLS.splice(index, 1); // xóa 1 phần tử bắt đầu từ vị trí index
        }
    });
    // cập nhật lại dữ liệu trên local storage
    localStorage.setItem('courses', JSON.stringify(coursesLS));
}
// Xóa all course
function clearCart(e){
    //console.log(shoppingCartContent.firstChild);
    while(shoppingCartContent.firstChild){ // nếu còn tồn tại <tr>(firstChild của shoppingCartContent) trong tbody => xóa
        shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }
    // xóa toàn bộ dữ liệu trên storage
    clearLocalStorage();
}
function clearLocalStorage(){
    localStorage.clear();
}
// Load dữ liệu từ local storage và show ra shopping cart
function getFromLocalStorage(){
    let coursesLS = getCourseFromStorage();

    coursesLS.forEach(function(kh){
        const row = document.createElement('tr');
    // tạo template
    row.innerHTML = `<tr>
    <td>
        <img src="${kh.image}" width=100>
    </td>
    <td>${kh.title}</td>
    <td>${kh.price}</td>
    <td>
        <a href="#" class="remove" data-id="${kh.id}">X</a>
    </td>    
    </tr>`;
    //Thêm vào giỏ hàng
    shoppingCartContent.appendChild(row); 
    });
}