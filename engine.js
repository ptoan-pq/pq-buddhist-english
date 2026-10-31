(function (root) {
  'use strict';
  const copy = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  function record(set) { return {status:'answer',round:set.items.map(q=>q.id),responses:{},history:[],passedItems:[]}; }
  function create(course) { return {schema:1,courseId:course.id,courseVersion:course.version,active:0,startedAt:now(),updatedAt:now(),sets:{[course.sets[0].id]:record(course.sets[0])}}; }
  function isSequence(type) { return type!=='choice'; }
  function validResponse(set,q,value,allowPartial=false) {
    const type=q.type||set.type;
    if(type==='choice') return Number.isInteger(value)&&value>=0&&value<q.options.length;
    if(!Array.isArray(value))return false;
    if(type==='compose')return value.length===q.answer.length&&value.every(n=>(allowPartial&&n===null)||(Number.isInteger(n)&&n>=0&&n<q.tokens.length))&&new Set(value.filter(n=>n!==null)).size===value.filter(n=>n!==null).length;
    const expected=q.answer.length,limit=(type==='order'||type==='paragraph')?q.tokens.length:q.options.length;
    if(allowPartial ? value.length>expected : value.length!==expected)return false;
    if(!value.every(n=>(allowPartial&&n===null)||(Number.isInteger(n)&&n>=0&&n<limit)))return false;
    if(type==='order'||type==='paragraph'||type==='match'){
      const selected=value.filter(n=>n!==null);
      if(new Set(selected).size!==selected.length)return false;
    }
    return allowPartial||!value.includes(null);
  }
  function isComplete(set,q,value) { return validResponse(set,q,value,false); }
  function normalizedText(text){return text.toLowerCase().replace(/[.,;:!?—]/g,' ').replace(/\s+/g,' ').trim();}
  function composeKey(q,value){return normalizedText((value||[]).map(i=>i===null?'…':q.tokens[i]).join(' '));}
  function isCorrect(q,value) { return (q.accepted||[q.answer]).some(answer=>q.type==='compose'?composeKey(q,answer)===composeKey(q,value):JSON.stringify(answer)===JSON.stringify(value)); }
  function current(course,state) { return course.sets[state.active]; }
  function saveResponse(course,state,setId,itemId,value) {
    const set=current(course,state),r=state.sets[setId];
    if(!set||set.id!==setId||!r||r.status!=='answer'||!r.round.includes(itemId))throw Error('Câu này không thuộc lượt đang làm.');
    const q=set.items.find(item=>item.id===itemId);
    if(!q||!validResponse(set,q,value,true))throw Error('Lựa chọn chưa hợp lệ.');
    if(q.type==='compose'&&(r.hints?.[itemId]||[]).some(h=>value[h.position]!==h.atom))throw Error('Từ đã gợi ý được giữ tại vị trí đúng.');
    r.responses[itemId]=copy(value);state.updatedAt=now();
  }
  function wordContext(course,state,setId,itemId){
    const set=current(course,state),r=state.sets[setId],q=set?.items.find(q=>q.id===itemId);
    if(set?.id!==setId||!r||r.status!=='answer'||!r.round.includes(itemId)||q?.type!=='compose')throw Error('Câu ghép này không thuộc lượt đang làm.');
    return {q,r,value:copy(r.responses[itemId]||q.answer.map(()=>null))};
  }
  function writeWords(course,state,setId,itemId,value,remember=true){
    const {r,value:before}=wordContext(course,state,setId,itemId);
    saveResponse(course,state,setId,itemId,value);
    if(remember){r.undo??={};r.undo[itemId]=[...(r.undo[itemId]||[]),before].slice(-20);}
  }
  function placeChunk(course,state,setId,itemId,chunkIndex,start=0){
    const {q,value}=wordContext(course,state,setId,itemId),chunk=q.chunks[chunkIndex];
    if(!chunk)throw Error('Không có thẻ này.');
    const atoms=chunk.filter(i=>!value.includes(i)),slots=value.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
    if(!atoms.length)return;
    if(atoms.length>slots.length)throw Error('Không đủ chỗ cho cụm này. Bấm một từ đã ghép để trả xuống hoặc dùng Hoàn tác.');
    const ordered=[...slots.filter(i=>i>=start),...slots.filter(i=>i<start)];
    atoms.forEach((a,i)=>{value[ordered[i]]=a;});writeWords(course,state,setId,itemId,value);
  }
  function removeWord(course,state,setId,itemId,position){
    const {q,r,value}=wordContext(course,state,setId,itemId);
    if(!Number.isInteger(position)||position<0||position>=q.answer.length)throw Error('Vị trí không hợp lệ.');
    if((r.hints?.[itemId]||[]).some(h=>h.position===position))throw Error('Từ gợi ý đã được giữ đúng chỗ.');
    value[position]=null;writeWords(course,state,setId,itemId,value);
  }
  function undoWords(course,state,setId,itemId){
    const {r}=wordContext(course,state,setId,itemId),stack=r.undo?.[itemId];
    if(stack?.length)writeWords(course,state,setId,itemId,stack.pop(),false);
  }
  function resetWords(course,state,setId,itemId){
    const {q,r}=wordContext(course,state,setId,itemId),value=q.answer.map(()=>null);
    for(const h of r.hints?.[itemId]||[])value[h.position]=h.atom;
    writeWords(course,state,setId,itemId,value);
  }
  function hintWord(course,state,setId,itemId){
    const {q,r,value}=wordContext(course,state,setId,itemId),hints=r.hints?.[itemId]||[];
    if(hints.length>=3)throw Error('Đã dùng tối đa 3 từ gợi ý cho câu này.');
    const candidates=(q.accepted||[q.answer]).filter(a=>hints.every(h=>q.tokens[a[h.position]]===q.tokens[h.atom]));
    candidates.sort((a,b)=>b.filter((v,i)=>q.tokens[v]===q.tokens[value[i]]).length-a.filter((v,i)=>q.tokens[v]===q.tokens[value[i]]).length);
    const answer=candidates[0],position=answer.findIndex((atom,i)=>q.tokens[atom]!==q.tokens[value[i]]);
    if(position<0)return null;
    const atom=answer[position],elsewhere=value.indexOf(atom);if(elsewhere>=0)value[elsewhere]=null;
    value[position]=atom;
    // Validate against existing locks before adding the new one.
    writeWords(course,state,setId,itemId,value,false);
    r.hints??={};r.hints[itemId]=[...hints,{position,atom}];r.undo??={};r.undo[itemId]=[];
    return {position,word:q.tokens[atom]};
  }
  function missing(set,r) { return r.round.filter(id=>!isComplete(set,set.items.find(q=>q.id===id),r.responses[id])); }
  function submit(course,state) {
    const set=current(course,state),r=state.sets[set.id];
    if(r.status!=='answer')throw Error('Bộ này đã được nộp.');
    if(missing(set,r).length)throw Error('Hãy trả lời đủ cả bộ trước khi nộp.');
    const wrong=[],passed=[];
    r.round.forEach(id=>{const q=set.items.find(item=>item.id===id);(isCorrect(q,r.responses[id])?passed:wrong).push(id);});
    r.history.push({submittedAt:now(),round:copy(r.round),responses:Object.fromEntries(r.round.map(id=>[id,copy(r.responses[id])])),wrong});
    r.passedItems=[...new Set([...r.passedItems,...passed])];r.status=wrong.length?'review':'passed';state.updatedAt=now();
    return {wrong,passed};
  }
  function retry(course,state) {
    const set=current(course,state),r=state.sets[set.id];
    if(r.status!=='review')throw Error('Không có câu cần làm lại.');
    r.round=copy(r.history.at(-1).wrong);r.round.forEach(id=>{delete r.responses[id];const q=set.items.find(q=>q.id===id);if(q.type==='compose'){const value=q.answer.map(()=>null);for(const h of r.hints?.[id]||[])value[h.position]=h.atom;r.responses[id]=value;}});r.undo={};r.status='answer';state.updatedAt=now();
  }
  function advance(course,state) {
    const set=current(course,state);
    if(!course.freeSets&&state.sets[set.id].status!=='passed')throw Error('Cần PASS bộ hiện tại trước khi chuyển tiếp.');
    if(state.active>=course.sets.length-1)return false;
    state.active++;const next=current(course,state);if(!state.sets[next.id])state.sets[next.id]=record(next);if(course.freeSets)state.sets[next.id].visited=true;state.updatedAt=now();return true;
  }
  function openSet(course,state,index){
    if(!course.freeSets)throw Error('Khóa học này dùng trình tự bộ bài cũ.');
    if(!Number.isInteger(index)||index<0||index>=course.sets.length)throw Error('Không có gói này.');
    state.active=index;const set=current(course,state);if(!state.sets[set.id])state.sets[set.id]=record(set);state.sets[set.id].visited=true;state.updatedAt=now();
  }
  function sequence(set,q,value) {
    if(value===undefined)return 'Chưa trả lời';
    const type=q.type||set.type;
    if(type==='choice')return q.options[value];
    if(type==='compose'){const rendering=q.renderings?.find(text=>normalizedText(text)===composeKey(q,value));if(rendering)return rendering;const text=value.map(i=>i===null?'…':q.tokens[i]).join(' ').replace(/\s+([,.;!?])/g,'$1').replace(/[,;:]+$/,'');return text.charAt(0).toUpperCase()+text.slice(1)+(/[.!?]$/.test(text)?'':'.');}
    if(type==='order'||type==='paragraph')return value.map(n=>q.tokens[n]).join(type==='paragraph'?'\n\n':' ');
    if(type==='match')return q.left.map((v,i)=>`${v} → ${value[i]===null?'…':q.options[value[i]]}`).join('\n');
    return q.parts.map((part,i)=>part+(i<value.length?(value[i]===null?'[…]':q.options[value[i]]):'')).join('');
  }
  function shuffled(length,seed) {
    const ids=Array.from({length},(_,i)=>i);let n=[...seed].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,17);
    for(let i=length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
    return ids;
  }
  function validate(course,state) {
    if(course.replacedVersion&&state?.courseVersion===course.replacedVersion){
      // Rewritten verb questions cannot inherit answers from unrelated old items.
      // The old browser storage key remains untouched; retain the unchanged base work.
      const trimmed=copy(state);trimmed.courseVersion=course.previousVersion;
      for(const set of course.sets){
        const r=trimmed.sets?.[set.id];if(!r)continue;
        const base=set.items.slice(0,set.baseItemCount),ids=base.map(q=>q.id),pick=responses=>Object.fromEntries(Object.entries(responses||{}).filter(([id])=>ids.includes(id)));
        r.responses=pick(r.responses);
        r.history=(r.history||[]).map(a=>({...a,round:(a.round||[]).filter(id=>ids.includes(id)),responses:pick(a.responses),wrong:(a.wrong||[]).filter(id=>ids.includes(id))})).filter(a=>a.round.length);
        r.passedItems=ids.filter(id=>r.history.some(a=>a.round.includes(id)&&!a.wrong.includes(id)));
        const pending=ids.filter(id=>!r.passedItems.includes(id));
        r.round=pending.length?pending:ids;r.status=pending.length?'answer':'passed';
      }
      return validate(course,trimmed);
    }
    if(course.previousVersion&&state?.courseVersion===course.previousVersion){
      const legacy={...course,version:course.previousVersion,previousVersion:null,replacedVersion:null,sets:course.sets.map(s=>({...s,items:s.items.slice(0,s.baseItemCount)}))};
      const migrated=validate(legacy,state);
      for(const set of course.sets){
        const r=migrated.sets[set.id];if(!r)continue;
        const pending=set.items.filter(q=>!r.passedItems.includes(q.id)).map(q=>q.id);
        r.status='answer';r.round=pending;
      }
      migrated.courseVersion=course.version;migrated.active=course.freeSets?state.active:0;
      return validate(course,migrated);
    }
    if(!state||state.schema!==1||state.courseId!==course.id||state.courseVersion!==course.version)throw Error('Bản sao lưu không đúng khóa học hoặc phiên bản.');
    if(!Number.isInteger(state.active)||state.active<0||state.active>=course.sets.length||!state.sets||typeof state.sets!=='object')throw Error('Trạng thái học không hợp lệ.');
    if(!Object.hasOwn(state.sets,course.sets[state.active].id))throw Error('Thiếu gói đang chọn trong bản lưu.');
    const clean=create(course);clean.sets={};clean.active=state.active;clean.startedAt=typeof state.startedAt==='string'?state.startedAt:clean.startedAt;
    const lastSaved=course.sets.reduce((last,set,i)=>Object.hasOwn(state.sets,set.id)?i:last,state.active);
    for(let i=0;i<=lastSaved;i++){
      const set=course.sets[i],r=state.sets[set.id],ids=set.items.map(q=>q.id);
      if(!r&&course.freeSets)continue;
      if(!r||!['answer','review','passed'].includes(r.status)||!Array.isArray(r.round)||!r.round.length||new Set(r.round).size!==r.round.length||r.round.some(id=>!ids.includes(id))||!Array.isArray(r.history)||!Array.isArray(r.passedItems)||!r.responses||typeof r.responses!=='object')throw Error('Bản sao lưu thiếu dữ liệu một bộ bài.');
      const target=record(set);target.status=r.status;target.round=copy(r.round);if(course.freeSets)target.visited=!!r.visited||r.history.length>0||Object.keys(r.responses).length>0;
      const hintEntries=Object.entries(r.hints||{});
      if(hintEntries.length){target.hints={};for(const [id,hints]of hintEntries){
        const q=set.items.find(q=>q.id===id);
        if(q?.type!=='compose'||!Array.isArray(hints)||hints.length>3||new Set(hints.map(h=>h?.position)).size!==hints.length||hints.some(h=>!h||!Number.isInteger(h.position)||h.position<0||h.position>=q.answer.length||!Number.isInteger(h.atom)||h.atom<0||h.atom>=q.tokens.length)||!(q.accepted||[q.answer]).some(a=>hints.every(h=>q.tokens[a[h.position]]===q.tokens[h.atom])))throw Error('Dữ liệu gợi ý không hợp lệ.');
        target.hints[id]=copy(hints);
      }}
      for(const q of set.items)if(Object.hasOwn(r.responses,q.id)){
        if(!validResponse(set,q,r.responses[q.id],true))throw Error('Bản sao lưu có đáp án không hợp lệ.');
        target.responses[q.id]=copy(r.responses[q.id]);
      }
      for(const [id,hints]of Object.entries(target.hints||{}))if(hints.some(h=>target.responses[id]?.[h.position]!==h.atom))throw Error('Vị trí từ gợi ý không khớp câu đang ghép.');
      for(const attempt of r.history){
        if(!attempt||!Array.isArray(attempt.round)||!attempt.round.length||new Set(attempt.round).size!==attempt.round.length||attempt.round.some(id=>!ids.includes(id))||!attempt.responses)throw Error('Lịch sử làm bài không hợp lệ.');
        const responses={},wrong=[];
        for(const id of attempt.round){const q=set.items.find(q=>q.id===id),a=attempt.responses[id];if(!validResponse(set,q,a))throw Error('Lịch sử có đáp án thiếu.');responses[id]=copy(a);if(!isCorrect(q,a))wrong.push(id);}
        target.history.push({submittedAt:typeof attempt.submittedAt==='string'?attempt.submittedAt:now(),round:copy(attempt.round),responses,wrong});
      }
      target.passedItems=ids.filter(id=>target.history.some(attempt=>attempt.round.includes(id)&&!attempt.wrong.includes(id)));
      if(!course.freeSets&&i<state.active&&target.status!=='passed')throw Error('Có bộ trước chưa PASS.');
      if(target.status==='passed'&&(target.passedItems.length!==ids.length||set.items.some(q=>!isComplete(set,q,target.responses[q.id])||!isCorrect(q,target.responses[q.id]))))throw Error('PASS chưa có đủ đáp án đúng.');
      if(target.status==='review'&&(!target.history.length||missing(set,target).length||!target.history.at(-1).wrong.length))throw Error('Lượt chữa bài không hợp lệ.');
      if(target.round.length<ids.length){const earned=ids.filter(id=>!target.round.includes(id));if(earned.some(id=>!target.passedItems.includes(id)))throw Error('Bản sao lưu bỏ qua câu chưa PASS.');}
      clean.sets[set.id]=target;
    }
    clean.updatedAt=now();return clean;
  }
  function statistics(course,state) {
    let passed=0,firstCorrect=0,firstTotal=0,answered=0,assistedPassed=0,independentPassed=0;
    course.sets.forEach(set=>{const r=state.sets[set.id];if(!r)return;passed+=r.passedItems.length;answered+=Object.keys(r.responses).length;if(r.history.length){firstTotal+=r.history[0].round.length;firstCorrect+=r.history[0].round.length-r.history[0].wrong.length;}});
    for(const set of course.sets){const r=state.sets[set.id];if(!r)continue;for(const id of r.passedItems){if(r.hints?.[id]?.length)assistedPassed++;else if(r.history[0]?.round.includes(id)&&!r.history[0].wrong.includes(id))independentPassed++;}}
    return {passed,answered,assistedPassed,independentPassed,afterReviewPassed:passed-independentPassed-assistedPassed,total:course.sets.reduce((n,s)=>n+s.items.length,0),completedSets:course.sets.filter(set=>state.sets[set.id]?.status==='passed').length,firstCorrect,firstTotal};
  }
  function markdown(course,state) {
    const stats=statistics(course,state),done=stats.completedSets===course.sets.length;
    const lines=[`# ${course.title}`,``,`${done?'Hoàn thành':'Ghi chú đang học'} · Cập nhật ${new Date().toLocaleDateString('vi-VN')}`,``,`Đã PASS: ${stats.passed}/${stats.total} câu · ${stats.completedSets}/${course.sets.length} bộ.`,``,`## Ý tưởng cốt lõi`,``,`- Đọc toàn ý trước khi chọn cách diễn đạt.`,`- Chọn đúng chủ ngữ và động từ trung tâm.`,`- Giữ phạm vi, điều kiện và mức độ khẳng định.`,`- Liên kết câu bằng quan hệ ý nghĩa và đối tượng quy chiếu rõ.`,``,`## Cấu trúc và câu đã làm chủ`,` `];
    if(course.targets)lines.splice(4,0,'## Trọng tâm theo curriculum gốc','',...course.targets.map(v=>`- ${v}`),'');
    if(course.sets.some(set=>set.items.some(q=>q.type==='compose')))lines.splice(5,0,`Đúng ngay không gợi ý: ${stats.independentPassed} · Đúng có hỗ trợ: ${stats.assistedPassed} · Đúng sau khi xem phản hồi: ${stats.afterReviewPassed}.`,'');
    const patterns=new Set(),sources=new Set();
    course.sets.forEach(set=>{const r=state.sets[set.id];if(!r||!r.passedItems.length)return;lines.push(`### ${set.id} — ${set.title}`,``);set.items.forEach(q=>{if(!r.passedItems.includes(q.id))return;patterns.add(q.pattern);(q.sources||[q.source]).forEach(s=>sources.add(`${s.title} — ${s.locator}`));lines.push(`- **${q.topic}**: ${sequence(set,q,r.responses[q.id]).replace(/\n/g,' ')}`,`  - Mẫu: ${q.pattern}`,`  - ${q.analysis}`);});lines.push('');});
    lines.push('## Mẫu ngôn ngữ cần nhớ','',...[...patterns].map(p=>`- ${p}`),'','## Những điểm cần ôn lại','');
    let retries=0;
    course.sets.forEach(set=>{const r=state.sets[set.id];if(!r?.history.length)return;r.history[0].wrong.forEach(id=>{const q=set.items.find(q=>q.id===id);lines.push(`- ${q.id} — ${q.topic}: ${q.analysis}`);retries++;});});
    if(!retries)lines.push('- Chưa ghi nhận lỗi ở các lượt nộp đầu. Tiếp tục chuyển giao sang ngữ cảnh mới.');
    lines.push('','## Nguồn nội dung','',...[...sources].map(v=>`- ${v}`),'','Thuật ngữ Anh trong bài là cách dịch theo ngữ cảnh. Ghi chú này không thay thế nguyên tác.','');return lines.join('\n');
  }
  const api={create,record,current,isSequence,isComplete,isCorrect,saveResponse,placeChunk,removeWord,undoWords,resetWords,hintWord,missing,submit,retry,advance,openSet,sequence,shuffled,validate,statistics,markdown};
  root.PQEngine=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
