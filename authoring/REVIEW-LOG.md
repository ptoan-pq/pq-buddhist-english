# Nhật ký rà bản biên soạn thủ công

## Quyết định hiện hành — 2026-10-30, đính chính sau phản hồi người học

**Dạng đúng: chỉ chọn động từ/cụm động từ, chỉ một đáp án đúng nhất theo câu nguồn.** Quyết định này thay thế hướng chọn toàn câu và nhiều lựa chọn cùng đúng được ghi trong các mục lịch sử phía dưới.

- Người biên soạn đã hiểu sai yêu cầu khi chuyển 115 câu sang chọn toàn câu. Số 115 không còn được báo như tiến độ đạt yêu cầu hiện hành.
- Khôi phục các khung chọn động từ trước khi rẽ hướng; giữ vòng sửa trích nguyên văn và 75 cặp đã đối chiếu của bản trước. Phần chưa rà vẫn mang trạng thái chờ rà, không tự nhận toàn bộ 445 câu đã đủ tốt hoặc đủ khó.
- Nhánh Git `archive/whole-expression-13aa48f` giữ nguyên bản chọn toàn câu để không mất nội dung, nhưng bản này không còn là ngân hàng hiện hành. Hai Markdown chọn toàn câu/cả bốn dùng được được đánh dấu lưu trữ.
- Sửa quy định trong README: ba phương án nhiễu phải cạnh tranh gần nghĩa nhưng có căn cứ loại rõ trong chính câu nguồn. Nếu hai lựa chọn sát ngang nhau thì viết lại, không dùng nhiều đáp án được chấp nhận và không ép chấm theo gu văn phong.
- Công cụ đóng gói từ chối câu không có khung Anh thực, câu dạng chọn toàn bản dịch và trường đánh dấu cả bốn hợp lệ/nhiều phương án ưu tiên. Chỉ số đáp án duy nhất là thuộc tính kỹ thuật, không tự chứng minh về ngôn ngữ rằng không có cách dùng chồng lấn.
- Tự soạn lại riêng M142: năm câu với các nhóm thao tác về thực tế/giả định, học thuộc/nắm vững/hệ thống hóa/xem xét, sắc thái lời chuyển, chạm tay/tra cứu/nghiên cứu/ghi chú, và đọc kỹ/đọc lướt/giở xem/xem lựa phần. Giữ nguyên cả chi tiết đêm nghiên cứu lẫn nghĩa vụ của luật sư.
- `VERB-CHOICE-REVIEWED-PREVIEW.md` chỉ chứa năm câu vừa tự rà lại theo yêu cầu này. Tổng nháp hiện hành vẫn 445 câu, trong đó 370 câu chờ đối chiếu lại cặp Việt–Anh theo quy tắc nguyên văn; bộ phương án nhiễu còn phải được sửa tiếp. Không cộng năm câu sửa vào tổng như năm câu mới.
- Toàn bộ **54/54 kiểm thử đạt**, gồm kiểm khóa phản hồi đủ năm câu và kiểm đúng một lựa chọn được chấm. Chưa có người rà độc lập hoặc hiệu chuẩn độ khó với người học. Website public chưa thay đổi.

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

## 2026-10-29 — tiếp tục đối chiếu và thay chuẩn độ khó

- Tự rà tiếp M139–M143, thêm 25 cặp. Tổng đã đối chiếu lại nguyên văn Việt với khung Anh: **75/445**. Giữ lại số người, chi tiết công việc, mức so sánh, điều kiện và chữ “phải”; sửa những câu trước chỉ nói về lập luận thay vì dịch chính câu trích.
- Sau phản hồi “tất cả các đáp án phải đều đúng — chọn đúng nhất”, dừng việc coi phương án khác hẳn nghĩa là câu nâng cao. Phạm vi tự rà Việt–Anh không tự chứng minh bộ lựa chọn đã đạt độ khó.
- Viết lại riêng cả năm bộ lựa chọn của M129: bốn cách đều chấp nhận được trong ngữ cảnh; tiêu chí ưu tiên dựa trên nét nghĩa, trọng tâm hoặc giọng nguồn. Lời giải nói rõ các cách không ưu tiên vẫn dùng được.
- M129-Q2 chấp nhận ngang nhau `stay away from` và `steer clear of`. M129-Q4 chấp nhận cả cách dùng `offer` và `give`. Không gán thứ bậc chắc chắn ở nơi chỉ có lựa chọn văn phong tương đương.
- Lưu riêng `validAnswers` và `preferredAnswers`; tráo phương án vẫn giữ đủ các chỉ số ưu tiên. Dùng trường `accepted` sẵn có để không đánh rớt một lựa chọn cùng mức ưu tiên trong kiểm thử.
- **5/445 câu** đã được viết lại theo chuẩn lựa chọn gần nghĩa mới; **440 câu còn chờ sửa độ khó**. Con số 75 cặp khớp nguồn không được dùng thay cho con số 5 câu đạt vòng biên soạn mới.
- Xuất thêm `BEST-FIT-PREVIEW.md` để kiểm đúng năm câu đã đổi. Chưa cập nhật website hoặc nhãn phản hồi trên giao diện public.

