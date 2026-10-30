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

## 2026-10-29 — viết tiếp M073–M132

### Nội dung đã bổ sung

- Viết riêng 60 gói, 300 câu. Cộng với đợt trước: **78 gói, 390 câu đã được chính người biên soạn đối chiếu nguồn và phương án**.
- Nguồn mới được bao phủ: W01-B05–B12, W02-B07–B12, W03-B01–B04, W04-B01–B06, W06-B01–B06, W07-B07–B12, W10-B01–B12 và W11-B01–B12.
- Các nhóm ý gồm: thiền và đời sống; khiêm hạ; công bằng; nghiệp và ý nghiệp; phước, giới và Diệt Đế; tự xét lỗi; lý tưởng và tham vọng; trách nhiệm với trẻ em; lời chê, lời khen, góp ý và nói thật; thông cảm và phụng sự kín đáo.
- Mỗi câu tiếp tục có câu Việt ngắn, trọn ý cần dịch. Năm câu dùng năm khung Anh riêng, không xóa lần lượt từng từ trên cùng một bản dịch.
- Không nhập bản Anh có sẵn làm đáp án chuẩn; chọn lại vị ngữ theo câu Việt và toàn đoạn nguồn. Không cộng 72 câu chuyên sâu bảo toàn vào chỉ tiêu câu mới.

### Việc tự rà đã thực hiện

- Đọc từng khung với các lựa chọn, sửa các phương án không dùng chung bổ ngữ một cách tự nhiên: M091-Q5, M093-Q1, M094-Q1, M098-Q4, M099-Q1/Q3, M102-Q4, M106-Q1/Q4, M108-Q3, M110-Q4, M114-Q3, M116-Q1/Q2, M118-Q5, M120-Q2, M127-Q1, M128-Q3/Q5, M129-Q5 và M131-Q4.
- Bỏ dạng từ gượng `embroideringly paraphrases` ở M117-Q1; thay bằng `embellishes` và viết lại lý do.
- Rà phạm vi phủ định ở M090-Q3 và M117-Q5. Phương án nhiễu có thể tạo một mệnh đề đúng nhưng **không diễn đạt đúng ý câu Việt đang giao**; lời giải phải nói rõ điều này, không được giải thích như thể khung không có chữ phủ định.
- Giữ các phân biệt về lực: `hamper` không phải `preclude`; `facilitate` không phải `guarantee`; `erode a monopoly` không phải chuyển hết độc quyền sang người mới; `takes refuge` không phải `receives monastic ordination`; `withhold hasty blame` không phải miễn mọi trách nhiệm.
- Đối với khuyên răn, báo lỗi, hôn nhân và nhân quả: ghi đúng điều tác giả nguồn trình bày, không tự mở thành chỉ dẫn pháp lý hoặc khẳng định phổ quát ngoài phạm vi đoạn.

### Kiểm tra kỹ thuật

- Chạy lại 50 kiểm thử hiện có: 50 đạt tại mốc 390 câu.
- Bản xem trước xác nhận một đoạn chung mỗi gói; câu Việt nhắc lại không chứa cả đoạn; đủ năm câu mới mở phản hồi; tráo lựa chọn vẫn gắn đúng lời giải; không sao nguyên khung hoặc cả bộ lựa chọn từ ngân hàng cơ bản tương ứng.
- Trình đóng gói chỉ đọc và xuất các câu đã viết. Không tạo thêm câu để bù chỉ tiêu.
- Những kiểm thử mang tên kiểm tra ngân hàng public vẫn chạy trên dữ liệu public cũ; chúng **không** chứng minh đã viết lại toàn bộ ngân hàng. Câu mới được kiểm bởi `manual-reviewed.test.cjs` và vòng tự đọc nội dung nêu trên.

### Trạng thái chính xác tại mốc này

