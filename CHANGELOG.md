# Lịch sử phiên bản web

## Sổ tay cụm diễn đạt — 2026-10-30

- Thêm `Cụm đã lưu` để lưu expression sau khi nộp và xem lại cả câu Anh, ý Việt, khung dùng, phân tích và nguồn.
- Thêm `Ôn hôm nay`: mỗi lượt 5–7 câu cùng dạng, chỉ mở đáp án sau khi nộp đủ lượt; có gọi lại câu nguồn, chọn sắc thái, ghép câu mới và sửa bản dịch sát chữ.
- Bài vận dụng mới hiện có cho 24 cụm được tuyển thủ công, mỗi cụm 4 tình huống khác nhau; không tính việc nhớ nguyên câu nguồn là dùng vững.
- Thêm lịch nhắc 1–3–7–14–30 ngày, trạng thái Đã lưu → Đang luyện → Cần ôn lại → Vững trong bài ôn; gợi ý được ghi là có hỗ trợ.
- Thêm backup/restore sổ tay cụm từ tùy chọn; JSON cũ không có sổ tay vẫn khôi phục bình thường và không xóa dữ liệu sổ tay hiện tại.
- Thêm kiểm thử dữ liệu hỏng, lưu trùng, lịch ôn, retry, backup, giao diện click-only; toàn bộ **83/83 test** đạt.

## Bổ sung ghi chú tư duy — 2026-10-30

- Lưu nội dung người học bổ sung tại `authoring/translation-thinking-note.md`.
- Thêm vào “Cách tư duy trước khi dịch”: câu hỏi theo tình huống/mục đích, 5 bước tư duy, ví dụ swamped at work, 5 cách chuyển cấu trúc, dịch theo chức năng và bài tập dịch ngược.
- Giữ hướng dẫn cũ cùng bước đối chiếu nguồn ở cuối; không thay ngân hàng 1.500 câu, ID hoặc tiến độ.
- Kiểm thử nội dung ghi chú và việc mở hướng dẫn không làm mất câu đang ghép/gợi ý.

## 5.0 — 2026-10-29

### Mở rộng khóa Master động từ

- Mở rộng từ 72 lên **1.452 câu nâng cao trong 288 gói**, ngang quy mô ngân hàng cơ bản 1.440 câu.
- Giữ nguyên 72 câu đã biên soạn chuyên sâu; bổ sung 1.380 câu vận dụng theo các đoạn nguồn còn lại của 24 chủ điểm.
- Mỗi câu mở rộng vẫn nhắc lại câu Việt đầy đủ, cụm nguồn và bốn lựa chọn; tiến độ được chuyển sang khóa `verb-mastery-v2`, không trộn với kho ôn cơ bản.

- Tách hai chương trình: Diễn đạt Phật học (24 chủ điểm, 1.440 câu gốc) và Master động từ (288 gói, 1.452 câu nâng cao).
- Không còn gói gộp 5 câu gốc + 5 câu động từ. Kho 1.440 câu động từ cũ vẫn được giữ nguyên trong mục ôn cơ bản của khóa động từ.
- Soạn 72 câu mới với khung câu Anh đầy đủ, câu Việt nhắc ngữ cảnh và phương án nhiễu gần về nghĩa/chức năng. Phản hồi phân biệt căn cứ nhận thức, tác nhân, độ hoàn tất, cường độ và diễn tiến; không chỉ dùng các từ trái nghĩa rõ rệt.
- Thêm chọn khóa học, danh mục gói động từ độc lập, bộ chọn gói mở tự do và sổ tay/tiến độ riêng.
- Chuyển dữ liệu bộ gộp sang phần gốc và kho ôn theo ID; giữ bản lưu cũ, hỗ trợ nhập JSON cũ, không chuyển PASS cơ bản thành PASS nâng cao.
- Thêm kiểm thử tách đủ 24 chủ điểm, dữ liệu lỗi, khôi phục/xuất ghi chú, nộp 6 câu cùng lúc và tương tác đổi khóa/giữ lựa chọn qua DOM test double. Không coi kiểm thử DOM là kiểm tra trực quan trình duyệt.

## 4.1.1 — 2026-10-29

- Hiện lại nguyên câu tiếng Việt chứa ý đang hỏi ngay trong từng câu hỏi động từ, thay vì chỉ đưa cụm rời như “vào được”, “tìm tòi”.
- Bỏ giới hạn cắt trích dẫn giữa câu; giữ nguyên phủ định, điều kiện và phần bổ nghĩa của câu nguồn. Rút gọn hướng dẫn lặp lại.
- Tái xuất cả 1.440 câu động từ và bản Markdown. Không đổi mã câu, phương án, thứ tự lựa chọn, đáp án, phiên bản tiến độ hoặc khóa lưu của v4.1.
- Bổ sung kiểm thử câu trong ảnh, câu Việt dài và dấu kiểm toàn bộ mã câu–lựa chọn–đáp án để ngăn thay đổi tiến độ ngoài ý muốn.

## 4.1 — 2026-10-29

