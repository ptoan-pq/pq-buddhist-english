# PQ English — Vận dụng cùng Phật học

Trang học tĩnh bằng HTML, CSS và JavaScript, chạy trực tiếp trên GitHub Pages. Không cần đăng nhập, khóa API hoặc bước build.

## Chương trình v2

Giữ nguyên thứ tự và cụm ngôn ngữ của 24 tuần/chủ điểm trong `references/curriculum.md` thuộc Buddhist English Expression Coach v4. Đối chiếu tại [CURRICULUM.md](CURRICULUM.md).

- 24 chủ điểm thực sự có nội dung; 36 câu/chủ điểm, tổng 864 câu.
- Chọn tự do bất kỳ chủ điểm nào, đổi chủ điểm rồi quay lại đúng tiến độ riêng. Trong mỗi chủ điểm, các bộ vẫn phải PASS mới chuyển tiếp.
- Mỗi chủ điểm gồm 6 bộ × 6 câu cùng thể loại, theo một cột.
- 6 câu làm quen và 30 câu vận dụng/chủ điểm; 720/864 câu thuộc phần vận dụng.
- Bài 1 tập trung đúng `mean`, `refer to`, `consist of`, `be regarded as`.
- Các kỹ năng chọn trục câu, giữ phạm vi nghĩa, phân biệt quan hệ và dựng đoạn được luyện trong các chủ điểm, không thay thế chương trình gốc bằng một danh sách ngữ pháp mới.
- `lesson-facts.js` lưu 12 ý diễn đạt/chủ điểm; `lessons.js` chuyển các ý ấy sang các bài chọn, điền, ghép, nối và dựng đoạn. Một ý được vận dụng lại qua nhiều thao tác; 864 là số câu/bài tập, không phải 864 ý giáo lý độc lập.
- 110 định vị nguồn đã đối chiếu tồn tại trong thư viện gốc. Không dùng nguồn S11 vì chưa đọc trực quan các trang PDF tương ứng.

Curriculum gốc là 24 tuần với nhịp học 5 ngày/tuần. Trang web này chuyển 24 chủ điểm thành các module học bằng click; không tuyên bố đã thay thế trọn 120 buổi luyện nói/viết tự do.

## Bản tổng hợp v1 được bảo toàn

- 72 câu trong 12 bộ, mỗi bộ 6 câu cùng thể loại.
- 6 câu làm quen, 6 câu luyện ngắn, 60 câu vận dụng và chuyển giao.
- Chọn câu, điền cụm, nối ý, ghép câu, sửa bản dịch và sắp xếp đoạn.
- Bố cục một cột từ trên xuống dưới; nộp cả bộ mới mở đáp án.
- RETRY chỉ yêu cầu câu sai; PASS mới mở bộ tiếp theo.
- Lặp mẫu diễn đạt qua nhiều nội dung: tiết kiệm, trắc ẩn, khiêm tốn, hợp tác, biết ơn, trách nhiệm, kiên định, can đảm, công việc, lời nói và giáo dục.

## Tiến độ và sổ tay

Tiến độ lưu trong `localStorage` của trình duyệt, không đẩy lên GitHub. Trong **Tiến độ**, dùng **Tải sao lưu JSON** và **Khôi phục từ JSON** để chuyển máy hoặc sao lưu vào project. Xóa dữ liệu trình duyệt có thể làm mất tiến độ chưa sao lưu. Không có đồng bộ nhiều thiết bị tự động.

Mỗi chủ điểm có khóa lưu riêng. Khóa `pq-english-progress-v1` được giữ nguyên cho bản tổng hợp cũ; kết quả v1 không tự chuyển thành kết quả của chủ điểm 1 mới. Trong cuối danh mục, chọn **Mở bản cũ và tiến độ** để tiếp tục hoặc xem lại v1.

**Tải sao lưu JSON** trong v2 xuất toàn bộ project học, bao gồm các chủ điểm và bản v1. Bộ nhập vẫn chấp nhận các file sao lưu đơn cũ. **Sổ tay** và Markdown được tạo riêng cho chủ điểm đang chọn.

## Nguồn nội dung

`course.js` là nội dung v1; `curriculum.js`, `lesson-facts.js`, `lesson-language.js` và `lessons.js` chứa chương trình v2. Mỗi câu có tên nguồn và locator trong phần phản hồi. Repository không chứa sách gốc, hồ sơ học viên, lịch sử chat, dữ liệu học cá nhân hay thông tin đăng nhập. Không áp dụng giấy phép mở cho các nguyên tác được dẫn tên.

Đáp án Anh là phương án theo ngữ cảnh; không phải bản dịch bắt buộc của nguyên tác. Bài tập có lựa chọn kiểm tra vận dụng có hỗ trợ, không thay thế đánh giá tự viết hay phát âm. Trang không tạo bài bằng AI trực tiếp.

## Chạy trên máy

Mở `index.html`, hoặc chạy:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Mở `http://127.0.0.1:8765`. Dữ liệu trình duyệt được lưu riêng theo địa chỉ; hãy xuất/nhập sao lưu khi đổi từ bản local sang bản GitHub Pages.

## Kiểm tra

```sh
node --test tests/*.test.cjs
node --check app.js
```

## Cập nhật nội dung

Chương trình gốc nằm trong `curriculum.js`; ý nguồn trong `lesson-facts.js`; phương án đối chiếu trong `lesson-language.js`; cấu trúc bộ bài trong `lessons.js`. Giữ ID đã phát hành để tránh làm lệch tiến độ. Thay đổi đáp án hay cấu trúc bài đang phát hành cần đổi phiên bản tương ứng và xử lý dữ liệu cũ có chủ đích. Không thay đổi `course.js` để sửa chương trình v2, vì đây là nội dung để khôi phục v1.

GitHub Pages dùng nhánh `main`, thư mục `/`. Push thay đổi vào nhánh này để xuất bản lại.
