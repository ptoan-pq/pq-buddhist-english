# Dịch theo ý — lịch sử phát hành

## v2 — 2026-10-30 — Đoạn trọn ý và dịch 1–3 câu

- Ngữ cảnh chung của 12 gói giữ đầy đủ đoạn nguồn đã chọn: giải thích, ví dụ và kết luận; không còn ghép riêng vài câu để khớp bài.
- Vẫn 60 yêu cầu, gồm 36 đơn vị một câu, 12 đơn vị hai câu và 12 đơn vị ba câu nguồn. Mỗi gói có cả bài hai và ba câu; số câu Anh có thể khác số câu Việt khi tách/gộp giúp giữ mạch tự nhiên.
- 28 yêu cầu được biên soạn lại thủ công, bao gồm các đơn vị dài và những vế rời cần khôi phục đủ câu. Dữ liệu ở `translation-units-v2.js`; không tự cắt/gộp từ các đáp án cũ để tạo bài.
- Bài sai có nền đỏ nhạt, viền đỏ đậm, nhãn CHƯA ĐẠT và phần đáp án người học màu đỏ. Khi retry vẫn đỏ; chỉ hết đỏ sau khi nộp đạt. Quy tắc áp dụng cả các khóa cũ.
- Khóa tiến độ v2 riêng; giữ khóa v1 và chuyển PASS/đáp án/số từ gợi ý của 32 câu không đổi. Các câu viết lại có hậu tố `-r2`, không nhận PASS cũ. Có fixture tiến độ v1 tổng hợp để kiểm migration, không phải dữ liệu học cá nhân.
- 71/71 kiểm thử đạt: thêm nguồn đầy đủ, đơn vị hai/ba câu, đỏ khi sai và lúc retry, hết đỏ sau PASS, migration giữ gợi ý nhưng không trao PASS nhầm.
- Bản đọc xuất sang `outputs/meaning-translation-v2/QUESTIONS-60.md`, không ghi đè bản v1.
- Chưa có rà ngôn ngữ độc lập hoặc hiệu chuẩn độ khó. Giới hạn kiểm tra trực quan nêu ở bản v1 vẫn áp dụng khi trình duyệt không mở được.

## v1 — 2026-10-30

## Phạm vi

- Mục thứ ba trong PQ English, không thay thế hai chương trình đã phát hành.
- 12 gói D01–D12, 60 câu, năm câu cùng dạng trên mỗi gói.
- Dựng câu bằng cụm (20), sửa dịch sát chữ (15), đổi trục câu (15), giữ mạch và nối ý (10).
- Nguồn Việt tái dùng từ những đoạn đã có trong Master động từ, trích nguyên văn và tuyển phần đủ ngữ cảnh. Bản Anh được đối chiếu lại theo Nghĩa–Lực–Giọng của Janna Translation; không tự coi bản cũ là đáp án bất biến.
- Cụm đúng, thẻ dư, trật tự được chấp nhận và phân tích được biên soạn riêng. Compiler chỉ triển khai thẻ thành ID từ để gợi ý một từ; không sinh bản dịch hay distractor.

## Hành vi

- Chọn gói tùy ý; nguồn một lần, năm câu bên dưới, nộp cả gói mới reveal.
- Click cụm để ghép; click từ để trả xuống, click ô trống để đặt chỗ chèn. Có Hoàn tác và Làm lại.
- Một lần gợi ý đặt một từ, tối đa ba từ/câu; vị trí gợi ý được giữ khi reset, retry, đổi gói hoặc tải lại.
- Đúng ngay không gợi ý, đúng có gợi ý và đúng sau phản hồi được thống kê riêng. Không coi kết quả sau xem mẫu là tự làm độc lập.
- Tiến độ riêng `pq-english-meaning-translation-v1`, có trong xuất/nhập JSON toàn project và sổ tay Markdown.
- Hai thẻ cùng chữ không bị chấm khác chỉ vì ID thẻ; dấu câu ở các trật tự khác được chấp nhận được trình bày lại theo bản đã biên soạn.

## Kiểm chứng

- 68/68 kiểm thử đạt, gồm toàn bộ tập hồi quy và kiểm thử mới về ghép cụm, thẻ dư, undo, gợi ý đúng một từ, chặn lần gợi ý thứ tư, khóa từ gợi ý, retry, khôi phục, lưu hỗ trợ, đủ năm câu mới chữa, cả 60 câu hoàn thành được và deep link.
- Câu Việt và các đoạn tuyển được kiểm là chuỗi nguyên văn trong nguồn đang tham chiếu.
- Không thay `context-bank.js`, `context-verbs.js`, `advanced-verbs.js`, nội dung hai khóa cũ hoặc các khóa lưu tiến độ cũ.
- Chưa kiểm tra screenshot/visual QA được: profile Chrome kết nối chưa mở cửa sổ; trình duyệt trong ứng dụng bị tắt trong Work settings. Kiểm thử DOM không được coi là kiểm tra hình ảnh.
- Chưa có rà ngôn ngữ độc lập hoặc hiệu chuẩn độ khó với nhiều người học. Bài click vẫn là dịch có hỗ trợ, không tương đương dịch tự do.

## Bản đọc nội dung

Chạy `node authoring/export-translation.cjs` để xuất `outputs/meaning-translation-v1/QUESTIONS-60.md` bên ngoài repository. File ghi đoạn nguồn, toàn bộ thẻ, bản dịch và phân tích theo từng gói.
