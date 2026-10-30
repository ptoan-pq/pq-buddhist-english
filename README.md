# PQ English — Vận dụng cùng Phật học

Trang học tĩnh bằng HTML, CSS và JavaScript, chạy trực tiếp trên GitHub Pages. Không cần đăng nhập, khóa API hoặc bước build.

## Hai khóa học độc lập — bản biên soạn thủ công 1.440 câu

- **Diễn đạt Phật học:** giữ nguyên 1.440 câu gốc, 24 chủ điểm × 12 gói × 5 câu. Không trộn phần động từ bổ sung vào các gói này nữa.
- **Master động từ:** chương trình riêng, **300 gói = 1.512 câu**. Giữ nguyên 72 câu chuyên sâu V01–V12; **1.440 câu M001–M288** được biên soạn riêng theo nguồn Việt, thay toàn bộ tập N cũ. Mỗi câu có khung Anh riêng, bốn lựa chọn và phân tích từng lựa chọn; không lấy câu cơ bản để bù số lượng.
- Mỗi câu nâng cao có nguyên câu Việt để nhớ ngữ cảnh, một câu Anh khuyết vị ngữ và bốn lựa chọn cùng lĩnh vực/ngữ cảnh nhưng khác một nét nghĩa. Lời giải nêu câu hoàn chỉnh và vì sao từng lựa chọn làm đổi ý nguồn. Không tự động coi một từ đồng nghĩa đúng là sai.
- **Bộ ôn động từ cơ bản:** 1.440 câu động từ của bản trước được giữ nguyên, truy cập từ bên trong khóa Master động từ. Đây là kho ôn cũ, không phải 1.440 câu nâng cao mới.
- Đổi khóa bằng **Chọn khóa học**; chọn chủ điểm hoặc gói tùy ý. Tất cả gói của hai chương trình chính đều mở tự do. Nộp đủ 5 hoặc 6 câu mới mở phản hồi; chỉ làm lại câu sai.
- Tiến độ và sổ tay tách riêng; thay đổi ở khóa này không sửa đáp án khóa kia. Khóa gốc dùng `pq-english-context-Wxx-base-v1`, khóa nâng cao dùng `pq-english-verb-mastery-v4`, kho ôn dùng `pq-english-verb-review-v1`. Chỉ chuyển kết quả của 72 câu V không đổi; câu M mới không hưởng PASS từ tập N trước đây. Các khóa lưu cũ vẫn được giữ nguyên.
- Chuyển dữ liệu từ bộ gộp v4: giữ câu trả lời/lịch sử hợp lệ của câu gốc và bộ động từ cũ vào đúng kho. Không trao PASS nâng cao từ câu dễ. Khóa lưu cũ không bị ghi đè; JSON cũ vẫn nhập được.
- `context-bank.js` và `context-verbs.js` không bị sửa/xóa. `context-lessons.js` chỉ tạo chủ điểm gốc; `advanced-verbs.js` và `verb-lessons.js` tạo khóa động từ và kho ôn. `project.js` tách tiến độ theo mã câu.

Phần nâng cao được biên soạn, không được sinh bằng cách thay hàng loạt từ đồng nghĩa vào câu cũ. Độ khó chưa được hiệu chuẩn bằng dữ liệu người học và chưa có rà soát độc lập của người bản xứ. Chọn đáp án đúng không thay thế năng lực tự viết/nói. Kiểm thử chương trình không chứng nhận chất lượng ngôn ngữ.

Ngữ cảnh in một lần mỗi gói. Mỗi thẻ chỉ có câu Việt trích nguyên văn, khung Anh và các lựa chọn; hướng dẫn chọn động từ không lặp trên từng thẻ. Xem quy trình biên soạn trong `authoring/README.md`; chạy `node authoring/build-release.cjs` để đóng gói lại từ nội dung đã viết, không tạo câu hỏi mới.

## Chương trình v2 — hồ sơ các file cũ được giữ lại

Giữ nguyên thứ tự và cụm ngôn ngữ của 24 tuần/chủ điểm trong `references/curriculum.md` thuộc Buddhist English Expression Coach v4. Đối chiếu tại [CURRICULUM.md](CURRICULUM.md).

- 24 chủ điểm thực sự có nội dung; 36 câu/chủ điểm, tổng 864 câu.
- Chọn tự do bất kỳ chủ điểm nào, đổi chủ điểm rồi quay lại đúng tiến độ riêng. Trong mỗi chủ điểm, các bộ vẫn phải PASS mới chuyển tiếp.
- Ô **Chọn chủ điểm** luôn hiện phía trên màn hình; chọn trực tiếp từ danh sách, không cần quay về menu Chương trình.
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

`context-bank.js` chứa các đoạn trích và 5 câu gốc theo đoạn; `context-verbs.js` chứa câu bổ sung. `course.js` là nội dung v1; `curriculum.js`, `lesson-facts.js`, `lesson-language.js` và `lessons.js` giữ chương trình v2. Mỗi câu có tên nguồn và locator trong phản hồi. Repository không chứa toàn bộ sách gốc, hồ sơ học viên, lịch sử chat, dữ liệu học cá nhân hay thông tin đăng nhập. Không áp dụng giấy phép mở cho các nguyên tác được dẫn tên.

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