## 2026-10-29 — chuyển trọng tâm từ chọn từ sang chọn cách diễn đạt

- Theo yêu cầu mới, không giới hạn bài vào thay động từ trong một khung cố định. Viết lại M133–M138, **30 câu**, mỗi câu có bốn cách diễn đạt hoàn chỉnh được soạn riêng.
- Tất cả giữ nguyên phần Việt trích từ nguồn. Phương án khác nhau ở cách chọn chủ ngữ, hướng thông tin, mức hoàn tất hành động, quan hệ mục đích/kết quả, chủ động/bị động, danh hóa, thành ngữ và nhịp.
- M133-Q4 so câu lấy sự mê đắm làm tác nhân với câu lấy con người hoặc mối quan tâm bị lấn chỗ làm chủ ngữ. M134-Q3 so hành động đóng thuế với khoản đóng làm bằng chứng. M136-Q3 giữ cùng mức cố gắng và giảm một phần, so cách dựng câu chủ động, bị động và diễn giải dài. M138-Q4 chấp nhận cả retain và not lose khi dùng trong hai cấu trúc mục đích sát ngang nhau.
- Không có quy tắc ưu tiên chủ động, từ mạnh hoặc từ hiếm bằng mọi giá. M137-Q3 chấp nhận cả `is an expression of` và `reflects`; M138-Q3 chấp nhận cả định nghĩa bằng `striving` và bằng danh từ `effort` rõ nghĩa.
- Thêm `taskKind: expression-choice`, lưu nguyên văn bốn lựa chọn; trình đóng gói không sinh phương án. Dấu `___` nội bộ được thay bằng hướng dẫn chọn toàn bộ ý, không hiện bài điền từ cho học viên.
- Kiểm thử vẫn kiểm sản phẩm riêng của năm nhiệm vụ: đối với dạng mới, so câu hoàn chỉnh chứ không đòi năm ký hiệu lắp dữ liệu phải khác nhau. Không đánh đồng độ dài câu với độ khó hoặc độ hoàn chỉnh ngữ pháp.
- Xuất `WHOLE-EXPRESSION-PREVIEW.md` riêng để đọc 30 câu mới. Tổng hiện có 35 câu dạng chọn cách ưu tiên trong các phương án dùng được: 30 câu chọn cả cách diễn đạt, 5 câu M129 phân biệt cụm gần nghĩa trước đó. **410/445 câu còn chờ viết lại theo chuẩn độ khó mới**.
- Đây là vòng tự biên soạn và tự rà, chưa có hiệu chuẩn bằng người học hoặc người rà độc lập. Website public chưa đổi.

## 2026-10-30 — tiếp tục biên soạn toàn câu, hoàn tất vòng mới M121–M143

### Phạm vi thực sự đã làm trong lượt này

- Viết lại **85 câu** ở M121–M132 và M139–M143. Không tạo gói mới để tăng số đếm: đây là thay thế nội dung của 17 gói đã có, sau khi đọc lại nguồn riêng của từng gói.
- M129 trước đó mới có năm câu chọn cụm gần nghĩa; nay cũng chuyển thành năm nhiệm vụ chọn cách diễn đạt cả ý. Giữ các trích dẫn nguyên văn và cho phép nhiều cách cùng mức ưu tiên.
- M133–M138 giữ 30 câu toàn ý đã viết từ lượt trước. Tổng hiện có **115 câu toàn ý ở 23 gói liên tục M121–M143**, mỗi câu có bốn lựa chọn tự soạn và lời so sánh riêng.
- Trong lượt này thêm **40 cặp Việt–Anh được đối chiếu lại** ở M121–M128; các gói khác trong lượt đã có trạng thái đối chiếu nhưng được đọc lại khi thay toàn bộ lựa chọn.

### Những lỗi nghĩa đã sửa, không chỉ đổi hình thức câu hỏi

