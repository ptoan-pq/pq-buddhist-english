(function () {
  'use strict';
  const E=window.PQEngine,P=window.PQProject,courses=window.PQContextCourses||window.PQCourses,legacy=window.PQCourse,allCourses=[...courses,legacy],states={},blocked=new Set(),SELECTED='pq-english-selected-v3';
  let selected;try{selected=localStorage.getItem(SELECTED);}catch(err){}
  let C=allCourses.find(c=>c.id===selected)||courses[0];
  const main=document.getElementById('main'),warning=document.getElementById('storage-warning');
  let state=E.create(C),view='catalog',displayed=0,gapFocus={};
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  function announce(message){warning.textContent=message;warning.hidden=!message;}
  allCourses.forEach(course=>{try{const raw=localStorage.getItem(P.key(course));states[course.id]=raw?E.validate(course,JSON.parse(raw)):E.create(course);}catch(err){blocked.add(course.id);states[course.id]=E.create(course);announce('Một bản tiến độ cũ chưa đọc được và được giữ nguyên. Các chủ điểm khác vẫn sử dụng được; bạn có thể khôi phục từ JSON.');}});
  state=states[C.id];
  displayed=state.active;
  function save(){states[C.id]=state;if(blocked.has(C.id))return;try{localStorage.setItem(P.key(C),JSON.stringify(state));localStorage.setItem(SELECTED,C.id);}catch(err){announce('Trình duyệt chưa lưu được tiến độ. Hãy dùng Tiến độ → Tải sao lưu để giữ lại bài đang làm.');}}
  function openCourse(course){if(course.weekId&&!P.canOpen(courses,course.id))return;C=course;state=states[C.id];displayed=state.active;gapFocus={};view='learn';try{localStorage.setItem(SELECTED,C.id);}catch(err){}render();goTop();}
  function renderTopicPicker(){
    const picker=node('div',undefined,'topic-picker'),label=node('label','Chọn chủ điểm'),select=node('select');label.htmlFor='topic-select';select.id='topic-select';
    const placeholder=node('option','Chọn bất kỳ chủ điểm nào…');placeholder.value='';placeholder.disabled=true;placeholder.selected=view==='catalog';select.append(placeholder);
    allCourses.forEach(course=>{const option=node('option',course.title);option.value=course.id;option.selected=view!=='catalog'&&course.id===C.id;select.append(option);});
    select.onchange=()=>{const course=allCourses.find(c=>c.id===select.value);if(course)openCourse(course);};picker.append(label,select);main.append(picker);
  }
  function button(text,handler,cls='secondary',key){const b=node('button',text,cls);b.type='button';if(key)b.dataset.focus=key;b.onclick=handler;return b;}
  function change(fn,key){try{fn();save();render();if(key)document.querySelector(`[data-focus="${key}"]`)?.focus({preventScroll:true});}catch(err){announce(err.message);}}
  function goTop(){main.scrollIntoView({behavior:'auto',block:'start'});}
  function visit(target){view=target;if(target==='learn')displayed=state.active;render();goTop();}
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>visit(b.dataset.view));
  function heading(eyebrow,title,intro){main.append(node('div',eyebrow,'eyebrow'),node('h1',title,'title'));if(intro)main.append(node('p',intro,'intro'));}
  function answerArray(q,type,r){if(Array.isArray(r.responses[q.id]))return [...r.responses[q.id]];return type==='order'||type==='paragraph'?[]:q.answer.map(()=>null);}
  function choose(set,q,value,key){change(()=>E.saveResponse(C,state,set.id,q.id,value),key);}
  function reviewCard(set,q,r,card){
    const ok=E.isCorrect(q,r.responses[q.id]);card.append(node('span',ok?'PASS':'RETRY',`result-label ${ok?'pass':'retry'}`));
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
    if(review){const en=node('details');en.open=true;en.append(node('summary','Bản dịch tiếng Anh tham khảo'));set.context.translation.split(/\n\n/).forEach(p=>en.append(node('p',p)));en.append(node('div',`${set.context.source.title} · ${set.context.source.locator}`,'source-ref'));box.append(en);}
    else box.append(node('p','Đọc toàn đoạn trước khi làm. Bản dịch tiếng Anh sẽ mở sau khi nộp đủ 5 câu.','helper'));
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
    heading(`${C.weekId?`Chủ điểm ${C.week} · ${C.subtitle}`:'Bản tổng hợp v1'} · Bộ ${displayed+1}/${C.sets.length}`,set.title,set.instruction);
    if(C.targets)main.append(node('p',`Trọng tâm chủ điểm: ${C.targets.join(' · ')}`,'helper'));
    const meta=node('div',undefined,'meta-row');meta.append(node('span',review?(r.status==='passed'?'PASS · Cả bộ đã đạt':'Đã nộp · Cần sửa lại'):`${completed}/${indices.length} câu đã trả lời`,'pill'),node('span',review?`Lượt nộp ${r.history.length}`:'Đáp án đang khóa','helper'));main.append(meta);
    const track=node('div',undefined,'progress-track');track.setAttribute('role','progressbar');track.setAttribute('aria-label','Tiến độ bộ hiện tại');track.setAttribute('aria-valuenow',String(completed));track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(indices.length));const fill=node('div',undefined,'progress-fill');fill.style.width=`${100*completed/indices.length}%`;track.append(fill);main.append(track);
    const route=node('nav',undefined,'set-route');route.setAttribute('aria-label','Các bộ bài');C.sets.forEach((b,i)=>{const rec=state.sets[b.id],done=rec?.status==='passed',link=button(done?'✓ '+(i+1):String(i+1),()=>{displayed=i;gapFocus={};render();goTop();},`set-number${i===displayed?' active':''}${done?' done':''}`);link.disabled=i>state.active;link.setAttribute('aria-label',`Bộ ${i+1}: ${b.title}${done?' — đã PASS':''}`);if(i===displayed)link.setAttribute('aria-current','step');route.append(link);});main.append(route);
    if(r.status!=='passed'&&r.round.length<set.items.length)main.append(node('div',`Lượt sửa: chỉ hiện ${r.round.length} câu chưa đạt. Các câu đã PASS vẫn được giữ lại.`,'notice'));
    if(displayed<state.active)main.append(node('div','Bạn đang xem lại bộ đã hoàn thành.','notice'));
    const context=contextPanel(set,review);if(context)main.append(context);
    const list=node('div',undefined,'question-list');indices.forEach(i=>{const q=set.items[i],card=node('section',undefined,'question');card.id=q.id.replace('.','-');card.setAttribute('aria-labelledby',`${card.id}-title`);const head=node('div',undefined,'question-head');head.append(node('span',`Câu ${i+1} / ${set.items.length}`),node('span',q.topic,'topic'));const title=node('h2',q.prompt,'question-title');title.id=`${card.id}-title`;card.append(head,title);if(q.original)card.append(node('div',`Bản dịch cần sửa: ${q.original}`,'original'));
      if(review)reviewCard(set,q,r,card);else if(set.type==='choice')choiceUI(set,q,r,card);else if(set.type==='gaps')gapsUI(set,q,r,card);else if(set.type==='match')matchUI(set,q,r,card);else orderUI(set,q,r,card);list.append(card);});main.append(list);
    const submit=node('div',undefined,'submit-bar'),message=node('span',undefined,'submit-status'),actions=node('div',undefined,'button-group');message.setAttribute('aria-live','polite');
    if(!review){message.textContent=missing.length?`Còn ${missing.length} câu chưa xong. Bạn có thể sửa lựa chọn trước khi nộp.`:'Đã đủ câu — sẵn sàng nộp cả bộ.';const b=button('Nộp cả bộ →',()=>{change(()=>E.submit(C,state));goTop();},'primary');b.disabled=missing.length>0;actions.append(b);}
    else if(!isCurrent){message.textContent='Xem lại đáp án và phân tích.';actions.append(button('Trở về bộ đang học',()=>{displayed=state.active;render();goTop();},'primary'));}
    else if(r.status==='review'){message.textContent=`${r.history.at(-1).wrong.length} câu cần làm lại. Bộ tiếp theo vẫn khóa.`;actions.append(button('Làm lại câu chưa đạt',()=>{change(()=>E.retry(C,state));goTop();},'primary'));}
    else if(displayed<C.sets.length-1){message.textContent='Đã PASS. Mở bộ tiếp theo khi bạn sẵn sàng.';actions.append(button('Bộ tiếp theo →',()=>{change(()=>{E.advance(C,state);displayed=state.active;gapFocus={};});goTop();},'primary'));}
    else{message.textContent=`Hoàn thành ${C.weekId?`chủ điểm ${C.week}`:'bản tổng hợp v1'}. Sổ tay của bạn đã sẵn sàng.`;actions.append(button('Mở sổ tay bài học',()=>visit('notes'),'primary'),button('Tải Markdown',()=>downloadNote()));const next=courses[C.week];if(C.weekId&&next)actions.append(button('Chủ điểm tiếp theo →',()=>openCourse(next)));else if(C.weekId)actions.append(button('Xem toàn chương trình',()=>visit('catalog')));}
    submit.append(message,actions);main.append(submit);
  }
  function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function downloadNote(){download(`PQ-English-${C.weekId||'Tong-hop-v1'}.md`,E.markdown(C,state),'text/markdown;charset=utf-8');}
  function renderNotes(){
    const stats=E.statistics(C,state);heading(C.title,'Những điều đã làm chủ','Ghi chú riêng cho chủ điểm đang chọn, tạo từ những câu đã PASS. Tải Markdown để lưu trong project học tập trên máy.');
    const controls=node('div',undefined,'button-group');controls.append(button('Tải ghi chú Markdown',downloadNote,'primary'));main.append(controls);
    if(!stats.passed){main.append(node('div','Sau khi bạn nộp và PASS các câu đầu tiên, các mẫu câu và phân tích quan trọng sẽ xuất hiện ở đây.','empty-state'));return;}
    const core=node('section',undefined,'note-section');core.append(node('h2','Bốn thói quen diễn đạt'));const habits=node('ul');['Đọc toàn đoạn trước khi quyết định nghĩa từ.','Chọn chủ ngữ và động từ trung tâm trước các phần bổ nghĩa.','Giữ đúng điều kiện, phạm vi và độ chắc chắn của ý nguồn.','Nối ý bằng quan hệ hợp lý và đại từ quy chiếu rõ.'].forEach(v=>habits.append(node('li',v)));core.append(habits);main.append(core);
    C.sets.forEach(set=>{const r=state.sets[set.id];if(!r?.passedItems.length)return;const section=node('section',undefined,'note-section');section.append(node('h2',`${set.id} · ${set.title}`));set.items.filter(q=>r.passedItems.includes(q.id)).forEach(q=>{const details=node('details');details.append(node('summary',`${q.topic} · ${q.pattern}`),node('p',E.sequence(set,q,q.answer)),node('p',q.analysis,'analysis'),node('div',q.source.locator,'source-ref'));section.append(details);});main.append(section);});
  }
  function renderProgress(){
    const stats=E.statistics(C,state);heading(C.title,'Học tiếp từ đúng chỗ','Mỗi chủ điểm có tiến độ riêng. Sao lưu JSON giữ toàn bộ chủ điểm đã học cùng bản tổng hợp v1 để chuyển máy hoặc lưu trong project.');
    const metrics=node('div',undefined,'stats');[[`${stats.passed}/${stats.total}`,'Câu đã PASS'],[`${stats.completedSets}/${C.sets.length}`,'Bộ đã hoàn thành'],[stats.firstTotal?`${Math.round(100*stats.firstCorrect/stats.firstTotal)}%`:'—','Đúng ở lượt nộp đầu']].forEach(([value,label])=>{const stat=node('div',undefined,'stat');stat.append(node('strong',value),node('span',label));metrics.append(stat);});main.append(metrics);
    const tools=node('div',undefined,'button-group');tools.append(button('Tải sao lưu JSON',()=>download('PQ-English-project-v2.backup.json',JSON.stringify(P.exportProject(allCourses,states,C.id),null,2),'application/json'),'primary'),button('Khôi phục từ JSON',()=>document.getElementById('backup-file').click()),button('Tải sổ tay Markdown',downloadNote));main.append(tools,node('p','Không có đồng bộ tài khoản tự động. Xóa dữ liệu trình duyệt có thể xóa tiến độ; bản sao lưu giúp khôi phục. Câu trả lời của bạn không được gửi lên GitHub.','helper'));
    const section=node('section',undefined,'progress-section');section.append(node('h2',C.title));const list=node('ol',undefined,'progress-list');C.sets.forEach((set,i)=>{const r=state.sets[set.id],row=node('li'),name=node('div',`${i+1}. ${set.title}`,'progress-name');name.append(node('small',`${set.phase} · ${set.items.length} câu · ${r?.status==='passed'?'Đã PASS':i===state.active?'Đang học':'Chưa mở'}`));const b=button(r?.status==='passed'?'Xem lại':'Mở bộ',()=>{view='learn';displayed=i;render();goTop();});b.disabled=i>state.active;row.append(name,b);list.append(row);});section.append(list);main.append(section);
    const info=node('section',undefined,'progress-section');info.append(node('h2','Về nội dung và cách chấm'),node('p','24 chủ điểm giữ nguyên thứ tự và trọng tâm trong curriculum.md của Buddhist English Expression Coach v4. Mỗi chủ điểm có 12 ngữ cảnh, mỗi ngữ cảnh 5 câu vận dụng cùng thể loại; tổng cộng 1.440 câu.'),node('p','Nguồn Việt quyết định nội dung; đáp án Anh là cách diễn đạt theo ngữ cảnh. Bạn đọc đoạn trọn vẹn, bấm làm cả nhóm rồi mới mở bản dịch và phân tích.'));main.append(info);
  }
  document.getElementById('backup-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>5*1024*1024)throw Error('File sao lưu quá lớn. Hãy chọn JSON xuất từ trang này.');const restored=P.validateBackup(allCourses,JSON.parse(await file.text()));if(!window.confirm('Khôi phục các chủ điểm trong bản sao lưu sẽ thay thế tiến độ tương ứng trên trình duyệt. Tiếp tục?'))return;for(const [id,progress] of Object.entries(restored.progress)){const course=allCourses.find(c=>c.id===id);localStorage.setItem(P.key(course),JSON.stringify(progress));states[id]=progress;blocked.delete(id);}C=allCourses.find(c=>c.id===restored.selected);state=states[C.id];displayed=state.active;gapFocus={};view='learn';announce('');save();render();goTop();}catch(err){announce(`Chưa khôi phục: ${err.message}`);}finally{event.target.value='';}
  });
  window.addEventListener('storage',event=>{const course=allCourses.find(c=>P.key(c)===event.key);if(!course||!event.newValue)return;try{states[course.id]=E.validate(course,JSON.parse(event.newValue));if(course.id===C.id){state=states[C.id];displayed=state.active;}render();}catch(err){announce('Tiến độ ở tab khác chưa đọc được. Hãy tải sao lưu trước khi đóng trang.');}});
  function renderCatalog(){
    heading('Buddhist English Expression Coach v4','Chương trình 24 chủ điểm','Chọn bất kỳ chủ điểm nào bạn muốn học. Mỗi chủ điểm có 12 ngữ cảnh × 5 câu, đọc trọn đoạn rồi vận dụng ngay dưới đoạn. Bạn có thể đổi chủ điểm và quay lại đúng chỗ đang dở.');
    const done=courses.filter(c=>P.complete(c,states[c.id])).length;main.append(node('span',`${done}/24 chủ điểm đã hoàn thành · 1.440 câu`,'pill'));
    let phase='';courses.forEach(course=>{if(course.phase!==phase){phase=course.phase;main.append(node('h2',phase,'catalog-phase'));}const card=node('section',undefined,'catalog-card'),status=P.complete(course,states[course.id]);card.append(node('div',`TUẦN ${String(course.week).padStart(2,'0')} · ${course.subtitle}`,'eyebrow'),node('h3',course.title.replace(/^Chủ điểm \d+ — /,''),'catalog-title'),node('p',course.targets.join(' · '),'catalog-targets'));const actions=node('div',undefined,'meta-row');actions.append(node('span',`${status?'Đã PASS':'Sẵn sàng học'} · 60 câu · 12 ngữ cảnh`,'helper'));const b=button(status?'Xem lại':'Học chủ điểm này',()=>openCourse(course),'primary');actions.append(b);card.append(actions);main.append(card);});
    const old=node('section',undefined,'note-section');old.append(node('h2','Bản học tổng hợp v1'),node('p','72 câu của bản cũ được giữ riêng cùng tiến độ cũ. Bản này không tính thành chủ điểm 1 của chương trình mới.'));old.append(button('Mở bản cũ và tiến độ',()=>openCourse(legacy)));main.append(old);
  }
  function render(){main.replaceChildren();renderTopicPicker();document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(view==='catalog')renderCatalog();else if(view==='notes')renderNotes();else if(view==='progress')renderProgress();else renderLesson();}
  render();
})();