- Đã tự rà: **390/1.440 câu**.
- Nháp cũ còn cần sửa nghĩa và phương án: **270 câu**, không cộng vào số đủ điều kiện phát hành.
- Chưa viết: **780 câu** thuộc 156 đoạn còn lại, bắt đầu từ W12-B01.
- Tổng còn cần viết hoặc sửa và tự rà: **1.050 câu**.
- Chưa có rà ngôn ngữ độc lập hoặc thử độ khó với người học. Không gọi các phép kiểm cấu trúc là chứng nhận độ khó.
- Chưa thay dữ liệu chạy website, chưa push hoặc xuất bản. Các bước tích hợp, kiểm trình duyệt và migration tiến độ chỉ thực hiện sau khi đủ nội dung đã rà.

## 2026-10-29 — sửa quy tắc trích nguyên văn sau phản hồi M129-Q1

### Lỗi đã xác nhận

- Ở M129-Q1, câu giao học viên đã thêm “điều này chưa có nghĩa muốn nắm quyền điều khiển nơi ấy”. Phần ấy không có trong nguồn; khung Anh cũng không diễn đạt nó.
- Lỗi là trộn câu cần dịch với chú giải dùng để phân biệt phương án. Không thể sửa chỉ bằng đổi nhãn rồi vẫn giữ lời diễn giải trong câu Việt.
- Kiểm kê tại thời điểm chuyển quy tắc: có 89 gói/445 câu đã viết (bao gồm 55 câu M133–M143 đang làm trước khi người học yêu cầu dừng để sửa). Chưa câu nào trong các trường `targetVietnamese` cũ là một trích dẫn khớp nguyên chuỗi; 216 trường có dấu hiệu chú giải như “không chỉ”, “không phải”. Đây là dấu hiệu cần rà, không phải kết luận mọi câu diễn giải đều sai nghĩa.

### Điều đã sửa

- Phần Việt hiển thị cho học viên nay chỉ lấy một đoạn ký tự nguyên vẹn trong nguồn Việt. Giữ nguyên chữ, dấu và cách viết; không ghép thêm một câu giải thích vào trích dẫn.
- Nếu người biên soạn đã chọn một trích dẫn nguyên văn thì giữ trích dẫn ấy. Với câu còn chờ rà, công cụ chỉ lấy lại câu hoặc mệnh đề chứa cue từ nguồn, không soạn câu hỏi hoặc phương án mới. Khi một câu nguồn dài bằng cả đoạn, trích mệnh đề liên quan để tránh lặp cả đoạn trên mỗi thẻ.
- Chú giải cũ không còn được đưa vào phần Việt hiển thị. Các bản thảo chưa rà lại vẫn được lưu, không xóa câu cũ.
- Rà riêng cặp trích dẫn–khung Anh–đáp án ở M129–M138: 50 câu. Đã sửa cả khung Anh và phương án khi cần, không chỉ thay câu Việt.
- Ví dụ: thêm lại “only” ở M129-Q1; giữ điều kiện không có lòng thương ở M130-Q5; đưa hành động lễ Phật và xin gia hộ vào M131-Q2; giữ “đủ phước” ở M132-Q5; giữ “không bao giờ” ở M133-Q3; giữ cả dân, nước và mục tiêu phát triển xã hội ở M136-Q4.

### Hai trạng thái kiểm tra không được đánh đồng

- **445/445** phần Việt trong packet xem trước khớp nguyên văn với nguồn. Đây là điều có thể kiểm tự động bằng so sánh chuỗi.
- **50/445** cặp Việt–Anh đã được tự đối chiếu lại theo quy tắc mới. **395 câu còn chờ rà nghĩa của khung Anh và các lựa chọn**; không gọi chúng là đã khớp đầy đủ chỉ vì trích đúng chữ.
- `SOURCE-ALIGNED-PREVIEW.md` chỉ chứa 50 câu đã tự đối chiếu lại. `MANUAL-REVIEWED-PREVIEW.md` vẫn giữ đủ 445 câu, nhưng đánh dấu rõ các gói chờ rà khớp Việt–Anh.
- Không có thay đổi trên website public. Mục tiêu biên soạn 1.440 câu mới vẫn chưa hoàn tất; chưa có rà ngôn ngữ độc lập.
