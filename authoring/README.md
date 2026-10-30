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
3. Năm câu có năm khung Anh và năm trọng tâm khác nhau. Không thêm câu dẫn để ngụy trang một khung bị lặp.
4. Chuẩn độ khó mới: cả bốn lựa chọn phải đúng ngữ pháp, tự nhiên và chấp nhận được trong chính ngữ cảnh. Không dùng hành động đối lập, đảo tác nhân hay khẳng định vô lý để tạo đáp án dễ loại. Người học chọn cách sát nhất về nghĩa, lực, trọng tâm và giọng; đây không phải câu phân loại ba cách sai và một cách đúng.
5. Không dùng “trang trọng hơn”, “dài hơn”, “gần nghĩa nhưng không phải chữ nguồn” làm lý do duy nhất để chấm sai.
6. Động từ mạnh phải được ý nguồn cho phép. Không đổi “nhận xét” thành “vạch trần”, “có thể” thành “bảo đảm”, hoặc “sửa lỗi” thành “trừng phạt”.
7. Đặt cả năm câu dưới ngữ cảnh; nộp đủ mới mở phản hồi của gói. Vẫn chọn gói tự do và giữ tiến độ riêng.
8. Mỗi câu dạng mới có `selectionCriterion`, `validAnswers: [0,1,2,3]` và `preferredAnswers`. Viết lý do so sánh cho từng phương án. Nếu các cách sát ngang nhau, cùng đưa vào `preferredAnswers`; không ép một đáp án vì thích một từ. Cách trung tính vẫn có thể ưu tiên hơn một động từ hình ảnh nếu sát nguồn hơn.
9. Trong phản hồi, gọi các lựa chọn không ưu tiên là “dùng được, nhưng khác điểm nhấn”, không gọi là sai tiếng Anh. Khi tích hợp website phải phân biệt độ sát của lựa chọn với đúng/sai ngôn ngữ; không dùng nhãn báo sai cũ mà thiếu giải thích.

Các gói chưa có `assessmentMode: 'best-fit-among-valid-alternatives'` **chưa được xem là đạt chuẩn độ khó mới**, dù đã qua kiểm tra trích nguyên văn hoặc tự rà Việt–Anh. Không tự động gắn nhãn này cho câu cũ.

## Lệnh kiểm tra và xem bản thảo

```sh
node --test tests/manual-authoring.test.cjs tests/manual-reviewed.test.cjs
node authoring/build-manual-preview.cjs
```

Kết quả mặc định ở `../outputs/context-bank-v1/manual-rewrite-preview/`:

- `MANUAL-REVIEWED-PREVIEW.md` — nguồn một lần, năm câu rồi đáp án đóng/mở;
- `SOURCE-ALIGNED-PREVIEW.md` — chỉ các gói đã tự rà cặp trích dẫn–khung Anh;
- `BEST-FIT-PREVIEW.md` — chỉ các gói đã viết lại theo chuẩn cả bốn cách đều dùng được;
- `manual-reviewed-preview.json` — packet nội dung;
- `manual-rewrite-progress.json` — đếm riêng câu nháp, câu đã tự rà, câu chưa viết và câu còn cần rà.

Kiểm thử chứng minh các thuộc tính cấu trúc, không chứng minh một câu hỏi khó hay chỉ có một đáp án tự nhiên. Vòng đọc từng khung với cả bốn lựa chọn vẫn bắt buộc.

## Điều kiện phát hành

Chưa thay các file public khi còn thiếu câu hoặc còn câu nháp chưa sửa. Khi đủ 1.440 câu đã rà nội dung, mới tích hợp vào giao diện và kiểm tra hiển thị thật: một ngữ cảnh, năm thẻ, submit/retry, chọn gói, migration tiến độ. Nội dung thay đổi không được hưởng PASS từ câu cũ khác nghĩa. Còn phải chạy kiểm thử toàn repo và xác minh bản public sau khi phát hành.
