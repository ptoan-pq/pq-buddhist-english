(function(root){
  'use strict';
  const curriculum=root.PQCurriculum||(typeof require!=='undefined'?require('./curriculum.js'):null);
  const facts=root.PQLessonFacts||(typeof require!=='undefined'?require('./lesson-facts.js'):null);
  const alternatives=root.PQLanguageAlternatives||(typeof require!=='undefined'?require('./lesson-language.js'):null);
  const books={S01:'Buddhism for Beginners',S02:'30 Bài Thiền',S03:'Cẩm Nang Tu Hành Của Cư Sĩ Tại Gia',S04:'Giáo Trình Thiền Học',S05:'Hơi Thở Nhiệm Mầu',S06:'Nền Tảng Đạo Đức',S07:'Nghiệp Và Kết Quả',S08:'Luận Về Nhân Quả',S09:'Tứ Thánh Đế',S12:'Thiền Học Vấn Đáp — Việt–Anh',S13:'Bài Giảng Tâm Lý Đạo Đức'};
  const strategies=[
    'Mean giải thích nghĩa; refer to xác định đối tượng được nói tới; consist of nêu các thành phần; be regarded as xếp loại hoặc nêu cách nhìn. Không đổi bốn chức năng này cho nhau.',
    'Arise from và stem from đi từ kết quả về nguyên nhân. Give rise to và result in đi từ nguyên nhân đến kết quả. Đảo cụm có thể tạo câu đúng ngữ pháp nhưng ngược ý.',
    'Depend on nêu sự phụ thuộc; be shaped by nêu ảnh hưởng; be subject to nêu điều kiện hoặc giới hạn phải chịu. Đừng biến một yếu tố ảnh hưởng thành bảo đảm chắc chắn.',
    'Sustain là giữ cho tiếp tục, reinforce là làm mạnh thêm, perpetuate thường giữ một trạng thái kéo dài. Subside là lắng dần; cease là chấm dứt.',
    'Notice là nhận thấy; recognize là nhận ra; discern nhấn mạnh nhìn ra khác biệt hoặc điều khó thấy; become aware of là bắt đầu ý thức về một điều.',
    'Overlook là bỏ sót; fail to see là chưa nhìn ra; mistake A for B là nhận nhầm A thành B; obscure là che khuất. Tìm đúng điều bị bỏ sót hoặc bị nhận nhầm.',
    'Crave là khao khát; grasp at hướng tới nắm lấy; cling to là bám giữ; identify with là đồng nhất mình với một đối tượng. Bốn cụm diễn tả các quan hệ khác nhau.',
    'Trigger nói điều khơi lên phản ứng, overwhelm nói sự lấn át, restrain nói kiềm chế. Respond to đặt trọng tâm ở cách chủ thể đáp lại hoàn cảnh.',
    'Intend to + động từ là dự định. Refrain from + V-ing là kiềm không làm. Undertake nhận một việc để thực hiện; incline toward nêu khuynh hướng.',
    'Convey truyền đạt nội dung hoặc cảm xúc. Persuade someone to do tác động đến quyết định; encourage khích lệ. Undermine làm suy yếu chứ không chỉ mô tả sự khác biệt.',
    'Care for đi với người cần chăm sóc; relieve đi với nỗi đau hay gánh nặng. Reach out to nhấn mạnh chủ động tìm đến giúp; benefit thường nhận tân ngữ trực tiếp.',
    'Contribute to nêu đóng góp; provide for nêu chu cấp; fulfil đi với duties hoặc responsibilities; uphold đi với nguyên tắc, phẩm giá hoặc điều được giữ gìn.',
    'Attend to và bring attention to nêu hướng chú ý; remain aware of nêu việc duy trì nhận biết. Giữ rõ đối tượng là thân hoặc hơi thở trong ngữ cảnh đã nêu.',
    'Inhale và exhale phân biệt chiều hơi thở. Allow cho phép diễn tiến, regulate điều chỉnh, settle đưa về trạng thái ổn định. Đừng tự thêm yêu cầu gắng sức hay thở sâu.',
    'Cultivate nuôi dưỡng, maintain duy trì, deepen làm sâu hơn, overcome vượt qua. Chọn động từ theo đối tượng: phẩm chất, nếp thực hành, hiểu biết hay chướng ngại.',
    'Indicate và suggest có thể nói dấu hiệu hoặc điều được gợi ra, không tự biến thành chứng minh tuyệt đối. Distinguish A from B nêu phân biệt; guard against nêu điều cần phòng.',
    'Put simply báo trước cách giải thích giản dị. In this context giới hạn nghĩa theo đoạn. By X, we mean Y làm rõ cách dùng từ, không tuyên bố đó là mọi nghĩa có thể có.',
    'Set in motion khởi động chuỗi; lead to nối nguyên nhân với hệ quả. In turn nối một bước sang bước tiếp; thereby thường theo sau bằng V-ing để diễn đạt hệ quả của việc trước.',
    'Distinguish A from B giữ hai khái niệm riêng. Assume không đồng nghĩa đã biết chắc; misinterpret nói việc diễn giải sai. Xác định đúng điều đang bị đồng nhất hoặc hiểu nhầm.',
    'To some extent giữ mức độ một phần. Provided that đặt điều kiện. This does not mean chặn một suy diễn quá xa. Bỏ các cụm này có thể làm phát biểu mạnh hơn nguồn.',
    'Address a question xử lý đúng điều được hỏi. Clarify làm sáng nghĩa; illustrate đưa ví dụ; sum up tóm lại. Đừng dùng ví dụ thay cho câu trả lời chính.',
    'Reconcile tìm cách dung hòa; bridge nối khoảng cách; coexist nói cùng tồn tại; respect nói thái độ tôn trọng. Cùng tồn tại không đồng nghĩa mọi quan điểm giống nhau.',
    'Evoke gợi lên hình ảnh hoặc cảm xúc; embody thể hiện một giá trị; mirror phản chiếu; unfold nhấn mạnh sự phát triển. Giữ hình ảnh gắn với ý nguồn thay vì dịch từng chữ.',
    'Signpost báo cấu trúc, develop triển khai, qualify giới hạn phát biểu, conclude kết lại. Chọn theo vai trò của câu trong toàn đoạn, không chỉ nghĩa một từ riêng lẻ.'
  ];
  function source(ref){
    const p=ref.split('/'),book=`S${p[0]}`,last=p.at(-1),chapter=p.length===3?p[1]:book==='S07'?'3':book==='S05'?'2':book==='S03'?'4':'1';
    const locator=book==='S12'?`pdf:p:${last}:b:0002:part:2`:['S01','S02','S09','S13'].includes(book)?`docx:p:${last}`:`epub:c:${chapter.padStart(4,'0')}:b:${last}`;
    return {book,title:books[book],locator:`${book}|${locator}`};
  }
  const join=(...parts)=>parts.filter(Boolean).join(' ');
  function choices(f){
    let wrong=alternatives[f[2]];
    if(!wrong)throw Error(`Thiếu phương án đối chiếu: ${f[2]}`);
    if(f[2]==='conclude'&&f[3].startsWith('that '))wrong=['deny','reject the claim','ignore the argument'];
    if(f[2]==='conclude'&&f[3].startsWith('with '))wrong=['disagree','take issue','dispense'];
    return [f[2],...wrong].map(v=>join(f[1],v,f[3]));
  }
  function chunks(text){const words=text.split(' ');if(words.length<8)return [text];const middle=Math.ceil(words.length/2);return [words.slice(0,middle).join(' '),words.slice(middle).join(' ')];}
  function base(week,f,index){
    const analysis=`${strategies[week.week-1]} Ý cần giữ: ${f[0]} Trục diễn đạt: ${join(f[1],`[${f[2]}]`,f[3])}`;
    return {topic:`Ý ${index+1} · ${source(f[4]).book}`,prompt:f[0],source:source(f[4]),analysis,pattern:f[2],meaningId:`${week.id}-meaning-${index+1}`,focus:f[2]};
  }
  const courses=curriculum.weeks.map(week=>{
    const bank=facts[week.id];if(!bank||bank.length!==12)throw Error(`Cần đủ 12 ý nguồn cho ${week.id}`);
    const first=bank.slice(0,6),second=bank.slice(6);
    const sets=[
      {id:'M01',title:'Nhận diện cách diễn đạt',type:'choice',phase:'Làm quen nhanh',instruction:'Sáu ý nguồn khác nhau. Chọn câu giữ đúng ý Việt; trả lời đủ rồi nộp cả bộ.',items:first.map((f,i)=>({...base(week,f,i),options:choices(f),answer:0}))},
      {id:'V01',title:'Điền cụm theo ngữ cảnh',type:'gaps',phase:'Vận dụng',instruction:'Bấm ô trống và chọn cụm. Chú ý chiều quan hệ và phạm vi nghĩa; không chỉ dựa vào ngữ pháp.',items:second.map((f,i)=>({...base(week,f,i+6),parts:[f[1]?`${f[1]} `:'',` ${f[3]}`],options:[f[2],...alternatives[f[2]]],answer:[0]}))},
      {id:'V02',title:'Ghép câu và chọn trục ý',type:'order',phase:'Vận dụng',instruction:'Sáu câu cùng hiển thị. Ghép các cụm thành câu đúng ý Việt. Có mảnh thừa; bấm mảnh đã chọn để bỏ.',items:first.map((f,i)=>{const tokens=[...(f[1]?chunks(f[1]):[]),f[2],...chunks(f[3])],extra=alternatives[f[2]].slice(0,2).filter(v=>!tokens.includes(v));return {...base(week,f,i),tokens:[...tokens,...extra],answer:tokens.map((_,j)=>j)};})},
      {id:'V03',title:'Đối chiếu những câu gần nghĩa',type:'choice',phase:'Vận dụng',instruction:'Các phương án thay đổi động từ, quan hệ hoặc độ khẳng định. Chọn một bản diễn đạt sát ý nguồn nhất.',items:second.map((f,i)=>({...base(week,f,i+6),options:choices(f),answer:0}))},
      {id:'V04',title:'Nối ý Việt với câu Anh',type:'match',phase:'Vận dụng',instruction:'Mỗi câu là một nhóm hai ý Việt. Nối mỗi ý với câu Anh phù hợp; có hai phương án thừa trong nhóm. Làm đủ sáu nhóm rồi nộp.',items:first.map((f,i)=>{const other=second[i],a=choices(f),b=choices(other);return {...base(week,f,i),prompt:'Nối đúng hai ý dưới đây. Giữ cả nội dung và cách tổ chức quan hệ.',left:[f[0],other[0]],options:[a[0],b[0],a[1],b[1]],answer:[0,1],sources:[source(f[4]),source(other[4])],meaningIds:[`${week.id}-meaning-${i+1}`,`${week.id}-meaning-${i+7}`],analysis:`Ý thứ nhất: ${a[0]} Ý thứ hai: ${b[0]} Hai câu còn lại đổi cụm trọng tâm, nên không còn là bản diễn đạt đúng của hai ý Việt.`,pattern:`${f[2]} · ${other[2]}`};})},
      {id:'E01',title:'Dựng đoạn và chuyển giao',type:'paragraph',phase:'Vận dụng tổng hợp',instruction:'Đọc hai ý Việt trong mỗi câu. Ghép đoạn ba câu: câu giới thiệu trước, rồi hai câu đúng ý. Có hai câu thừa. Hai thứ tự tự nhiên của phần thân đều được chấp nhận.',items:first.map((f,i)=>{const other=second[i],a=choices(f),b=choices(other);return {...base(week,f,i),prompt:`${f[0]}\n${other[0]}\nMở đoạn bằng câu giới thiệu hai ý, rồi chọn đủ hai câu đúng.`,tokens:['The passages make two related points.',a[0],b[0],a[1],b[1]],answer:[0,1,2],accepted:[[0,1,2],[0,2,1]],sources:[source(f[4]),source(other[4])],meaningIds:[`${week.id}-meaning-${i+1}`,`${week.id}-meaning-${i+7}`],analysis:`Câu đầu báo trước hai ý. Cả hai ý phải được giữ nguyên: ${a[0]} ${b[0]} Hai câu trong thân có thể đổi chỗ trong bài tập này; không bắt người học theo một thứ tự tùy ý.`,pattern:`${f[2]} · ${other[2]}`};})}
    ];
    sets.forEach(set=>set.items.forEach((q,i)=>{q.id=`${week.id}-${set.id}.${i+1}`;}));
    return {id:`pq-en-${week.id.toLowerCase()}`,version:1,week:week.week,weekId:week.id,title:`Chủ điểm ${week.week} — ${week.title}`,subtitle:week.function,phase:week.phase,targets:week.targets,curriculumSources:week.likelySources,sets};
  });
  root.PQCourses=courses;
  if(typeof module!=='undefined'&&module.exports)module.exports=courses;
})(typeof globalThis!=='undefined'?globalThis:this);
