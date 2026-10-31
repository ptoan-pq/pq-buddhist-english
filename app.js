(function () {
  'use strict';
  const E=window.PQEngine,P=window.PQProject,X=window.PQExpressions,courses=window.PQContextCourses||window.PQCourses,verbs=window.PQVerbCourse,verbArchive=window.PQVerbArchive,translation=window.PQTranslationCourse,legacy=window.PQCourse,allCourses=[...courses,verbs,verbArchive,translation,legacy],states={},blocked=new Set(),SELECTED='pq-english-selected-v3';
  let expressionBook=X.create(),bookBlocked=false,bookFilter='all',reviewEarly=false;
  let selected;try{selected=localStorage.getItem(SELECTED);}catch(err){}
  const translationTotal=translation.sets.reduce((sum,set)=>sum+set.items.length,0);
  let C=allCourses.find(c=>c.id===selected)||courses[0];
  const requested=window.location?.hash?.slice(1);if(requested==='translation')C=translation;else if(requested==='verbs')C=verbs;else if(requested==='dharma')C=courses[0];
  const main=document.getElementById('main'),warning=document.getElementById('storage-warning');
  let state=E.create(C),view='catalog',displayed=0,gapFocus={},wordFocus={},hintFlash=null,guideOpen=false;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  function announce(message){warning.textContent=message;warning.hidden=!message;}
  try{const raw=localStorage.getItem(X.storageKey);if(raw)expressionBook=X.validate(JSON.parse(raw));}catch(err){bookBlocked=true;announce('Sổ tay cụm từ chưa đọc được; dữ liệu gốc vẫn được giữ nguyên. Hãy giữ bản sao lưu trước khi khôi phục.');}
  allCourses.forEach(course=>{try{const raw=localStorage.getItem(P.key(course));if(raw)states[course.id]=E.validate(course,JSON.parse(raw));else{const sources=(course.previousSources||[]).flatMap(spec=>{const previous=localStorage.getItem(spec.key);if(!previous)return [];const parsed=JSON.parse(previous);return P.compatibleSource(course,parsed)?[parsed]:[];});states[course.id]=sources.length?P.migrateSubset(course,sources):E.create(course);}}catch(err){blocked.add(course.id);states[course.id]=E.create(course);announce('Một bản tiến độ cũ chưa đọc được và được giữ nguyên. Các khóa khác vẫn sử dụng được; bạn có thể khôi phục từ JSON.');}});
  state=states[C.id];
  displayed=state.active;
  function save(){states[C.id]=state;if(blocked.has(C.id))return;try{localStorage.setItem(P.key(C),JSON.stringify(state));localStorage.setItem(SELECTED,C.id);}catch(err){announce('Trình duyệt chưa lưu được tiến độ. Hãy dùng Tiến độ → Tải sao lưu để giữ lại bài đang làm.');}}
  function programHash(){window.history?.replaceState(null,'','#'+(C.programId||'dharma'));}
  function openCourse(course,index){if(course.weekId&&!P.canOpen(courses,course.id))return;C=course;state=states[C.id];displayed=Number.isInteger(index)?index:state.active;gapFocus={};view='learn';if(C.freeSets){E.openSet(C,state,displayed);save();}try{localStorage.setItem(SELECTED,C.id);}catch(err){}programHash();render();goTop();}
  function showProgram(id){C=id==='translation'?translation:id==='verbs'?verbs:courses[0];state=states[C.id];displayed=state.active;view='catalog';save();programHash();render();goTop();}
  function openPacket(i){if(C.freeSets)change(()=>{E.openSet(C,state,i);displayed=i;gapFocus={};view='learn';});else{displayed=i;gapFocus={};render();}goTop();}
  function packetStatus(r){return r?.status==='passed'?'Hoàn thành':r?.visited||r?.history.length||Object.keys(r?.responses||{}).length?'Đã học · chưa hoàn thành':'Chưa học';}
  function renderTopicPicker(){
    const pickers=node('div',undefined,view==='learn'?'course-pickers picker-static':'course-pickers'),programId=C.programId||'dharma',program=node('div',undefined,'topic-picker'),programLabel=node('label','Chọn khóa học'),programSelect=node('select');programLabel.htmlFor='program-select';programSelect.id='program-select';[['dharma','Diễn đạt Phật học — 24 chủ điểm'],['verbs','Master động từ — chương trình riêng'],['translation','Dịch theo ý — Không word by word']].forEach(([id,title])=>{const o=node('option',title);o.value=id;o.selected=id===programId;programSelect.append(o);});programSelect.onchange=()=>showProgram(programSelect.value);program.append(programLabel,programSelect);pickers.append(program);
    if(programId==='translation'){
      const picker=node('div',undefined,'topic-picker'),label=node('label','Chọn gói dịch'),select=node('select');label.htmlFor='topic-select';select.id='topic-select';
      const placeholder=node('option','Chọn bất kỳ gói dịch nào…');placeholder.value='';placeholder.disabled=true;placeholder.selected=view==='catalog';select.append(placeholder);
      translation.sets.forEach((set,i)=>{const done=states[translation.id].sets[set.id]?.status==='passed',option=node('option',`${done?'✓ ':''}${set.id} — ${set.title}`);option.value=String(i);option.selected=view!=='catalog'&&i===displayed;select.append(option);});
      select.onchange=()=>openCourse(translation,Number(select.value));picker.append(label,select);pickers.append(picker);main.append(pickers);return;
    }
    const picker=node('div',undefined,'topic-picker'),label=node('label',programId==='verbs'?'Chọn bộ luyện động từ':'Chọn chủ điểm'),select=node('select');label.htmlFor='topic-select';select.id='topic-select';
    const placeholder=node('option',programId==='verbs'?'Chọn bộ nâng cao hoặc kho ôn cũ…':'Chọn bất kỳ chủ điểm nào…');placeholder.value='';placeholder.disabled=true;placeholder.selected=view==='catalog';select.append(placeholder);
    (programId==='verbs'?[verbs,verbArchive]:[...courses,legacy]).forEach(course=>{const done=P.complete(course,states[course.id]),option=node('option',`${done?'✓ ':''}${course.title}`);option.value=course.id;option.selected=view!=='catalog'&&course.id===C.id;select.append(option);});
    select.onchange=()=>{const course=allCourses.find(c=>c.id===select.value);if(course)openCourse(course);};picker.append(label,select);pickers.append(picker);main.append(pickers);
  }
  function button(text,handler,cls='secondary',key){const b=node('button',text,cls);b.type='button';if(key)b.dataset.focus=key;b.onclick=handler;return b;}
  function change(fn,key){try{fn();save();render();if(key)document.querySelector(`[data-focus="${key}"]`)?.focus({preventScroll:true});}catch(err){announce(err.message);}}
  function bookChange(fn){try{if(bookBlocked)throw Error('Dữ liệu sổ tay cũ chưa đọc được; chưa ghi đè.');fn();localStorage.setItem(X.storageKey,JSON.stringify(expressionBook));render();}catch(err){announce('Chưa lưu sổ tay: '+err.message);}}
  function goTop(){main.scrollIntoView({behavior:'auto',block:'start'});}
  function visit(target){view=target;if(target==='learn'){displayed=state.active;if(C.freeSets){E.openSet(C,state,displayed);save();}}render();goTop();}
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>visit(b.dataset.view));
  function heading(eyebrow,title,intro){main.append(node('div',eyebrow,'eyebrow'),node('h1',title,'title'));if(intro)main.append(node('p',intro,'intro'));}
  function appendTranslationPracticeNote(body){
    const section=node('section',undefined,'translation-practice-note');
    section.append(node('h3','Dịch ý và tác dụng, không dịch các chữ'),node('p','Trước mỗi câu, đừng hỏi “Câu này dịch sang tiếng Anh thế nào?” mà hãy hỏi “Trong tình huống này, người bản xứ sẽ nói gì để đạt cùng mục đích?”. Bạn dịch ý và tác dụng của câu, không dịch các chữ.'));
    section.append(node('h4','5 bước tư duy trước mỗi câu'));
    const steps=node('ol');
    [
      ['Gấp câu gốc lại','Tự hỏi “Rốt cuộc người này muốn nói gì?”, rồi diễn đạt lại bằng tiếng Việt đơn giản nhất. Bước này giúp bạn thoát khỏi mặt chữ.'],
      ['Hình dung tình huống','Ai đang nói với ai, thân mật hay trang trọng, và họ muốn than thở, xin lỗi, thuyết phục hay thông báo?'],
      ['Tìm lõi câu','Xác định ai hoặc cái gì làm gì. Hãy chọn chủ ngữ và một động từ thật đắt trước, rồi mới thêm chi tiết.'],
      ['Nói bằng tiếng Anh, không nhìn lại câu Việt','Ưu tiên những cụm từ bạn từng nghe người bản xứ dùng, thay vì tự ghép từng từ.'],
      ['Đọc to để kiểm tra','Câu có giống lời người thật nói không? Có từ nào bỏ đi mà ý vẫn đủ không? Nếu có thì cắt.']
    ].forEach(([title,text])=>{const li=node('li');li.append(node('strong',title),node('p',text));steps.append(li);});section.append(steps);
    const example=node('div',undefined,'translation-guide-example');
    example.append(node('strong','Ví dụ: đổi chủ thể, chọn cụm tự nhiên'),node('p','Câu gốc: “Dạo này công việc của tôi bận quá nên không có thời gian gặp bạn bè.”'),node('p',"Word by word: Recently my work is too busy so I don't have time to meet friends."),node('p','Ý thật: Gần đây tôi ngập đầu trong công việc, chẳng gặp được bạn bè.'),node('p',"Tự nhiên: I've been swamped at work lately and haven't had a chance to see my friends.",'guide-english'),node('p',"Ở đây, người bận là “tôi” chứ không phải “công việc”. “Dạo này” kéo dài đến hiện tại nên dùng I've been, còn “bận quá” thành swamped."));section.append(example);
    section.append(node('h4','5 chỗ cần “đổi đầu” từ Việt sang Anh'));
    const shifts=node('ul');
    [
      ['Nêu chủ đề rồi bình luận → Chủ ngữ + động từ','“Căn nhà này xây lâu rồi” → This house was built a long time ago.'],
      ['Động từ + từ bổ nghĩa → Một động từ mạnh','“Khóc nức nở” → sobbed; “đi vội vào phòng” → hurried into the room.'],
      ['Nêu bối cảnh hoặc lý do trước → Thường nêu ý chính trước','“Vì trời mưa nên tôi ở nhà” → I stayed home because of the rain.'],
      ['Không bắt buộc đánh dấu thì, số ít/nhiều, mạo từ → Bắt buộc phải chọn','“Tôi ăn rồi” → I\'ve already eaten.'],
      ['Nhiều từ lặp ý, từ đệm → Gọn, bỏ phần thừa','“Vấn đề ô nhiễm môi trường” → thường chỉ cần pollution hoặc environmental pollution.']
    ].forEach(([title,text])=>{const li=node('li');li.append(node('strong',title),node('p',text));shifts.append(li);});section.append(shifts);
    section.append(node('h4','Dịch theo chức năng'));
    const functions=node('ul');
    [
      '“Có gì đâu!” (đáp lại lời cảm ơn) → It was nothing. hoặc No problem.',
      '“Để tôi xem đã.” → Let me think about it.',
      '“Ăn cơm chưa?” (lời chào hỏi quan tâm) → How\'s it going? (nếu thật sự hỏi chuyện ăn uống thì là Have you eaten yet?).'
    ].forEach(text=>functions.append(node('li',text)));section.append(functions);
    section.append(node('h4','Cách luyện hiệu quả nhất: dịch ngược'),node('p','Cách này có sẵn “đáp án” chuẩn native để bạn tự đối chiếu:'));
    const reverse=node('ol');
    [
      'Chọn 3–5 câu tiếng Anh do người bản xứ viết, thuộc lĩnh vực bạn quan tâm.',
      'Dịch sang tiếng Việt tự nhiên.',
      'Một hai ngày sau, chỉ nhìn bản Việt và dịch lại sang tiếng Anh.',
      'So với bản gốc và tự hỏi: “Vì sao họ chọn chủ ngữ, động từ và cấu trúc đó, còn mình thì không?”',
      "Ghi lại nguyên cụm hay, không ghi từ đơn lẻ, ví dụ swamped at work, haven't had a chance to."
    ].forEach(text=>reverse.append(node('li',text)));section.append(reverse);
    section.append(node('p','Câu hỏi ở bước 4 là phần quan trọng nhất. Làm đều mỗi ngày, bạn sẽ dần tích lũy được những cách nói có sẵn để dùng ngay, thay vì phải ghép từng từ.'),node('p','Lưu ý khi áp dụng: đây là các gợi ý theo ngữ cảnh, không phải quy tắc cứng. “Gấp câu gốc lại” giúp dựng cách diễn đạt, nhưng cuối cùng vẫn phải mở lại để kiểm tra đủ nghĩa, chủ thể, phủ định, điều kiện và sắc thái. Chỉ cắt chữ thừa, không cắt ý nguồn. Với bản sách, chọn giọng văn sách phù hợp, không ép mọi câu thành khẩu ngữ.','helper'));
    body.append(section);
  }
  function appendTranslationStages(body){
    const section=node('section',undefined,'translation-practice-note');
    section.append(node('h3','3 chặng: hiểu ý → dựng lại bằng tiếng Anh → kiểm tra'),node('p','Trước khi dịch, hãy tự hỏi đúng câu hỏi của từng chặng. Mục tiêu là nói đúng chức năng, quan hệ và sắc thái của câu; không chỉ thay từng chữ Việt bằng một chữ Anh.'));
    section.append(node('h4','Chặng 1: Hiểu đúng trước khi dịch'));
    const understand=node('ol');
    [
      ['Câu này đang làm gì?','Cùng một câu có thể là lời trách sau khi việc đã xảy ra hoặc lời khuyên trước khi làm. “Anh làm thế là không được đâu” → You should not have done that. (trách sau việc đã xảy ra) / I would not do that if I were you. (khuyên trước khi làm).'],
      ['Ai nói với ai, thân hay xa?','Tiếng Việt thể hiện quan hệ qua xưng hô; tiếng Anh thường thể hiện qua cách chọn từ. “Anh ấy bị đuổi việc” → He got fired. (thân mật) / He was let go. (tế nhị) / His employment was terminated. (rất trang trọng).'],
      ['Câu đang giấu thông tin gì?','Tiếng Việt hay lược chủ ngữ, thời gian và số lượng. “Mai đi không?” có thể là Are you going tomorrow? (hỏi kế hoạch) hoặc Want to go tomorrow? (lời rủ).'],
      ['Thông tin nào là mới hoặc cần nhấn?','Tiếng Anh thường đưa thông tin quan trọng về cuối câu. “Chính Nam đã giúp tôi” → It was Nam who helped me.']
    ].forEach(([title,text])=>{const li=node('li');li.append(node('strong',title),node('p',text));understand.append(li);});section.append(understand);
    section.append(node('h4','Chặng 2: Dựng lại câu bằng 5 quyết định'));
    const build=node('ol');
    [
      ['Chọn chủ ngữ','Đừng mặc định lấy từ đầu câu Việt làm chủ ngữ. “Ở Đà Lạt, mùa này lạnh lắm” → Da Lat gets really cold this time of year. “Vì kẹt xe nên tôi đến trễ” → Traffic made me late.'],
      ['Tìm động từ thật sự','Với “có sự…”, “tiến hành…”, “đưa ra…”, hãy tìm động từ nằm bên trong: tiến hành điều tra → investigate; đưa ra quyết định → decide; công ty có sự tăng trưởng mạnh → The company grew rapidly.'],
      ['Xác định thời gian','Đừng đổi máy móc “đã” thành quá khứ, “đang” thành tiếp diễn. “Tôi sống ở Huế 5 năm” → I lived in Huế for five years. (đã chuyển đi) / I have lived in Huế for five years. (vẫn đang sống ở đó).'],
      ['Sắp xếp ý chính và ý phụ','Tiếng Việt có thể nối nhiều vế ngang nhau bằng dấu phẩy. Tiếng Anh thường rõ hơn khi có vế chính, vế phụ: “Tôi về nhà, thấy cửa mở, hoảng quá, gọi công an.” → When I got home and found the door open, I panicked and called the police.'],
      ['Dùng cụm từ quen thuộc','Mưa to → heavy rain, không phải big rain; uống thuốc → take medicine; bật đèn → turn on the light. Hãy nhớ cả cụm, không chỉ từng từ.']
    ].forEach(([title,text])=>{const li=node('li');li.append(node('strong',title),node('p',text));build.append(li);});section.append(build);
    section.append(node('h4','Chặng 3: Kiểm tra bản dịch'),node('p','Tạm quên câu tiếng Việt, đọc to câu tiếng Anh và tự hỏi: Người chưa đọc câu gốc có hiểu ngay không? Câu có giọng Việt không? Có cụm nào chỉ đang đoán không? Có lệch mức độ không? “Hơi mệt” là a bit tired, không phải exhausted. Khi chưa chắc cách dùng, tra YouGlish hoặc từ điển collocation như Ozdic.'));
    const checks=node('ul');['Dễ hiểu không?','Có giọng Việt không? Cảnh giác với very lặp nhiều, the problem of, the fact that, hoặc câu dài toàn and/so.','Có cụm nào đoán không?','Có lệch ý không? Dữ kiện, mức độ và giọng điệu vẫn phải giữ.'].forEach(text=>checks.append(node('li',text)));section.append(checks);
    const examples=node('div',undefined,'translation-guide-example');examples.append(node('strong','Hai ví dụ từ đầu đến cuối'),node('p','Trong cuộc họp: “Về vấn đề này, tôi nghĩ chúng ta cần phải xem xét lại một cách kỹ lưỡng hơn.”'),node('p','Chức năng: góp ý lịch sự, chưa muốn chốt.'),node('p','I think we should take a closer look at this.','guide-english'),node('p','Câu giàu cảm xúc: “Chị ấy cả đời chỉ biết hy sinh cho chồng con, chưa bao giờ nghĩ cho bản thân mình.”'),node('p',"She's spent her whole life putting her husband and children first, never once thinking of herself.",'guide-english'),node('p','Nếu nhân vật còn sống, dùng has spent; “chỉ biết hy sinh” tự nhiên hơn khi chuyển thành putting … first.'));section.append(examples);
    section.append(node('h4','Bảng tự hỏi trước mỗi câu'));
    const questions=node('ol');['Câu này thật ra muốn nói gì và để làm gì?','Ai nói với ai, bằng giọng nào?','Câu đang giấu thông tin gì?','Chủ ngữ nào hợp nhất?','Động từ chính là gì?','Việc xảy ra khi nào, còn liên quan đến hiện tại không?','Đâu là ý chính, đâu là ý phụ?','Người bản xứ quen dùng cụm nào ở đây?','Đọc to lên có tự nhiên và còn đúng ý không?'].forEach(text=>questions.append(node('li',text)));section.append(questions);
    section.append(node('p','Lúc đầu, hãy làm chậm với 5–10 câu mỗi ngày và viết ra câu trả lời cho từng bước. Khi đã quen, các bước này sẽ dần diễn ra rất nhanh trong đầu.','helper'));
    body.append(section);
  }
  function renderTranslationGuide(){
    if(C.programId!=='translation')return;
    const guide=node('details',undefined,'translation-guide');guide.open=guideOpen;guide.ontoggle=()=>{guideOpen=guide.open;};
    guide.append(node('summary','Cách tư duy trước khi dịch'));
    const body=node('div',undefined,'translation-guide-body');
    body.append(node('p','Hiểu điều cần diễn đạt trước, rồi mới tìm cách nói bằng tiếng Anh. Bạn chỉ cần tự hỏi trong đầu, không phải nộp phần phân tích.'));
    const steps=node('ol');
    [
      ['Câu này nói điều gì trong đoạn?','Đọc cả đoạn để biết đây là nhận xét, nguyên nhân, ví dụ, đối lập hay lời khuyên. Xác định “họ”, “điều đó”, “như vậy” đang chỉ ai hoặc ý nào.'],
      ['Lấy gì làm trục câu?','Tìm chủ thể → hành động hoặc trạng thái → đối tượng hoặc kết quả. Chủ ngữ tiếng Anh không nhất thiết là những từ đứng đầu câu Việt. Với “Thấy người có lỗi, ta không vội chê trách”, trục là: we → do not rush to blame → them; phần đầu nêu hoàn cảnh.'],
      ['Các ý liên hệ thế nào?','Nhận ra nguyên nhân, điều kiện, tương phản hoặc mục đích. Giữ đúng các nét nghĩa: chỉ, chưa, vẫn, mới; có thể, phải; dù, nếu, vì, để. “Không vội chê trách” không có nghĩa là “không bao giờ chê trách”.'],
      ['Ý này thường được nói bằng cụm nào?','Bây giờ mới nhìn các thẻ và ghép theo cụm ý, thay vì tìm từ Anh tương ứng với từng chữ Việt. “Không vội làm gì” → do not rush to do something. Chọn động từ đúng lực: giúp ≠ ép buộc; nhận ra ≠ đoán; giảm bớt ≠ xóa bỏ. Sắc bén là chọn đúng nét nghĩa, không phải luôn chọn từ mạnh hoặc hiếm nhất.'],
      ['Câu Anh tự nhiên và còn đúng ý nguồn không?','Đọc riêng câu Anh: có rõ ai làm gì, các ý nối có thuận không? Sau đó đối chiếu lại câu Việt: có bỏ sót, thêm ý, đổi chủ thể, phủ định hoặc mức độ khẳng định không? Câu nghe hay vẫn có thể dịch sai.']
    ].forEach(([title,text])=>{const item=node('li');item.append(node('strong',title),node('p',text));steps.append(item);});
    body.append(steps);
    const example=node('div',undefined,'translation-guide-example');example.append(node('strong','Ví dụ ghép theo hai đơn vị ý'),node('p','“Thấy người có lỗi, ta không vội chê trách.”'),node('p','When we see someone at fault, we do not rush to blame them.','guide-english'),node('p','Hoàn cảnh thấy lỗi → thái độ không vội chê trách. Không cần giữ nguyên thứ tự từng chữ để giữ đúng quan hệ ý.'));body.append(example);
    const linked=node('p');linked.append(node('strong','Với yêu cầu 2–3 câu: '),node('span','xác định câu sau tiếp nối, giải thích hay đối lập với câu trước, rồi chọn đại từ, từ nối và thứ tự thông tin. Đọc lại cả cụm, đừng chỉ kiểm tra từng câu riêng.'));body.append(linked);
    appendTranslationPracticeNote(body);
    appendTranslationStages(body);
    body.append(node('p','Đọc Việt → hình dung trục câu → nhìn thẻ → ghép theo cụm → đọc lại toàn ý.','translation-guide-recall'),node('p','Tự nhắc: “Tôi hiểu ý gì? Tôi lấy gì làm trục? Tôi sẽ nói ý ấy bằng cụm nào?”','helper'));
    guide.append(body);main.append(guide);
  }
  function answerArray(q,type,r){if(Array.isArray(r.responses[q.id]))return [...r.responses[q.id]];return type==='order'||type==='paragraph'?[]:q.answer.map(()=>null);}
  function choose(set,q,value,key){change(()=>E.saveResponse(C,state,set.id,q.id,value),key);}
  function reviewCard(set,q,r,card){
    const ok=E.isCorrect(q,r.responses[q.id]),hints=r.hints?.[q.id]?.length||0;card.className='question '+(ok?'question-passed':'question-failed');card.append(node('span',ok?(q.type==='compose'?(hints?`Đúng có hỗ trợ · ${hints}/3 từ gợi ý`:r.history[0]?.wrong.includes(q.id)?'Đúng sau khi xem phản hồi':'Đúng ngay không cần gợi ý'):'PASS'):'✕ CHƯA ĐẠT — CẦN LÀM LẠI',`result-label ${ok?'pass':'retry'}`));
    const feedback=node('div',undefined,'feedback');feedback.append(node('div','Bạn đã trả lời','feedback-label'),node('div',E.sequence(set,q,r.responses[q.id]),'learner-answer'));
    feedback.append(node('div',ok?'Câu đã đạt':'Một đáp án phù hợp','feedback-label'),node('div',E.sequence(set,q,q.answer),'model-answer'));
    feedback.append(node('p',q.analysis,'analysis'),node('div',`Mẫu cần nhớ · ${q.pattern}`,'pattern'));
    const en=q.sentence?q.sentence.replace('___',q.options[q.answer]):E.sequence(set,q,q.answer),vi=q.targetVietnamese||q.evidence||q.prompt;
    const chunks=q.type==='compose'?q.chunks.filter(c=>c.every(a=>q.answer.includes(a))).map(c=>c.map(a=>q.tokens[a]).join(' ')):[];
    const context={courseId:C.id,setId:set.id,itemId:q.id,en,vi,paragraph:set.context?.vietnamese||vi,source:q.source||set.context.source,analysis:q.analysis||'',chunks};
    const phrases=node('div',undefined,'phrase-save-row');phrases.append(node('p','Chọn cụm bạn muốn giữ lại để ôn:','helper'));
    for(const candidate of X.candidates(en,q.pattern||'',chunks)){const id=X.idFor(candidate.expression),saved=expressionBook.cards[id],same=saved?.contexts.some(c=>c.courseId===C.id&&c.setId===set.id&&c.itemId===q.id),b=button(same?'✓ Đã lưu: '+candidate.expression:'⭐ Lưu cụm: '+candidate.expression,()=>bookChange(()=>X.save(expressionBook,candidate,context)),'chip phrase-save');b.disabled=!!same||bookBlocked;b.setAttribute('aria-pressed',String(!!same));phrases.append(b);}feedback.append(phrases);
    const details=node('details');details.append(node('summary','Nguồn và thuật ngữ'));(q.sources||[q.source]).forEach(s=>details.append(node('div',`${s.title} · ${s.locator}`,'source-ref')));details.append(node('p','Nội dung được biên soạn theo ý Việt trong nguồn. Cách dùng từ Anh ở đây là theo ngữ cảnh, không phải đáp án dịch duy nhất.','helper'));feedback.append(details);card.append(feedback);
  }
  function contextPanel(set,review){
    if(!set.context)return null;
    const box=node('section',undefined,'context-panel');
    box.append(node('div','Ngữ cảnh nguồn','eyebrow'),node('h2',set.context.title,'context-title'));
    const vi=node('div',undefined,'context-vietnamese');set.context.vietnamese.split(/\n\n/).forEach(p=>vi.append(node('p',p)));box.append(vi);
    if(set.context.excerpted)box.append(node('p','Đoạn tuyển nguyên văn; đã lược những câu ngoài phạm vi bài.','helper'));
    if(review&&set.context.translation){const en=node('details');en.open=true;en.append(node('summary','Bản dịch tiếng Anh tham khảo'));set.context.translation.split(/\n\n/).forEach(p=>en.append(node('p',p)));en.append(node('div',`${set.context.source.title} · ${set.context.source.locator}`,'source-ref'));box.append(en);}
    else if(!review)box.append(node('p',`Đọc trọn mạch ý trước khi làm. Đáp án và phân tích mở sau khi nộp đủ ${set.items.length} ${C.programId==='translation'?'yêu cầu dịch':'câu'}.`,'helper'));
    else box.append(node('div',`${set.context.source.title} · ${set.context.source.locator}`,'source-ref'));
    return box;
  }
  function choiceUI(set,q,r,card){
    const options=node('div',undefined,'options');E.shuffled(q.options.length,q.id).forEach((j,position)=>{const key=`${q.id}-option-${j}`,b=button('',()=>choose(set,q,j,key),'option',key);b.setAttribute('aria-pressed',String(r.responses[q.id]===j));b.append(node('span',String.fromCharCode(65+position),'option-letter'),node('span',q.options[j],'option-text'));options.append(b);});card.append(options);
  }
  function orderUI(set,q,r,card){
    const selected=answerArray(q,set.type,r),built=node('div',undefined,'built-answer');built.setAttribute('aria-label','Câu bạn đang ghép');
    if(!selected.length)built.append(node('span',set.type==='paragraph'?'Bấm các câu bên dưới theo trình tự.':'Bấm các cụm bên dưới theo thứ tự.','placeholder'));
    const chosen=node('div',undefined,'chips');selected.forEach((j,position)=>{const b=button(q.tokens[j],()=>{const next=[...selected];next.splice(position,1);choose(set,q,next);},'chip');b.setAttribute('aria-label',`Bỏ mảnh ${position+1}: ${q.tokens[j]}`);chosen.append(b);});built.append(chosen);card.append(built);
    const pool=node('div',undefined,'chips');E.shuffled(q.tokens.length,q.id).forEach(j=>{if(selected.includes(j))return;const b=button(q.tokens[j],()=>choose(set,q,[...selected,j]),'chip');b.disabled=selected.length>=q.answer.length;pool.append(b);});card.append(pool,node('p',`${selected.length}/${q.answer.length} ${set.type==='paragraph'?'câu':'mảnh'} đã chọn · Bấm mảnh đã ghép để bỏ.`,'helper'));
    if(selected.length)card.append(button('Xóa riêng câu này',()=>choose(set,q,[]),'text-button'));
  }
  function composeUI(set,q,r,card){
    const value=r.responses[q.id]||q.answer.map(()=>null),hints=r.hints?.[q.id]||[],focus=wordFocus[q.id]??Math.max(0,value.findIndex(v=>v===null));
    const built=node('div',undefined,'compose-answer');built.setAttribute('role','group');built.setAttribute('aria-label','Câu bạn đang dựng');
    value.forEach((atom,i)=>{
      const locked=hints.some(h=>h.position===i),word=atom===null?'…':q.tokens[atom],startsSentence=i===0||(value[i-1]!==null&&/[.!?][”"']?$/.test(q.tokens[value[i-1]])),text=startsSentence?word.charAt(0).toUpperCase()+word.slice(1):word,key=`${q.id}-word-${i}`;
      const b=button(text,()=>{hintFlash=null;wordFocus[q.id]=i;if(atom===null)render();else change(()=>E.removeWord(C,state,set.id,q.id,i),key);},`word-slot${atom===null?' word-empty':''}${locked?' word-locked':''}${focus===i?' word-active':''}${hintFlash?.id===q.id&&hintFlash.position===i?' hint-reveal':''}`,key);
      b.disabled=locked;b.setAttribute('aria-label',`${locked?'Từ gợi ý':atom===null?'Chèn vào vị trí':'Trả xuống từ ở vị trí'} ${i+1}: ${text}`);built.append(b);
    });card.append(built);
    const pool=node('div',undefined,'chips chunk-pool');pool.setAttribute('role','group');pool.setAttribute('aria-label','Các cụm từ để chọn');
    E.shuffled(q.chunks.length,q.id).forEach(j=>{
      const atoms=q.chunks[j],available=atoms.filter(i=>!value.includes(i)),key=`${q.id}-chunk-${j}`;
      const b=button('',()=>{hintFlash=null;change(()=>{E.placeChunk(C,state,set.id,q.id,j,focus);wordFocus[q.id]=Math.max(0,r.responses[q.id].findIndex(v=>v===null));},key);},'chip chunk-card',key);
      atoms.forEach((a,k)=>b.append(node('span',q.tokens[a]+(k<atoms.length-1?' ':''),value.includes(a)?'chunk-used':'chunk-available')));
      b.disabled=!available.length||available.length>value.filter(v=>v===null).length;b.setAttribute('aria-label','Thêm cụm: '+atoms.map(i=>q.tokens[i]).join(' '));pool.append(b);
    });card.append(pool);
    const controls=node('div',undefined,'compose-controls'),hint=button(`Gợi ý · ${hints.length}/3`,()=>{change(()=>{const placed=E.hintWord(C,state,set.id,q.id);hintFlash=placed?{id:q.id,position:placed.position}:null;wordFocus[q.id]=Math.max(0,r.responses[q.id].findIndex(v=>v===null));});},'secondary hint-button');hint.disabled=hints.length>=3;
    const undo=button('Hoàn tác',()=>{hintFlash=null;change(()=>E.undoWords(C,state,set.id,q.id));},'text-button');undo.disabled=!r.undo?.[q.id]?.length;
    const reset=button('Làm lại câu này',()=>{hintFlash=null;wordFocus[q.id]=0;change(()=>E.resetWords(C,state,set.id,q.id));},'text-button');
    controls.append(hint,undo,reset);card.append(controls,node('p',`${value.filter(v=>v!==null).length}/${q.answer.length} từ đã đặt · Từ gợi ý được giữ nguyên khi làm lại.`,'helper'));
  }
  function gapsUI(set,q,r,card){
    const value=answerArray(q,set.type,r),active=gapFocus[q.id]??Math.max(0,value.findIndex(v=>v===null)),line=node('div',undefined,'gap-line');
    q.parts.forEach((part,j)=>{line.append(node('span',part));if(j>=q.answer.length)return;const key=`${q.id}-gap-${j}`,b=button(value[j]===null?`Ô ${j+1} · …`:q.options[value[j]],()=>{gapFocus[q.id]=j;render();document.querySelector(`[data-focus="${key}"]`)?.focus({preventScroll:true});},`gap-button${value[j]===null?'':' filled'}`,key);b.setAttribute('aria-pressed',String(active===j));line.append(b);});card.append(line);
    const pool=node('div',undefined,'chips');E.shuffled(q.options.length,q.id).forEach(j=>{const key=`${q.id}-fill-${j}`,b=button(q.options[j],()=>{const next=[...value];next[active]=j;const unfilled=next.findIndex(n=>n===null);gapFocus[q.id]=unfilled<0?active:unfilled;choose(set,q,next,key);},'chip',key);pool.append(b);});card.append(pool,node('p',`Đang điền ô ${active+1}. Bấm ô khác để đổi; một cụm có thể dùng nhiều lần.`,'helper'));
  }
  function matchUI(set,q,r,card){
    const value=answerArray(q,set.type,r),group=node('div',undefined,'matching');q.left.forEach((left,row)=>{const line=node('div',undefined,'match-line');line.append(node('div',left,'match-label'));const options=node('div',undefined,'chips');E.shuffled(q.options.length,q.id).forEach(j=>{const key=`${q.id}-match-${row}-${j}`,b=button(q.options[j],()=>{const next=[...value];next[row]=next[row]===j?null:j;choose(set,q,next,key);},'chip',key);b.setAttribute('aria-pressed',String(value[row]===j));b.disabled=value.some((v,k)=>k!==row&&v===j);options.append(b);});line.append(options);group.append(line);});card.append(group,node('p','Mỗi lựa chọn dùng một lần trong nhóm. Bấm lại lựa chọn đã chọn để bỏ nối.','helper'));
  }
  function renderLesson(){
    const set=C.sets[displayed],r=state.sets[set.id];if(!r){displayed=state.active;return renderLesson();}
    const review=r.status!=='answer',isCurrent=displayed===state.active,indices=(r.status==='passed'?set.items.map(q=>q.id):r.round).map(id=>set.items.findIndex(q=>q.id===id)),missing=E.missing(set,r),completed=indices.length-missing.length;
    heading(`${C.programId==='verbs'||C.programId==='translation'?C.title:C.weekId?`Chủ điểm ${C.week} · ${C.subtitle}`:'Bản tổng hợp v1'} · Gói ${displayed+1}/${C.sets.length}`,set.title,set.instruction);
    if(C.targets)main.append(node('p',`Cụm của chủ điểm: ${C.targets.join(' · ')}`,'helper'));
    const meta=node('div',undefined,'meta-row');meta.append(node('span',review?(r.status==='passed'?'PASS · Cả bộ đã đạt':'Đã nộp · Cần sửa lại'):`${completed}/${indices.length} câu đã trả lời`,'pill'),node('span',review?`Lượt nộp ${r.history.length}`:'Đáp án đang khóa','helper'));main.append(meta);
    const track=node('div',undefined,'progress-track');track.setAttribute('role','progressbar');track.setAttribute('aria-label','Tiến độ bộ hiện tại');track.setAttribute('aria-valuenow',String(completed));track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(indices.length));const fill=node('div',undefined,'progress-fill');fill.style.width=`${100*completed/indices.length}%`;track.append(fill);main.append(track);
    if(C.freeSets){const picker=node('div',undefined,'packet-picker'),label=node('label','Chọn gói theo đoạn — học theo thứ tự bạn muốn'),select=node('select');label.htmlFor='packet-select';select.id='packet-select';C.sets.forEach((b,i)=>{const done=state.sets[b.id]?.status==='passed',opt=node('option',`${done?'✓ ':''}${i+1}. ${b.title} — ${packetStatus(state.sets[b.id])}`);opt.value=String(i);opt.selected=i===displayed;select.append(opt);});select.onchange=()=>openPacket(Number(select.value));picker.append(label,select);main.append(picker);}
    if(C.sets.length<=24){const route=node('nav',undefined,'set-route');route.setAttribute('aria-label','Các gói bài');C.sets.forEach((b,i)=>{const rec=state.sets[b.id],done=rec?.status==='passed',link=button(done?'✓ '+(i+1):rec?.visited?'• '+(i+1):String(i+1),()=>openPacket(i),`set-number${i===displayed?' active':''}${done?' done':''}`);link.disabled=!C.freeSets&&i>state.active;link.setAttribute('aria-label',`Gói ${i+1}: ${b.title} — ${packetStatus(rec)}`);if(i===displayed)link.setAttribute('aria-current','step');route.append(link);});main.append(route);}
    if(r.status!=='passed'&&r.round.length<set.items.length)main.append(node('div',`Còn ${r.round.length} câu cần làm. Các câu đã PASS từ trước được giữ nguyên, không phải làm lại.`,'notice'));
    if(displayed<state.active)main.append(node('div','Bạn đang xem lại bộ đã hoàn thành.','notice'));
    const context=contextPanel(set,review);if(context)main.append(context);
    const list=node('div',undefined,'question-list');indices.forEach(i=>{const q=set.items[i],card=node('section',undefined,'question');card.id=q.id.replace('.','-');card.setAttribute('aria-labelledby',`${card.id}-title`);const head=node('div',undefined,'question-head');head.append(node('span',C.programId==='translation'?`Yêu cầu ${i+1} / ${set.items.length} · ${q.sourceSentenceCount} câu nguồn`:`Câu ${i+1} / ${set.items.length}`),node('span',q.difficulty?.startsWith('advanced-contextual')?'Phân biệt sắc thái nâng cao':C.programId==='verbs'?'Ôn động từ cơ bản':q.topic,'topic'));const title=node('h2',q.prompt,'question-title');title.id=`${card.id}-title`;card.append(head,title);if(q.original)card.append(node('div',`Bản dịch cần sửa: ${q.original}`,'original'));
      const type=q.type||set.type;if(!review&&r.history.at(-1)?.wrong.includes(q.id)){card.className='question question-needs-retry';card.append(node('div','CHƯA ĐẠT · Đang làm lại câu này','retry-banner'));}if(review)reviewCard(set,q,r,card);else if(type==='compose')composeUI(set,q,r,card);else if(type==='choice')choiceUI(set,q,r,card);else if(type==='gaps')gapsUI(set,q,r,card);else if(type==='match')matchUI(set,q,r,card);else orderUI(set,q,r,card);list.append(card);});main.append(list);
    const submit=node('div',undefined,'submit-bar'),message=node('span',undefined,'submit-status'),actions=node('div',undefined,'button-group');message.setAttribute('aria-live','polite');
    if(!review){message.textContent=missing.length?`Còn ${missing.length} câu chưa xong. Bạn có thể sửa lựa chọn trước khi nộp.`:'Đã đủ câu — sẵn sàng nộp cả bộ.';const b=button('Nộp cả bộ →',()=>{change(()=>E.submit(C,state));goTop();},'primary');b.disabled=missing.length>0;actions.append(b);}
    else if(!isCurrent){message.textContent='Xem lại đáp án và phân tích.';actions.append(button('Trở về bộ đang học',()=>{displayed=state.active;render();goTop();},'primary'));}
    else if(r.status==='review'){message.textContent=`${r.history.at(-1).wrong.length} câu cần làm lại.${C.freeSets?' Bạn vẫn có thể chọn gói khác.':' Bộ tiếp theo vẫn khóa.'}`;actions.append(button('Làm lại câu chưa đạt',()=>{change(()=>E.retry(C,state));goTop();},'primary'));}
    else if(displayed<C.sets.length-1){message.textContent='Đã PASS. Mở bộ tiếp theo khi bạn sẵn sàng.';actions.append(button('Bộ tiếp theo →',()=>{change(()=>{E.advance(C,state);displayed=state.active;gapFocus={};});goTop();},'primary'));}
    else{message.textContent=P.complete(C,state)?`Hoàn thành ${C.weekId?`chủ điểm ${C.week}`:C.title}. Sổ tay đã sẵn sàng.`:`Gói này đã hoàn thành. Đã xong ${E.statistics(C,state).completedSets}/${C.sets.length} gói.`;actions.append(button('Mở sổ tay bài học',()=>visit('notes'),'primary'),button('Tải Markdown',()=>downloadNote()));const next=courses[C.week];if(C.weekId&&next)actions.append(button('Chủ điểm tiếp theo →',()=>openCourse(next)));else actions.append(button('Chọn gói khác',()=>visit('catalog')));}
    if(r.history.length||r.status==='passed')actions.append(button('Học lại bộ này',()=>{if(window.confirm(`Xóa tiến độ của ${set.id} và học lại bộ này từ đầu? Các bộ khác không bị ảnh hưởng.`))change(()=>{E.resetSet(C,state,set.id);displayed=state.active;gapFocus={};wordFocus={};});},'text-button'));
    if(C.freeSets&&displayed<C.sets.length-1&&r.status!=='passed')actions.append(button('Sang gói khác →',()=>openPacket(displayed+1)));
    submit.append(message,actions);main.append(submit);
  }
  function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function downloadNote(){download(`PQ-English-${C.weekId||C.id}.md`,E.markdown(C,state),'text/markdown;charset=utf-8');}
  const phraseStatuses={saved:'Đã lưu',learning:'Đang luyện','needs-review':'Cần ôn lại',mastered:'Vững trong bài ôn'};
  const reviewKinds=[['r','Gọi lại từ ý Việt'],['n','Phân biệt sắc thái'],['o','Ghép câu mới'],['e','Sửa dịch sát chữ'],['source','Ôn câu nguồn']];
  function renderExpressions(){
    const cards=Object.values(expressionBook.cards),day=X.today();heading('Sổ tay cá nhân','Cụm đã lưu',`${cards.length} cụm · ${X.due(expressionBook,day).length} cụm đến lượt ôn. Lưu là bước đầu, chưa đồng nghĩa đã dùng vững.`);
    const actions=node('div',undefined,'button-group');actions.append(button('Mở Ôn hôm nay',()=>visit('expression-review'),'primary'),button('Tải cụm từ Markdown',()=>download('PQ-English-expressions.md',X.markdown(expressionBook),'text/markdown;charset=utf-8')));main.append(actions);
    const filters=node('div',undefined,'phrase-filters');for(const [value,label]of [['all','Tất cả'],['due','Đến lượt'],...Object.entries(phraseStatuses)]){const b=button(label,()=>{bookFilter=value;render();},'chip');b.setAttribute('aria-pressed',String(bookFilter===value));filters.append(b);}main.append(filters);
    if(!cards.length){main.append(node('p','Sau khi nộp một gói, bấm ⭐ Lưu cụm dưới đáp án. Bạn chỉ chọn những cụm thực sự muốn dùng, không cần gõ.','empty-state'));return;}
    const visible=cards.filter(c=>bookFilter==='all'||(bookFilter==='due'?c.due<=day:X.status(c)===bookFilter));
    if(!visible.length)main.append(node('p','Chưa có cụm trong nhóm này.','empty-state'));
    for(const c of visible){const card=node('section',undefined,'note-section phrase-card');card.append(node('div',`${phraseStatuses[X.status(c)]} · Ôn tiếp: ${c.due}${c.due<=day?' · Đến lượt':''}`,'eyebrow'),node('h2',c.expression),node('p',c.meaning||'Chưa có chú giải riêng cho cụm; xem ý Việt của cả câu bên dưới.'),node('p','Khung dùng: '+c.frame,'pattern'));
      card.append(node('p',c.contexts[0].en,'model-answer'),node('p','Ý Việt của câu: '+c.contexts[0].vi));
      const count=c.curatedId&&window.PQExpressionBank.some(e=>e.id===c.curatedId);card.append(node('p',count?'Có 4 bài vận dụng trong ngữ cảnh đời sống mới.':'Hiện ôn bằng câu nguồn. Chưa có bài ngữ cảnh mới cho cụm này, nên chưa đánh dấu dùng vững.','helper'));
      const contexts=node('details');contexts.append(node('summary',`Xem ngữ cảnh và nguồn (${c.contexts.length})`));for(const ref of c.contexts){contexts.append(node('p',ref.paragraph),node('p',ref.en,'guide-english'),node('p',ref.analysis),node('div',`${ref.source.title} · ${ref.source.locator} · ${ref.setId}/${ref.itemId}`,'source-ref'));const course=allCourses.find(c=>c.id===ref.courseId),index=course?.sets.findIndex(s=>s.id===ref.setId);if(index>=0)contexts.append(button('Xem gói '+ref.setId,()=>openCourse(course,index)));}card.append(contexts);main.append(card);
    }
  }
  function renderExpressionReview(){
    const day=X.today(),session=expressionBook.session;
    heading('Ôn cá nhân','Ôn hôm nay',`${X.due(expressionBook,day).length} cụm đến lượt · Lịch khởi điểm 1–3–7–14–30 ngày, điều chỉnh theo kết quả. Chỉ nhắc khi bạn mở web; không có thông báo ngoài trình duyệt.`);
    if(!session){
      main.append(node('p','Mỗi lượt một dạng, tối đa 7 câu; có từ 5 cụm phù hợp sẽ hiện 5–7 câu. Khi mới lưu ít cụm, lượt ôn sẽ ngắn hơn. Nộp đủ lượt mới mở đáp án.','notice'));
      const actions=node('div',undefined,'button-group');actions.append(button(reviewEarly?'✓ Đang cho luyện trước lịch':'Luyện thêm dù chưa đến lịch',()=>{reviewEarly=!reviewEarly;render();}));main.append(actions);
      for(const [kind,label]of reviewKinds){const n=X.eligible(expressionBook,kind,day,reviewEarly).length,b=button(`${label} · ${n} cụm`,()=>bookChange(()=>X.start(expressionBook,kind,day,reviewEarly)),'primary');b.disabled=!n||bookBlocked;const row=node('div',undefined,'phrase-mode');row.append(b);main.append(row);}
      main.append(node('p',`Bài ngữ cảnh mới hiện có cho ${window.PQExpressionBank.length} cụm, tổng ${window.PQExpressionBank.length*4} bài do chương trình biên soạn. Đây không phải trích dẫn mới từ sách. Các cụm còn lại vẫn lưu đầy đủ và ôn bằng câu nguồn.`,'helper'),button('Về Cụm đã lưu',()=>visit('expressions')));return;
    }
    const qs=X.tasks(expressionBook),review=session.status!=='answer';
    main.append(node('h2',`${reviewKinds.find(k=>k[0]===session.kind)[1]} · ${qs.length} câu`,'exercise-group-title'),node('p',session.kind==='source'?'Nhớ lại câu đã học. Kết quả này không tự chứng minh dùng được trong ngữ cảnh mới.':'Tình huống đời sống mới, không phải câu trích nguồn đã học.','helper'));
    qs.forEach((q,i)=>{const card=node('section',undefined,'question phrase-question');card.append(node('div',`Câu ${i+1}/${qs.length}`,'question-head'),node('h2',q.vi,'question-title'),node('p',q.prompt,'helper'));if(q.frame)card.append(node('p',q.frame,'original'));if(q.original)card.append(node('p','Bản dịch cần sửa: '+q.original,'original'));
      const value=session.responses[q.id];
      if(review){const result=session.history.at(-1).find(r=>r.cardId===q.id);card.className='question phrase-question '+(result.correct?'question-passed':'question-failed');card.append(node('div',result.correct?'Đã đạt'+(result.assisted?' · Có gợi ý':''):'✕ CHƯA ĐẠT — CẦN LÀM LẠI','result-label '+(result.correct?'pass':'retry')),node('div','Bạn đã trả lời','feedback-label'),node('p',X.answerText(q,value),'learner-answer'),node('div','Một đáp án phù hợp','feedback-label'),node('p',q.english,'model-answer'),node('p',q.analysis,'analysis'),node('p',expressionBook.cards[q.id].expression,'pattern'));}
      else{
        if(session.history.at(-1)?.some(r=>r.cardId===q.id&&!r.correct)){card.className='question phrase-question question-needs-retry';card.append(node('div','CHƯA ĐẠT · Đang làm lại','retry-banner'));}
        if(q.type==='choice'){const options=node('div',undefined,'options');E.shuffled(q.options.length,q.id+session.day+q.kind).forEach((j,k)=>{const b=button(String.fromCharCode(65+k)+'. '+q.options[j],()=>bookChange(()=>X.respond(expressionBook,q.id,j)),'option');b.setAttribute('aria-pressed',String(value===j));options.append(b);});card.append(options);}
        else{const chosen=value||[],built=node('div',undefined,'built-answer');if(!chosen.length)built.append(node('span','Bấm các cụm bên dưới để dựng câu.','placeholder'));chosen.forEach((j,k)=>built.append(button(q.tokens[j],()=>bookChange(()=>X.respond(expressionBook,q.id,chosen.filter((_,i)=>i!==k))),'chip')));const pool=node('div',undefined,'chips');E.shuffled(q.tokens.length,q.id+session.day).forEach(j=>{if(chosen.includes(j))return;const b=button(q.tokens[j],()=>bookChange(()=>X.respond(expressionBook,q.id,[...chosen,j])),'chip');b.disabled=chosen.length>=q.answer.length;pool.append(b);});card.append(built,pool,button('Làm lại câu ôn này',()=>bookChange(()=>X.respond(expressionBook,q.id,[])),'text-button'));}
        if(session.hints[q.id]){const c=expressionBook.cards[q.id];card.append(node('p',c.expression+' · '+(c.meaning||c.frame),'notice'));}else card.append(button('Gợi ý cụm · tính là có hỗ trợ',()=>bookChange(()=>X.hint(expressionBook,q.id)),'text-button'));
      }main.append(card);
    });
    const bar=node('div',undefined,'submit-bar');
    if(!review){const submit=button('Nộp lượt ôn →',()=>{bookChange(()=>X.submit(expressionBook));goTop();},'primary');submit.disabled=qs.some(q=>!X.isComplete(q,session.responses[q.id]));bar.append(submit);}
    else if(session.status==='review')bar.append(button('Làm lại cụm chưa đạt',()=>{bookChange(()=>X.retry(expressionBook));goTop();},'primary'));
    else bar.append(button('Kết thúc lượt ôn',()=>{bookChange(()=>X.finish(expressionBook));goTop();},'primary'));
    bar.append(button('Về Cụm đã lưu',()=>visit('expressions')));main.append(bar,node('p','Lượt trả lời đầu quyết định lịch ôn. Sửa sau khi xem đáp án không được tính là nhớ độc lập. “Vững trong bài ôn” cần đúng không gợi ý ở ít nhất 3 bài mới khác nhau trên 3 ngày khác nhau; không có nghĩa đã thành thạo hoàn toàn ngoài đời.','helper'));
  }
  function renderNotes(){
    const stats=E.statistics(C,state);heading(C.title,'Những điều đã làm chủ','Ghi chú riêng cho bộ đang chọn, tạo từ những câu đã PASS. Mỗi khóa có tiến độ và sổ tay riêng. Tải Markdown để lưu trên máy.');
    if(C.programId==='translation')main.append(node('p',`Đúng ngay không gợi ý: ${stats.independentPassed} · Có gợi ý: ${stats.assistedPassed} · Sau phản hồi: ${stats.afterReviewPassed}. Đây là bài dịch có thẻ hỗ trợ, chưa thay thế tự viết hoàn toàn.`,'notice'));
    const controls=node('div',undefined,'button-group');controls.append(button('Tải ghi chú Markdown',downloadNote,'primary'));main.append(controls);
    if(!stats.passed){main.append(node('div','Sau khi bạn nộp và PASS các câu đầu tiên, các mẫu câu và phân tích quan trọng sẽ xuất hiện ở đây.','empty-state'));return;}
    const core=node('section',undefined,'note-section');core.append(node('h2','Bốn thói quen diễn đạt'));const habits=node('ul');['Đọc toàn đoạn trước khi quyết định nghĩa từ.','Chọn chủ ngữ và động từ trung tâm trước các phần bổ nghĩa.','Giữ đúng điều kiện, phạm vi và độ chắc chắn của ý nguồn.','Nối ý bằng quan hệ hợp lý và đại từ quy chiếu rõ.'].forEach(v=>habits.append(node('li',v)));core.append(habits);main.append(core);
    C.sets.forEach(set=>{const r=state.sets[set.id];if(!r?.passedItems.length)return;const section=node('section',undefined,'note-section');section.append(node('h2',`${set.id} · ${set.title}`));set.items.filter(q=>r.passedItems.includes(q.id)).forEach(q=>{const details=node('details');details.append(node('summary',`${q.topic} · ${q.pattern}`),node('p',E.sequence(set,q,q.answer)),node('p',q.analysis,'analysis'),node('div',q.source.locator,'source-ref'));section.append(details);});main.append(section);});
  }
  function renderProgress(){
    const stats=E.statistics(C,state);heading(C.title,'Học tiếp từ đúng chỗ','Khóa 24 chủ điểm, Master động từ, Dịch theo ý và các bộ ôn cũ có dữ liệu độc lập. Sao lưu JSON giữ chúng cùng nhau để chuyển máy.');
    if(C.programId==='translation')main.append(node('p',`Đúng ngay không gợi ý: ${stats.independentPassed} · Có gợi ý: ${stats.assistedPassed} · Sau phản hồi: ${stats.afterReviewPassed}. Giới hạn gợi ý được giữ khi tải lại hoặc đổi gói.`,'notice'));
    const metrics=node('div',undefined,'stats');[[`${stats.passed}/${stats.total}`,'Câu đã PASS'],[`${stats.completedSets}/${C.sets.length}`,'Bộ đã hoàn thành'],[stats.firstTotal?`${Math.round(100*stats.firstCorrect/stats.firstTotal)}%`:'—','Đúng ở lượt nộp đầu']].forEach(([value,label])=>{const stat=node('div',undefined,'stat');stat.append(node('strong',value),node('span',label));metrics.append(stat);});main.append(metrics);
    const tools=node('div',undefined,'button-group');tools.append(button('Tải sao lưu JSON',()=>download('PQ-English-project-v2.backup.json',JSON.stringify(P.exportProject(allCourses,states,C.id,bookBlocked?undefined:expressionBook),null,2),'application/json'),'primary'),button('Khôi phục từ JSON',()=>document.getElementById('backup-file').click()),button('Tải sổ tay Markdown',downloadNote));main.append(tools,node('p','Không có đồng bộ tài khoản tự động. Xóa dữ liệu trình duyệt có thể xóa tiến độ; bản sao lưu giúp khôi phục. Câu trả lời của bạn không được gửi lên GitHub.','helper'));
    const section=node('section',undefined,'progress-section');section.append(node('h2',C.title));const list=node('ol',undefined,'progress-list');C.sets.forEach((set,i)=>{const r=state.sets[set.id],row=node('li'),name=node('div',`${i+1}. ${set.title}`,'progress-name');name.append(node('small',`${set.items.length} câu · ${packetStatus(r)} · ${r?.passedItems.length||0}/${set.items.length} câu đã PASS`));const b=button(r?.status==='passed'?'Xem lại':'Mở gói',()=>{view='learn';openPacket(i);});b.disabled=!C.freeSets&&i>state.active;row.append(name,b);list.append(row);});section.append(list);main.append(section);
    const info=node('section',undefined,'progress-section');info.append(node('h2','Về các chương trình'),node('p',`Diễn đạt Phật học giữ 1.440 câu gốc trong 24 chủ điểm. Master động từ có 300 gói nâng cao, tổng 1.512 câu: 72 câu chuyên sâu đã biên soạn và 1.440 câu mới từ các bản dịch/ngữ cảnh nguồn. Bộ 1.440 câu động từ cũ vẫn có trong mục ôn cơ bản. Dịch theo ý có ${translation.sets.length} gói/${translationTotal} yêu cầu, mỗi yêu cầu dịch 1–3 câu nguồn từ đoạn văn trọn ý; tối đa 3 từ gợi ý mỗi yêu cầu, không trộn tiến độ với hai khóa cũ.`),node('p','Mở gói tùy ý. Nộp đủ câu của gói mới mở phân tích; đổi khóa hoặc gói không mất đáp án. Độ khó mới chưa được hiệu chuẩn bằng kết quả học của nhiều người.'));main.append(info);
  }
  function restoreProject(restored){
    const writes=Object.entries(restored.progress).map(([id,value])=>[P.key(allCourses.find(c=>c.id===id)),JSON.stringify(value)]);
    if(Object.hasOwn(restored,'expressions'))writes.push([X.storageKey,JSON.stringify(restored.expressions)]);
    const previous=writes.map(([key])=>[key,localStorage.getItem(key)]);
    try{for(const [key,value]of writes)localStorage.setItem(key,value);}catch(err){for(const [key,value]of previous){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch(rollbackError){}}throw Error('Không đủ chỗ để khôi phục đầy đủ. Hãy giữ file sao lưu; chưa đổi dữ liệu đang học trong bộ nhớ.');}
    for(const [id,progress]of Object.entries(restored.progress)){states[id]=progress;blocked.delete(id);}
    if(Object.hasOwn(restored,'expressions')){expressionBook=restored.expressions;bookBlocked=false;}
  }
  document.getElementById('backup-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>20*1024*1024)throw Error('File sao lưu quá lớn. Hãy chọn JSON xuất từ trang này.');const restored=P.validateBackup(allCourses,JSON.parse(await file.text()));if(!window.confirm('Khôi phục sẽ thay tiến độ và sổ tay cụm từ có trong bản sao lưu. File cũ không có cụm từ sẽ giữ sổ tay hiện tại. Tiếp tục?'))return;restoreProject(restored);C=allCourses.find(c=>c.id===restored.selected);state=states[C.id];displayed=state.active;gapFocus={};view='learn';announce('');save();render();goTop();}catch(err){announce(`Chưa khôi phục: ${err.message}`);}finally{event.target.value='';}
  });
  window.addEventListener('storage',event=>{if(event.key===X.storageKey){if(!event.newValue){announce('Sổ tay ở tab khác đã thay đổi hoặc bị xóa; bản đang mở vẫn được giữ. Hãy tải sao lưu.');return;}try{expressionBook=X.validate(JSON.parse(event.newValue));bookBlocked=false;render();}catch(err){announce('Sổ tay ở tab khác chưa đọc được; dữ liệu đang mở được giữ nguyên.');}return;}const course=allCourses.find(c=>P.key(c)===event.key);if(!course||!event.newValue)return;try{states[course.id]=E.validate(course,JSON.parse(event.newValue));if(course.id===C.id){state=states[C.id];displayed=state.active;}render();}catch(err){announce('Tiến độ ở tab khác chưa đọc được. Hãy tải sao lưu trước khi đóng trang.');}});
  function renderCatalog(){
    heading('PQ English','Ba chương trình độc lập','Chọn mục tiêu hôm nay. Bạn được chọn bất kỳ chủ điểm hoặc gói nào; tiến độ và sổ tay của từng chương trình được lưu riêng.');
    for(const [id,title,description]of [['dharma','Diễn đạt Phật học — 24 chủ điểm','1.440 câu gốc · 288 đoạn · mỗi gói 5 câu. Luyện cấu trúc, nối ý, điền từ, sắp xếp và sửa bản dịch.'],['verbs','Master động từ — Vận dụng nâng cao','1.512 câu nâng cao · 300 gói. Trong đó có 1.440 câu mới viết từ ngữ cảnh nguồn và 72 câu chuyên sâu.'],['translation','Dịch theo ý — Không word by word',`${translationTotal} bài dịch · ${translation.sets.length} ngữ cảnh đầy đủ · mỗi yêu cầu 1–3 câu nguồn. Ghép cụm, sửa dịch sát chữ, đổi trục và nối ý.`]]){const card=node('section',undefined,'catalog-card'),handler=()=>{showProgram(id);if(id==='translation')setTimeout(()=>document.getElementById('translation-packet-scroll')?.scrollIntoView({behavior:'smooth',block:'start'}),0);};card.append(node('h2',title),node('p',description),button(id==='translation'?'Chọn gói dịch':id==='verbs'?'Chọn gói động từ':'Chọn chủ điểm Phật học',handler,'primary'));main.append(card);}
    if(C.programId==='translation'){
      main.append(node('h2','Các gói dịch theo ý','catalog-phase'),node('p','Mỗi gói có 5 yêu cầu cùng dạng, gồm cả đơn vị 2–3 câu liền nhau. Đọc trọn đoạn đạo lý rồi dựng câu Anh theo ý; không cần gõ.','intro'));
      const scroll=node('div',undefined,'translation-packet-scroll');scroll.id='translation-packet-scroll';scroll.setAttribute('aria-label','Danh sách cuộn các gói dịch');
      translation.sets.forEach((set,i)=>{const card=node('section',undefined,'catalog-card'),r=states[translation.id].sets[set.id];card.append(node('div',`${set.id} · ${set.mode} · ${packetStatus(r)}`,'eyebrow'),node('h3',set.title,'catalog-title'),node('p',set.context.source.title+' · 5 yêu cầu · dịch 1–3 câu mỗi lượt','helper'),button(r?.status==='passed'?'Xem gói dịch':'Mở gói dịch',()=>openCourse(translation,i),'primary'));scroll.append(card);});main.append(scroll);return;
    }
    if(C.programId==='verbs'){
      main.append(node('h2','Các gói động từ nâng cao','catalog-phase'));
      verbs.sets.forEach((set,i)=>{const card=node('section',undefined,'catalog-card'),r=states[verbs.id].sets[set.id];card.append(node('div',`${set.id} · ${set.items.length} câu · ${packetStatus(r)}`,'eyebrow'),node('h3',set.title,'catalog-title'),node('p',`Ngữ cảnh: ${set.context.title}`,'helper'),button(r?.status==='passed'?'Xem lại':'Mở gói này',()=>openCourse(verbs,i),'primary'));main.append(card);});
      const old=node('section',undefined,'note-section');old.append(node('h2','Bộ ôn động từ cơ bản — giữ từ bản trước'),node('p','1.440 câu cũ được giữ nguyên cùng tiến độ hợp lệ. Đây không phải bộ nâng cao mới.'),button('Mở kho ôn cơ bản',()=>openCourse(verbArchive)));main.append(old);return;
    }
    const done=courses.filter(c=>P.complete(c,states[c.id])).length;main.append(node('h2','Các chủ điểm Phật học','catalog-phase'),node('span',`${done}/24 chủ điểm đã hoàn thành · 1.440 câu gốc · 288 gói`,'pill'));
    let phase='';courses.forEach(course=>{if(course.phase!==phase){phase=course.phase;main.append(node('h2',phase,'catalog-phase'));}const card=node('section',undefined,'catalog-card'),status=P.complete(course,states[course.id]),stats=E.statistics(course,states[course.id]);card.append(node('div',`CHỦ ĐIỂM ${String(course.week).padStart(2,'0')} · ${course.subtitle}`,'eyebrow'),node('h3',course.title.replace(/^Chủ điểm \d+ — /,''),'catalog-title'),node('p',course.targets.join(' · '),'catalog-targets'));const actions=node('div',undefined,'meta-row');actions.append(node('span',`${stats.completedSets}/12 gói hoàn thành · 60 câu`,'helper'));const b=button(status?'Xem lại':'Chọn gói để học',()=>openCourse(course),'primary');actions.append(b);card.append(actions);main.append(card);});
    const old=node('section',undefined,'note-section');old.append(node('h2','Bản học tổng hợp v1'),node('p','72 câu của bản cũ được giữ riêng cùng tiến độ cũ. Bản này không tính thành chủ điểm 1 của chương trình mới.'));old.append(button('Mở bản cũ và tiến độ',()=>openCourse(legacy)));main.append(old);
  }
  function render(){main.replaceChildren();renderTopicPicker();renderTranslationGuide();document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view==='expression-review')b.textContent='Ôn hôm nay'+(X.due(expressionBook).length?' ('+X.due(expressionBook).length+')':'');if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(view==='catalog')renderCatalog();else if(view==='expressions')renderExpressions();else if(view==='expression-review')renderExpressionReview();else if(view==='notes')renderNotes();else if(view==='progress')renderProgress();else renderLesson();}
  render();
})();
