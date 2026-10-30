# Viết lại Master động từ — chưa phát hành

Mục tiêu giữ nguyên: 288 gói × 5 câu = 1.440 câu nâng cao viết riêng từng câu. 72 câu chuyên sâu ban đầu được bảo toàn ngoài chỉ tiêu 1.440 câu mới.

## Nguồn dữ liệu

- `manual-drafts.cjs`: bảo toàn 54 gói/270 câu nháp từ những lượt trước. Có lỗi phương án gần nghĩa cùng đúng, đáp án không khớp lời giải và câu không tập trung vào động từ. Chưa được xem là đủ chuẩn phát hành.
- `reviewed-verb-sets.cjs`: câu được viết riêng với câu Việt ngắn cần diễn đạt, khung Anh riêng, bốn phương án và bốn lý do đối chiếu nguồn. Trạng thái rà là của chính người biên soạn, không phải người rà độc lập.
- `build-manual-preview.cjs`: chỉ đóng gói nội dung đã viết sang JSON và Markdown. Không cắt động từ ra từ bản dịch mẫu, không chia họ từ để tạo phương án, không bù số lượng bằng câu dự phòng.
- Ngữ cảnh lấy trực tiếp từ `context-bank.js`. Bản Anh cũ không phải đáp án bắt buộc. Giữ nguồn, phủ định, tác nhân, mức độ, thời điểm và điều kiện.

## Quy tắc cho từng câu

1. Đoạn Việt chung chỉ xuất hiện một lần trên mỗi gói.
2. Mỗi thẻ trích nguyên văn câu hoặc mệnh đề từ nguồn Việt phía trên. Không viết lại bằng lời mình, không chèn tiêu chí dịch hoặc chú giải vào câu trích; không chép lại cả đoạn.
3. Mỗi thẻ gồm câu Việt nguyên văn, một câu Anh có chỗ trống ở vị ngữ và bốn động từ/cụm động từ. Người học chỉ chọn động từ, không chọn giữa bốn bản dịch toàn câu. Năm câu trong gói có năm đơn vị ý và khung Anh khác nhau.
4. Chỉ một lựa chọn diễn đạt đúng nhất câu Việt trong chính ngữ cảnh. Ba phương án nhiễu phải có sức cạnh tranh nhưng lệch hành động, đối tượng, cách kết hợp, mức độ, chủ ý hoặc kết quả. Ưu tiên những thao tác gần nhau như nghiên cứu kỹ, đọc lướt, xem qua; tránh những hành động vô lý chỉ để dễ loại.
5. Nếu hai lựa chọn đều dịch sát ngang nhau, viết lại phương án nhiễu hoặc khung bài để còn một đáp án xác định. Không ép chấm sai một từ đúng chỉ vì nó kém trang trọng hoặc không phải từ người soạn thích.
6. Động từ mạnh phải được ý nguồn cho phép. Không đổi “nhận xét” thành “vạch trần”, “có thể” thành “bảo đảm”, hoặc “sửa lỗi” thành “trừng phạt”.
7. Đặt cả năm câu dưới ngữ cảnh; nộp đủ mới mở phản hồi của gói. Vẫn chọn gói tự do và giữ tiến độ riêng.
8. Mỗi câu có một `answer` và bốn lý do gắn đúng với bốn động từ/cụm động từ. Lời giải chỉ ra vì sao ba lựa chọn kia không dịch đúng câu đang giao; phân biệt sai nghĩa trong bài với sai tiếng Anh nói chung.
9. Nộp đủ năm câu mới hiện bản dịch hoàn chỉnh và phân tích. Trước lúc nộp, chỉ hiện nguyên văn Việt, khung Anh và bốn lựa chọn; giữ chú giải ngoài câu trích.
10. Dùng `taskKind: 'verb-gap'`, `assessmentMode: 'single-best-verb'`. Khung Anh có đúng một chỗ trống và phải là một câu có nội dung, không phải toàn bộ `___`. Nội dung và phương án được soạn thủ công, không tự cắt từ ra để sinh câu hàng loạt.
11. Kiểm tra hai chiều: câu Anh sau khi điền phải dịch đủ đúng câu Việt; mỗi phương án nhiễu phải có lý do loại dựa vào nguồn hoặc cách dùng, không phải gu văn phong.

Bản chọn toàn câu và nhiều lựa chọn cùng đúng là hướng đã hiểu sai, được giữ ở nhánh Git `archive/whole-expression-13aa48f` để đối chiếu, không phải chương trình hiện hành. Trạng thái dạng bài không tự chứng minh bộ phương án đủ khó; phần còn nháp vẫn phải được tự rà riêng.

## Lệnh kiểm tra và xem bản thảo

```sh
node --test tests/manual-authoring.test.cjs tests/manual-reviewed.test.cjs
node authoring/build-manual-preview.cjs
```

Kết quả mặc định ở `../outputs/context-bank-v1/manual-rewrite-preview/`:

- `MANUAL-REVIEWED-PREVIEW.md` — nguồn một lần, năm câu rồi đáp án đóng/mở;
- `SOURCE-ALIGNED-PREVIEW.md` — chỉ các gói đã tự rà cặp trích dẫn–khung Anh;
- `VERB-CHOICE-REVIEWED-PREVIEW.md` — các gói đã tự rà lại phương án nhiễu theo dạng chỉ chọn động từ, một đáp án đúng nhất;
- `manual-reviewed-preview.json` — packet nội dung;
- `manual-rewrite-progress.json` — đếm riêng câu nháp, câu đã tự rà, câu chưa viết và câu còn cần rà.

Kiểm thử chứng minh các thuộc tính cấu trúc, không chứng minh một câu hỏi khó hay chỉ có một đáp án tự nhiên. Vòng đọc từng khung với cả bốn lựa chọn vẫn bắt buộc.

## Điều kiện phát hành

Chưa thay các file public khi còn thiếu câu hoặc còn câu nháp chưa sửa. Khi đủ 1.440 câu đã rà nội dung, mới tích hợp vào giao diện và kiểm tra hiển thị thật: một ngữ cảnh, năm thẻ, submit/retry, chọn gói, migration tiến độ. Nội dung thay đổi không được hưởng PASS từ câu cũ khác nghĩa. Còn phải chạy kiểm thử toàn repo và xác minh bản public sau khi phát hành.
