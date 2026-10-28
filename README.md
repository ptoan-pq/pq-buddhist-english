# PQ English — Vận dụng cùng Phật học

Trang học tĩnh bằng HTML, CSS và JavaScript, chạy trực tiếp trên GitHub Pages. Không cần đăng nhập, khóa API hoặc bước build.

## Bài 1

- 72 câu trong 12 bộ, mỗi bộ 6 câu cùng thể loại.
- 6 câu làm quen, 6 câu luyện ngắn, 60 câu vận dụng và chuyển giao.
- Chọn câu, điền cụm, nối ý, ghép câu, sửa bản dịch và sắp xếp đoạn.
- Bố cục một cột từ trên xuống dưới; nộp cả bộ mới mở đáp án.
- RETRY chỉ yêu cầu câu sai; PASS mới mở bộ tiếp theo.
- Lặp mẫu diễn đạt qua nhiều nội dung: tiết kiệm, trắc ẩn, khiêm tốn, hợp tác, biết ơn, trách nhiệm, kiên định, can đảm, công việc, lời nói và giáo dục.

## Tiến độ và sổ tay

Tiến độ lưu trong `localStorage` của trình duyệt, không đẩy lên GitHub. Trong **Tiến độ**, dùng **Tải sao lưu JSON** và **Khôi phục từ JSON** để chuyển máy hoặc sao lưu vào project. Xóa dữ liệu trình duyệt có thể làm mất tiến độ chưa sao lưu. Không có đồng bộ nhiều thiết bị tự động.

**Sổ tay** hiển thị những câu đã PASS và xuất file Markdown. Sau khi hoàn tất cả bài, bản ghi chú có trạng thái hoàn thành, mẫu ngôn ngữ và các lỗi cần ôn lại.

## Nguồn nội dung

`course.js` chứa các bài tập biên soạn theo thư viện Việt ngữ của dự án học tập. Mỗi câu có tên nguồn và locator trong phần phản hồi. Repository không chứa sách gốc, hồ sơ học viên, lịch sử chat, dữ liệu học cũ hay thông tin đăng nhập. Không áp dụng giấy phép mở cho các nguyên tác được dẫn tên.

Đáp án Anh là phương án theo ngữ cảnh; không phải bản dịch bắt buộc của nguyên tác. Bài tập có lựa chọn kiểm tra vận dụng có hỗ trợ, không thay thế đánh giá tự viết hay phát âm. Trang không tạo bài bằng AI trực tiếp.

## Chạy trên máy

Mở `index.html`, hoặc chạy:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Mở `http://127.0.0.1:8765`. Dữ liệu trình duyệt được lưu riêng theo địa chỉ; hãy xuất/nhập sao lưu khi đổi từ bản local sang bản GitHub Pages.

## Kiểm tra

```sh
node --test tests/engine.test.cjs
node --check app.js
```

## Cập nhật nội dung

Sửa hoặc bổ sung bộ trong `course.js`; mỗi bộ phải có 5–7 câu, bản phát hành này dùng 6. Giữ ID đã phát hành để tránh làm lệch tiến độ. Thay đổi đáp án hoặc cấu trúc bài đang phát hành cần đổi phiên bản khóa học và xử lý dữ liệu cũ có chủ đích.

GitHub Pages dùng nhánh `main`, thư mục `/`. Push thay đổi vào nhánh này để xuất bản lại.