- Soạn lại cả 1.440 câu động từ thành chọn từ phù hợp nhất với ý thực sự có trong ngữ cảnh Việt. Bỏ toàn bộ mục tiêu sắc thái giả định và câu luyện thao tác dịch không xuất phát từ nguồn.
- Mỗi câu chỉ rõ cụm nguồn; lời giải dẫn lại câu chứa cụm ấy và phân biệt bốn lựa chọn. Có khung câu Anh khuyết động từ ở các bài biên soạn theo câu.
- Sửa lỗi biến tính từ thành hành động: “phong phú” không tự cho phép dùng “enrich”. Rà các từ đa nghĩa và thành ngữ như “học”, “thuộc”, “đặt mình vào vị trí”, “đứng núi này trông núi nọ”.
- Giữ nguyên 1.440 câu gốc và tự do chọn gói. Phiên bản dữ liệu mới giữ tiến độ của 5 câu gốc; 5 câu động từ đã viết lại bắt đầu lượt mới, không dùng lại đáp án cũ cho một câu khác nghĩa. Các khóa lưu cũ không bị ghi đè.
- Thêm kiểm thử lỗi trong ảnh, từ đa nghĩa, căn cứ nguồn và chuyển tiến độ khi thay câu hỏi.

## 4.0 — 2026-10-29

- Giữ nguyên ngân hàng 1.440 câu cũ và thêm 1.440 câu chọn động từ theo sắc thái khi dịch: 288 gói × 10 câu.
- Câu 1–5 giữ dạng bài cũ; câu 6–10 là chọn động từ/cụm động từ, không giới hạn theo từ đích của chủ điểm.
- Mỗi câu mới giải thích ý nghĩa của cả bốn lựa chọn và nét nghĩa quyết định đáp án theo yêu cầu diễn đạt.
- Cho mở bất kỳ gói theo đoạn; ghi riêng chưa học, đã học chưa hoàn thành và hoàn thành. Đổi gói giữ các đáp án đang làm.
- Vẫn nộp đủ câu của một gói mới mở phản hồi của gói đó; chỉ làm lại câu sai.
- Lưu bản mở rộng dưới khóa mới, giữ nguyên bản lưu cũ. Chuyển lịch sử, đáp án và các câu đã PASS từ bản 5 câu sang bản 10 câu.
- Bổ sung kiểm thử dạng bài hỗn hợp, chọn gói không tuần tự, chuyển tiến độ cũ và bảo toàn 5 câu gốc.

## 3.1 — 2026-10-29

- Rà toàn bộ 1.440 lời hỏi và hướng dẫn tiếng Việt trên 24 chủ điểm.
- Viết lại các ghi chú cụt của người soạn thành câu hỏi dành cho người học.
- Phân biệt rõ thao tác điền cụm, sắp xếp mảnh và chọn bản sửa.
- Đặt các cụm tiếng Anh đang được hỏi vào ngoặc kép; bỏ thuật ngữ hướng dẫn chưa Việt hóa.
- Giữ nguyên mã câu, lựa chọn, đáp án chấm và nguồn; không đổi phiên bản dữ liệu tiến độ.
- Đồng bộ bản website với bản Markdown và thêm kiểm thử chống tái xuất hiện câu hướng dẫn lỗi.

## 2.2 — 2026-10-28

- Thêm ô “Chọn chủ điểm” ngay trong mọi màn hình, luôn hiện khi cuộn.
- Đổi trực tiếp giữa 24 chủ điểm mà không cần trở về menu Chương trình.
- Kiểm tra trên giao diện: đổi 24 → 7 → 24 khi chưa nộp, câu đã chọn vẫn còn.

## 2.1 — 2026-10-28

- Mở tự do tất cả 24 chủ điểm theo lựa chọn của người học.
- Giữ tiến độ từng chủ điểm và quy tắc PASS giữa các bộ bên trong chủ điểm.
- Kiểm thử chuyển giữa chủ điểm đầu và cuối mà không mất đáp án.

## 2.0 — 2026-10-27

- Đưa đúng 24 tuần/chủ điểm và core language của curriculum v4 lên danh mục.
- Thay Bài 1 tổng hợp bằng chủ điểm Định nghĩa và phân loại đúng khung gốc.
- Thêm 864 câu trong 144 bộ, mỗi bộ 6 câu cùng thể loại; 720 câu vận dụng.
- Tách tiến độ từng chủ điểm, khóa chuyển chủ điểm khi phần trước chưa PASS.
- Giữ nguyên nội dung và khóa lưu v1; có đường mở lại bản cũ.
- Sao lưu toàn project, nhập được JSON v1, xuất Markdown riêng từng chủ điểm.
- Kiểm tra 110 định vị nguồn tồn tại trong thư viện gốc.
- Thêm kiểm thử thứ tự curriculum, hoàn thành cả 24 chủ điểm, backup và tương thích dữ liệu.

## 1.0 — 2026-10-27

- Phát hành bản tổng hợp 72 câu, 12 bộ × 6 câu, giao diện một cột.
- Chọn, ghép, điền, nối và dựng đoạn; chữa theo cả bộ; lưu trình duyệt.
- Phiên bản này chưa chuyển đúng khung 24 chủ điểm; giữ riêng để không làm mất tiến độ người đã học.
