# Viết lại Master động từ — chưa phát hành

Mục tiêu giữ nguyên: 288 gói × 5 câu = 1.440 câu nâng cao viết riêng từng câu. 72 câu chuyên sâu ban đầu được bảo toàn ngoài chỉ tiêu 1.440 câu mới.

## Nguồn dữ liệu

- `manual-drafts.cjs`: bảo toàn 54 gói/270 câu nháp từ những lượt trước. Có lỗi phương án gần nghĩa cùng đúng, đáp án không khớp lời giải và câu không tập trung vào động từ. Chưa được xem là đủ chuẩn phát hành.
- `reviewed-verb-sets.cjs`: câu được viết riêng với câu Việt ngắn cần diễn đạt, khung Anh riêng, bốn phương án và bốn lý do đối chiếu nguồn. Trạng thái rà là của chính người biên soạn, không phải người rà độc lập.
- `build-manual-preview.cjs`: chỉ đóng gói nội dung đã viết sang JSON và Markdown. Không cắt động từ ra từ bản dịch mẫu, không chia họ từ để tạo phương án, không bù số lượng bằng câu dự phòng.
- Ngữ cảnh lấy trực tiếp từ `context-bank.js`. Bản Anh cũ không phải đáp án bắt buộc. Giữ nguồn, phủ định, tác nhân, mức độ, thời điểm và điều kiện.

## Quy tắc cho từng câu

1. Đoạn Việt chung chỉ xuất hiện một lần trên mỗi gói.
2. Mỗi thẻ câu nhắc một câu Việt ngắn, trọn nghĩa; không chép lại cả đoạn.
3. Năm câu có năm khung Anh và năm trọng tâm khác nhau. Không thêm câu dẫn để ngụy trang một khung bị lặp.
4. Mỗi lựa chọn phải ghép được vào khung câu. Nếu không thể loại một phương án bằng nghĩa/lực của nguồn, phải sửa câu hoặc chấp nhận thêm đáp án; không loại chỉ vì khác đáp án mẫu.
5. Không dùng “trang trọng hơn”, “dài hơn”, “gần nghĩa nhưng không phải chữ nguồn” làm lý do duy nhất để chấm sai.
6. Động từ mạnh phải được ý nguồn cho phép. Không đổi “nhận xét” thành “vạch trần”, “có thể” thành “bảo đảm”, hoặc “sửa lỗi” thành “trừng phạt”.
7. Đặt cả năm câu dưới ngữ cảnh; nộp đủ mới mở phản hồi của gói. Vẫn chọn gói tự do và giữ tiến độ riêng.

## Lệnh kiểm tra và xem bản thảo

```sh
node --test tests/manual-authoring.test.cjs tests/manual-reviewed.test.cjs
node authoring/build-manual-preview.cjs
```

Kết quả mặc định ở `../outputs/context-bank-v1/manual-rewrite-preview/`:

- `MANUAL-REVIEWED-PREVIEW.md` — nguồn một lần, năm câu rồi đáp án đóng/mở;
- `manual-reviewed-preview.json` — packet nội dung;
- `manual-rewrite-progress.json` — đếm riêng câu nháp, câu đã tự rà, câu chưa viết và câu còn cần rà.

Kiểm thử chứng minh các thuộc tính cấu trúc, không chứng minh một câu hỏi khó hay chỉ có một đáp án tự nhiên. Vòng đọc từng khung với cả bốn lựa chọn vẫn bắt buộc.

## Điều kiện phát hành

Chưa thay các file public khi còn thiếu câu hoặc còn câu nháp chưa sửa. Khi đủ 1.440 câu đã rà nội dung, mới tích hợp vào giao diện và kiểm tra hiển thị thật: một ngữ cảnh, năm thẻ, submit/retry, chọn gói, migration tiến độ. Nội dung thay đổi không được hưởng PASS từ câu cũ khác nghĩa. Còn phải chạy kiểm thử toàn repo và xác minh bản public sau khi phát hành.
