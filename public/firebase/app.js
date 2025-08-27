    // Import biến 'db' từ file config
import { db } from './firebase-config.js';

// Import các hàm bạn cần để thao tác với Firestore
import { collection, addDoc, getDocs } from "firebase/firestore";

// --- Ví dụ: Thêm và đọc dữ liệu người dùng ---

// Hàm để thêm một người dùng mới vào collection "students"
async function addStudent() {
    const studentName = prompt("Nhập tên sinh viên:");
    if (!studentName) return;

    try {
        const docRef = await addDoc(collection(db, "students"), {
            name: studentName,
            status: "present",
            timestamp: new Date()
        });
        console.log("Đã thêm sinh viên với ID: ", docRef.id);
        alert("Thêm thành công!");
        // Sau khi thêm xong, gọi hàm đọc lại dữ liệu để cập nhật danh sách
        await getStudents();
    } catch (e) {
        console.error("Lỗi: ", e);
    }
}

// Hàm để đọc tất cả sinh viên từ collection "students" và hiển thị ra
async function getStudents() {
    const studentListDiv = document.getElementById('studentList');
    studentListDiv.innerHTML = "Đang tải..."; // Thông báo đang tải

    const querySnapshot = await getDocs(collection(db, "students"));
    studentListDiv.innerHTML = ""; // Xóa thông báo
    querySnapshot.forEach((doc) => {
        const student = doc.data();
        const p = document.createElement('p');
        p.textContent = `Tên: ${student.name} - Trạng thái: ${student.status}`;
        studentListDiv.appendChild(p);
    });
}

// Gắn hàm vào nút bấm trong file HTML
document.getElementById('addStudentBtn').addEventListener('click', addStudent);

// Tự động chạy hàm getStudents() khi trang tải lần đầu
getStudents();