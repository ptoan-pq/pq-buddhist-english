(function () {
  'use strict';
  const E=window.PQEngine,P=window.PQProject,courses=window.PQContextCourses||window.PQCourses,verbs=window.PQVerbCourse,verbArchive=window.PQVerbArchive,translation=window.PQTranslationCourse,legacy=window.PQCourse,allCourses=[...courses,verbs,verbArchive,translation,legacy],states={},blocked=new Set(),SELECTED='pq-english-selected-v3';
  let selected;try{selected=localStorage.getItem(SELECTED);}catch(err){}
  let C=allCourses.find(c=>c.id===selected)||courses[0];
  const requested=window.location?.hash?.slice(1);if(requested==='translation')C=translation;else if(requested==='verbs')C=verbs;else if(requested==='dharma')C=courses[0];
  const main=document.getElementById('main'),warning=document.getElementById('storage-warning');
  let state=E.create(C),view='catalog',displayed=0,gapFocus={},wordFocus={},hintFlash=null,guideOpen=false;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  function announce(message){warning.textContent=message;warning.hidden=!message;}
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
    const pickers=node('div',undefined,'course-pickers'),programId=C.programId||'dharma',program=node('div',undefined,'topic-picker'),programLabel=node('label','Chọn khóa học'),programSelect=node('select');programLabel.htmlFor='program-select';programSelect.id='program-select';[['dharma','Diễn đạt Phật học — 24 chủ điểm'],['verbs','Master động từ — chương trình riêng'],['translation','Dịch theo ý — Không word by word']].forEach(([id,title])=>{const o=node('option',title);o.value=id;o.selected=id===programId;programSelect.append(o);});programSelect.onchange=()=>showProgram(programSelect.value);program.append(programLabel,programSelect);pickers.append(program);
    if(programId==='translation'){main.append(pickers);return;}
    const picker=node('div',undefined,'topic-picker'),label=node('label',programId==='verbs'?'Chọn bộ luyện động từ':'Chọn chủ điểm'),select=node('select');label.htmlFor='topic-select';select.id='topic-select';
    const placeholder=node('option',programId==='verbs'?'Chọn bộ nâng cao hoặc kho ôn cũ…':'Chọn bất kỳ chủ điểm nào…');placeholder.value='';placeholder.disabled=true;placeholder.selected=view==='catalog';select.append(placeholder);
    (programId==='verbs'?[verbs,verbArchive]:[...courses,legacy]).forEach(course=>{const option=node('option',course.title);option.value=course.id;option.selected=view!=='catalog'&&course.id===C.id;select.append(option);});
    select.onchange=()=>{const course=allCourses.find(c=>c.id===select.value);if(course)openCourse(course);};picker.append(label,select);pickers.append(picker);main.append(pickers);
  }
  function button(text,handler,cls='secondary',key){const b=node('button',text,cls);b.type='button';if(key)b.dataset.focus=key;b.onclick=handler;return b;}
  function change(fn,key){try{fn();save();render();if(key)document.querySelector(`[data-focus="${key}"]`)?.focus({preventScroll:true});}catch(err){announce(err.message);}}
  function goTop(){main.scrollIntoView({behavior:'auto',block:'start'});}
  function visit(target){view=target;if(target==='learn'){displayed=state.active;if(C.freeSets){E.openSet(C,state,displayed);save();}}render();goTop();}
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>visit(b.dataset.view));
  function heading(eyebrow,title,intro){main.append(node('div',eyebrow,'eyebrow'),node('h1',title,'title'));if(intro)main.append(node('p',intro,'intro'));}
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
    if(C.freeSets){const picker=node('div',undefined,'packet-picker'),label=node('label','Chọn gói theo đoạn — học theo thứ tự bạn muốn'),select=node('select');label.htmlFor='packet-select';select.id='packet-select';C.sets.forEach((b,i)=>{const opt=node('option',`${i+1}. ${b.title} — ${packetStatus(state.sets[b.id])}`);opt.value=String(i);opt.selected=i===displayed;select.append(opt);});select.onchange=()=>openPacket(Number(select.value));picker.append(label,select);main.append(picker);}
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
    if(C.freeSets&&displayed<C.sets.length-1&&r.status!=='passed')actions.append(button('Sang gói khác →',()=>openPacket(displayed+1)));
    submit.append(message,actions);main.append(submit);
  }
  function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function downloadNote(){download(`PQ-English-${C.weekId||C.id}.md`,E.markdown(C,state),'text/markdown;charset=utf-8');}
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
    const tools=node('div',undefined,'button-group');tools.append(button('Tải sao lưu JSON',()=>download('PQ-English-project-v2.backup.json',JSON.stringify(P.exportProject(allCourses,states,C.id),null,2),'application/json'),'primary'),button('Khôi phục từ JSON',()=>document.getElementById('backup-file').click()),button('Tải sổ tay Markdown',downloadNote));main.append(tools,node('p','Không có đồng bộ tài khoản tự động. Xóa dữ liệu trình duyệt có thể xóa tiến độ; bản sao lưu giúp khôi phục. Câu trả lời của bạn không được gửi lên GitHub.','helper'));
    const section=node('section',undefined,'progress-section');section.append(node('h2',C.title));const list=node('ol',undefined,'progress-list');C.sets.forEach((set,i)=>{const r=state.sets[set.id],row=node('li'),name=node('div',`${i+1}. ${set.title}`,'progress-name');name.append(node('small',`${set.items.length} câu · ${packetStatus(r)} · ${r?.passedItems.length||0}/${set.items.length} câu đã PASS`));const b=button(r?.status==='passed'?'Xem lại':'Mở gói',()=>{view='learn';openPacket(i);});b.disabled=!C.freeSets&&i>state.active;row.append(name,b);list.append(row);});section.append(list);main.append(section);
    const info=node('section',undefined,'progress-section');info.append(node('h2','Về các chương trình'),node('p','Diễn đạt Phật học giữ 1.440 câu gốc trong 24 chủ điểm. Master động từ có 300 gói nâng cao, tổng 1.512 câu: 72 câu chuyên sâu đã biên soạn và 1.440 câu mới từ các bản dịch/ngữ cảnh nguồn. Bộ 1.440 câu động từ cũ vẫn có trong mục ôn cơ bản. Dịch theo ý có 12 gói/60 yêu cầu, mỗi yêu cầu dịch 1–3 câu nguồn từ đoạn văn trọn ý; tối đa 3 từ gợi ý mỗi yêu cầu, không trộn tiến độ với hai khóa cũ.'),node('p','Mở gói tùy ý. Nộp đủ câu của gói mới mở phân tích; đổi khóa hoặc gói không mất đáp án. Độ khó mới chưa được hiệu chuẩn bằng kết quả học của nhiều người.'));main.append(info);
  }
  document.getElementById('backup-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>5*1024*1024)throw Error('File sao lưu quá lớn. Hãy chọn JSON xuất từ trang này.');const restored=P.validateBackup(allCourses,JSON.parse(await file.text()));if(!window.confirm('Khôi phục các chủ điểm trong bản sao lưu sẽ thay thế tiến độ tương ứng trên trình duyệt. Tiếp tục?'))return;for(const [id,progress] of Object.entries(restored.progress)){const course=allCourses.find(c=>c.id===id);localStorage.setItem(P.key(course),JSON.stringify(progress));states[id]=progress;blocked.delete(id);}C=allCourses.find(c=>c.id===restored.selected);state=states[C.id];displayed=state.active;gapFocus={};view='learn';announce('');save();render();goTop();}catch(err){announce(`Chưa khôi phục: ${err.message}`);}finally{event.target.value='';}
  });
  window.addEventListener('storage',event=>{const course=allCourses.find(c=>P.key(c)===event.key);if(!course||!event.newValue)return;try{states[course.id]=E.validate(course,JSON.parse(event.newValue));if(course.id===C.id){state=states[C.id];displayed=state.active;}render();}catch(err){announce('Tiến độ ở tab khác chưa đọc được. Hãy tải sao lưu trước khi đóng trang.');}});
  function renderCatalog(){
    heading('PQ English','Ba chương trình độc lập','Chọn mục tiêu hôm nay. Bạn được chọn bất kỳ chủ điểm hoặc gói nào; tiến độ và sổ tay của từng chương trình được lưu riêng.');
    for(const [id,title,description]of [['dharma','Diễn đạt Phật học — 24 chủ điểm','1.440 câu gốc · 288 đoạn · mỗi gói 5 câu. Luyện cấu trúc, nối ý, điền từ, sắp xếp và sửa bản dịch.'],['verbs','Master động từ — Vận dụng nâng cao','1.512 câu nâng cao · 300 gói. Trong đó có 1.440 câu mới viết từ ngữ cảnh nguồn và 72 câu chuyên sâu.'],['translation','Dịch theo ý — Không word by word','60 bài dịch · 12 ngữ cảnh đầy đủ · mỗi yêu cầu 1–3 câu nguồn. Ghép cụm, sửa dịch sát chữ, đổi trục và nối ý.']]){const card=node('section',undefined,'catalog-card');card.append(node('h2',title),node('p',description),button(id==='translation'?'Chọn gói dịch':id==='verbs'?'Chọn gói động từ':'Chọn chủ điểm Phật học',()=>showProgram(id),'primary'));main.append(card);}
    if(C.programId==='translation'){
      main.append(node('h2','Các gói dịch theo ý','catalog-phase'),node('p','Mỗi gói có 5 yêu cầu cùng dạng, gồm cả đơn vị 2–3 câu liền nhau. Đọc trọn đoạn đạo lý rồi dựng câu Anh theo ý; không cần gõ.','intro'));
      translation.sets.forEach((set,i)=>{const card=node('section',undefined,'catalog-card'),r=states[translation.id].sets[set.id];card.append(node('div',`${set.id} · ${set.mode} · ${packetStatus(r)}`,'eyebrow'),node('h3',set.title,'catalog-title'),node('p',set.context.source.title+' · 5 yêu cầu · dịch 1–3 câu mỗi lượt','helper'),button(r?.status==='passed'?'Xem gói dịch':'Mở gói dịch',()=>openCourse(translation,i),'primary'));main.append(card);});return;
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
  function render(){main.replaceChildren();renderTopicPicker();renderTranslationGuide();document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(view==='catalog')renderCatalog();else if(view==='notes')renderNotes();else if(view==='progress')renderProgress();else renderLesson();}
  render();
})();
