# Nhật ký rà bản biên soạn thủ công

## 2026-10-29 — tách câu đã tự rà khỏi nháp mới chỉ kiểm cấu trúc

### Phạm vi làm thật trong đợt này

- Viết riêng M055–M072: 18 gói × 5 câu = 90 câu, từ W08-B07–B12 và W09-B01–B12.
- Mỗi câu có một câu Việt ngắn cần diễn đạt; ngữ cảnh chung in một lần trên gói.
- Viết bốn lý do gắn với bốn lựa chọn, không dùng một đoạn giải thích chung từ bộ sinh.
- Đọc lại 90 khung, đối chiếu câu Việt và ghép lần lượt cả bốn lựa chọn. Đã sửa các bổ ngữ dùng chung không phù hợp cho mọi lựa chọn: M056-Q2, M059-Q1/Q5, M062-Q1/Q2/Q3/Q4, M068-Q3, M069-Q5, M070-Q3, M071-Q5, M072-Q3.
- Chưa có người rà ngôn ngữ độc lập, chưa hiệu chuẩn độ khó bằng câu trả lời của người học. Trạng thái `source-and-alternatives-reviewed-by-author` chỉ ghi đúng việc tự rà.

### Những lỗi được xác nhận ở 270 câu nháp cũ

Đây là lấy mẫu để xác định bước sửa tiếp, **không phải** kiểm toán xong cả 270 câu:

| Vị trí | Bằng chứng | Tác động | Cần sửa |
|---|---|---|---|
| M040, câu 3 | Đáp án quy ước đầu tiên là `cleaned`, nhưng lời giải chọn `be clean`. | Đáp án và giải thích không khớp; người học có thể bị chấm sai. | Viết lại cả khung lẫn các phương án; không chỉ đổi chỉ số. |
| M030, câu 5 | Phương án `bringing ... to a stop` được đưa vào một khung đã có `to a stop`. | Lựa chọn không cùng khung cú pháp, tạo đáp án dễ loại hoặc câu lặp. | Viết nhiệm vụ mới theo một đơn vị ý khác trong đoạn. |
| M027, câu 3 | `understood / grasped / apprehended / comprehended` đều có thể diễn đạt việc hiểu vấn đề trừu tượng. | Không có căn cứ đủ mạnh để chấm ba từ sai chỉ vì khác văn phong. | Thay ba phương án bằng các thao tác nhận thức khác thực chất. |
| M053, câu 1 | `reflect on / contemplate / reason through / meditate on` có những cách dùng chồng lấn trong câu đang giao. | Lời giải dựa quá nhiều vào từ được ưa chuộng, chưa chứng minh một đáp án tốt nhất. | Viết lại mục tiêu Việt rõ chức năng; không loại cách dịch hợp nghĩa vì khác chữ mẫu. |

Vì vậy giữ 54 gói/270 câu ấy ở `manual-drafts.cjs`, chờ rà và viết lại. Không cộng vào số câu đủ điều kiện phát hành. Trước đây các báo cáo “kiểm thử đạt” chỉ chứng minh cue tồn tại và khung khác chuỗi, không chứng minh độ đúng của bộ câu.

### Hồ sơ lưu bền

- Toàn bộ nháp cũ đã sao vào repository, thay vì chỉ commit bộ đếm trong test.
- Câu mới và quy trình đóng gói ở `reviewed-verb-sets.cjs`, `build-manual-preview.cjs`.
- Test mới kiểm ngữ cảnh chỉ in một lần, câu Việt nhắc ngắn, không sao khung/bộ lựa chọn của phần cơ bản, liên kết lời giải với lựa chọn, và submit/retry đủ năm câu.
- Build chỉ xuất JSON/Markdown bản xem trước. Các file chạy website không được thay đổi hoặc push ở đợt này.

### Còn lại

Mục tiêu vẫn là 1.440 câu mới, không phải 90 câu. Còn 1.350 câu chưa qua tự rà nội dung: gồm 270 câu nháp cần sửa và 1.080 câu chưa viết. Sau đó mới đến tích hợp giao diện, xác minh bằng trình duyệt, chuyển tiến độ và xuất bản.