- M121-Q1 giữ đủ ba mặt: đau khổ, khát khao và cả lầm lỗi. M121-Q3 khôi phục phủ định ở người chưa cảm nhận được mức đau; không còn chỉ nói nỗi đau hành hạ bệnh nhân. M121-Q5 dùng đúng mệnh đề về chí lớn không thành và hụt hẫng thay cho một lời bình về không bác bỏ ý kiến người vợ.
- M122 không dùng câu tóm tắt quan điểm của bài thay cho câu nguồn. Giữ cả trộm đột nhập, bị phát hiện, chạy thoát; không tự thêm đe dọa giết người. Giữ đủ phản ứng của chủ nhà và quan hệ hiểu rõ hơn có lúc dẫn đến nghiêm hơn.
- M123 giữ không vội trách/khen, không đổi thành không bao giờ trách/khen. Phương án ưu tiên ở cặp này giữ tính đối ứng của hai câu Việt; danh hóa hoặc hình ảnh mạnh hơn không tự được điểm cao hơn.
- M124 giữ việc nhà sư thả trôi đời vì bất mãn, huynh đệ đến bày tỏ thương tin và khởi sự lập lại đời tu. Không biến đoạn thành một chuyện hoàn tục hoặc thành tựu tu chứng đã hoàn tất.
- M125 giữ hạn học phí, gia đình nghèo và không có tiền. Ý nghĩ tự tử được giữ đúng là ý nghĩ trong ví dụ nguồn, không gán thành hành động. Không đành lòng bỏ mặc không bị hạ thành chỉ hơi khó làm ngơ.
- M126 giữ điều kiện vẫn vui vẻ làm việc thiện nguyện khó, rồi khi có việc sẽ tận tụy. Không bỏ thành ngữ không đứng núi này trông núi nọ; dịch bằng ý tìm chỗ khác tốt hơn. Không lẫn không có lương với không có phước hoặc không có niềm vui.
- M127 giữ các cấu trúc càng–càng và không ai sung sướng trọn vẹn, không đổi thành không ai có bất kỳ niềm vui nào. M128 giữ nhịp bác bỏ điều cứ tưởng, niềm vui cùng sức mạnh, và không mong cầu mà được; không diễn thành không cần làm gì cũng có vui.
- M130–M132 giữ đủ lực càng phải, điều kiện đủ đạo lực, yêu cầu có tiền trước, việc lễ Phật xin gia hộ, khả năng làm việc thiện, tu kín đáo và đủ phước rồi mới tính việc giảng sư. Không biến điều kiện cần thành bảo đảm kết quả.
- M139–M143 giữ mức hơi khác, tính tất nhiên của nhận định nhân quả theo nguồn, hai ba người và đủ chi tiết xây nhà, cả đêm cùng đều phải ở ví dụ luật sư, và lực rất mang tội trong lời răn biết quý công ăn việc làm.

### Lựa chọn và kiểm tra

- Mỗi câu mới có năm trường tách bạch: nguyên văn Việt, bốn cách diễn đạt, tiêu chí so sánh, các cách cùng ưu tiên, và lý do cho từng cách. Câu trích không kèm lời gợi ý loại phương án.
- Khi hai hoặc ba cách sát ngang nhau thì cùng chấp nhận; ví dụ ba cách tự kềm chế thú vui ở M140-Q4. Không tạo một đáp án duy nhất chỉ để tiện chấm.
- Sửa phép kiểm dấu kết câu để chấp nhận câu Anh có dấu chấm nằm trong ngoặc kép đóng. Thêm kiểm thử hồi quy cho trường hợp này và trường hợp không có dấu kết câu; không thay dấu câu đúng thành sai chỉ để qua phép kiểm.
- Kiểm thử toàn repo và công cụ build: **57/57 đạt**. Chỉ chứng minh các thuộc tính kỹ thuật, trích nguyên chuỗi, tráo phương án, nhận nhiều lựa chọn ưu tiên và khóa phản hồi đủ năm câu; không chứng minh độ khó hoặc chất lượng dịch độc lập.
- Đã xuất lại các bản Markdown và JSON xem trước. `WHOLE-EXPRESSION-PREVIEW.md` hiện chứa 115 câu; nguồn chung chỉ in một lần mỗi gói, mỗi thẻ nhắc lại đúng một trích dẫn ngắn có liên quan.

### Trạng thái chưa được đánh đồng

- 445 câu trong tập biên soạn hiện tại vẫn là tổng nháp, không tăng thành 530 do việc viết lại.
- **115/445 câu** đã tự rà theo cả chuẩn nguồn nguyên văn và dạng lựa chọn toàn ý mới; **330 câu trong tập này còn chờ viết lại**.
- Ngoài ra còn **270 câu nháp cũ** cần sửa và **725 câu chưa viết**. Vì vậy còn **1.325/1.440 câu** chưa đạt vòng biên soạn mới, chưa kể rà độc lập.
- Giữ nguyên 72 câu chuyên sâu ban đầu ngoài chỉ tiêu 1.440. Chưa sửa dữ liệu chạy website, chưa push hoặc xuất bản. Bản nháp cũ còn được giữ trong lịch sử Git; không lấy câu cơ bản đắp vào chỉ tiêu.
