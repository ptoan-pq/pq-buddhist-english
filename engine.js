(function (root) {
  'use strict';
  const copy = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  function record(set) { return {status:'answer',round:set.items.map(q=>q.id),responses:{},history:[],passedItems:[]}; }
  function create(course) { return {schema:1,courseId:course.id,courseVersion:course.version,active:0,startedAt:now(),updatedAt:now(),sets:{[course.sets[0].id]:record(course.sets[0])}}; }
  function isSequence(type) { return type!=='choice'; }
  function validResponse(set,q,value,allowPartial=false) {
    if(set.type==='choice') return Number.isInteger(value)&&value>=0&&value<q.options.length;
    if(!Array.isArray(value))return false;
    const expected=q.answer.length,limit=(set.type==='order'||set.type==='paragraph')?q.tokens.length:q.options.length;
    if(allowPartial ? value.length>expected : value.length!==expected)return false;
    if(!value.every(n=>(allowPartial&&n===null)||(Number.isInteger(n)&&n>=0&&n<limit)))return false;
    if(set.type==='order'||set.type==='paragraph'||set.type==='match'){
      const selected=value.filter(n=>n!==null);
      if(new Set(selected).size!==selected.length)return false;
    }
    return allowPartial||!value.includes(null);
  }
  function isComplete(set,q,value) { return validResponse(set,q,value,false); }
  function isCorrect(q,value) { return (q.accepted||[q.answer]).some(answer=>JSON.stringify(answer)===JSON.stringify(value)); }
  function current(course,state) { return course.sets[state.active]; }
  function saveResponse(course,state,setId,itemId,value) {
    const set=current(course,state),r=state.sets[setId];
    if(!set||set.id!==setId||!r||r.status!=='answer'||!r.round.includes(itemId))throw Error('Câu này không thuộc lượt đang làm.');
    const q=set.items.find(item=>item.id===itemId);
    if(!q||!validResponse(set,q,value,true))throw Error('Lựa chọn chưa hợp lệ.');
    r.responses[itemId]=copy(value);state.updatedAt=now();
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
    r.round=copy(r.history.at(-1).wrong);r.round.forEach(id=>delete r.responses[id]);r.status='answer';state.updatedAt=now();
  }
  function advance(course,state) {
    const set=current(course,state);
    if(state.sets[set.id].status!=='passed')throw Error('Cần PASS bộ hiện tại trước khi chuyển tiếp.');
    if(state.active>=course.sets.length-1)return false;
    state.active++;const next=current(course,state);state.sets[next.id]=record(next);state.updatedAt=now();return true;
  }
  function sequence(set,q,value) {
    if(value===undefined)return 'Chưa trả lời';
    if(set.type==='choice')return q.options[value];
    if(set.type==='order'||set.type==='paragraph')return value.map(n=>q.tokens[n]).join(set.type==='paragraph'?'\n\n':' ');
    if(set.type==='match')return q.left.map((v,i)=>`${v} → ${value[i]===null?'…':q.options[value[i]]}`).join('\n');
    return q.parts.map((part,i)=>part+(i<value.length?(value[i]===null?'[…]':q.options[value[i]]):'')).join('');
  }
  function shuffled(length,seed) {
    const ids=Array.from({length},(_,i)=>i);let n=[...seed].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,17);
    for(let i=length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
    return ids;
  }
  function validate(course,state) {
    if(!state||state.schema!==1||state.courseId!==course.id||state.courseVersion!==course.version)throw Error('Bản sao lưu không đúng khóa học hoặc phiên bản.');
    if(!Number.isInteger(state.active)||state.active<0||state.active>=course.sets.length||!state.sets||typeof state.sets!=='object')throw Error('Trạng thái học không hợp lệ.');
    const clean=create(course);clean.active=state.active;clean.startedAt=typeof state.startedAt==='string'?state.startedAt:clean.startedAt;
    for(let i=0;i<=state.active;i++){
      const set=course.sets[i],r=state.sets[set.id],ids=set.items.map(q=>q.id);
      if(!r||!['answer','review','passed'].includes(r.status)||!Array.isArray(r.round)||!r.round.length||new Set(r.round).size!==r.round.length||r.round.some(id=>!ids.includes(id))||!Array.isArray(r.history)||!Array.isArray(r.passedItems)||!r.responses||typeof r.responses!=='object')throw Error('Bản sao lưu thiếu dữ liệu một bộ bài.');
      const target=record(set);target.status=r.status;target.round=copy(r.round);
      for(const q of set.items)if(Object.hasOwn(r.responses,q.id)){
        if(!validResponse(set,q,r.responses[q.id],true))throw Error('Bản sao lưu có đáp án không hợp lệ.');
        target.responses[q.id]=copy(r.responses[q.id]);
      }
      for(const attempt of r.history){
        if(!attempt||!Array.isArray(attempt.round)||!attempt.round.length||new Set(attempt.round).size!==attempt.round.length||attempt.round.some(id=>!ids.includes(id))||!attempt.responses)throw Error('Lịch sử làm bài không hợp lệ.');
        const responses={},wrong=[];
        for(const id of attempt.round){const q=set.items.find(q=>q.id===id),a=attempt.responses[id];if(!validResponse(set,q,a))throw Error('Lịch sử có đáp án thiếu.');responses[id]=copy(a);if(!isCorrect(q,a))wrong.push(id);}
        target.history.push({submittedAt:typeof attempt.submittedAt==='string'?attempt.submittedAt:now(),round:copy(attempt.round),responses,wrong});
      }
      target.passedItems=ids.filter(id=>target.history.some(attempt=>attempt.round.includes(id)&&!attempt.wrong.includes(id)));
      if(i<state.active&&target.status!=='passed')throw Error('Có bộ trước chưa PASS.');
      if(target.status==='passed'&&(target.passedItems.length!==ids.length||set.items.some(q=>!isComplete(set,q,target.responses[q.id])||!isCorrect(q,target.responses[q.id]))))throw Error('PASS chưa có đủ đáp án đúng.');
      if(target.status==='review'&&(!target.history.length||missing(set,target).length||!target.history.at(-1).wrong.length))throw Error('Lượt chữa bài không hợp lệ.');
      if(target.round.length<ids.length){const earned=ids.filter(id=>!target.round.includes(id));if(earned.some(id=>!target.passedItems.includes(id)))throw Error('Bản sao lưu bỏ qua câu chưa PASS.');}
      clean.sets[set.id]=target;
    }
    clean.updatedAt=now();return clean;
  }
  function statistics(course,state) {
    let passed=0,firstCorrect=0,firstTotal=0,answered=0;
    course.sets.forEach(set=>{const r=state.sets[set.id];if(!r)return;passed+=r.passedItems.length;answered+=Object.keys(r.responses).length;if(r.history.length){firstTotal+=r.history[0].round.length;firstCorrect+=r.history[0].round.length-r.history[0].wrong.length;}});
    return {passed,answered,total:course.sets.reduce((n,s)=>n+s.items.length,0),completedSets:course.sets.filter(set=>state.sets[set.id]?.status==='passed').length,firstCorrect,firstTotal};
  }
  function markdown(course,state) {
    const stats=statistics(course,state),done=stats.completedSets===course.sets.length;
    const lines=[`# ${course.title}`,``,`${done?'Hoàn thành':'Ghi chú đang học'} · Cập nhật ${new Date().toLocaleDateString('vi-VN')}`,``,`Đã PASS: ${stats.passed}/${stats.total} câu · ${stats.completedSets}/${course.sets.length} bộ.`,``,`## Ý tưởng cốt lõi`,``,`- Đọc toàn ý trước khi chọn cách diễn đạt.`,`- Chọn đúng chủ ngữ và động từ trung tâm.`,`- Giữ phạm vi, điều kiện và mức độ khẳng định.`,`- Liên kết câu bằng quan hệ ý nghĩa và đối tượng quy chiếu rõ.`,``,`## Cấu trúc và câu đã làm chủ`,` `];
    const patterns=new Set(),sources=new Set();
    course.sets.forEach(set=>{const r=state.sets[set.id];if(!r||!r.passedItems.length)return;lines.push(`### ${set.id} — ${set.title}`,``);set.items.forEach(q=>{if(!r.passedItems.includes(q.id))return;patterns.add(q.pattern);sources.add(`${q.source.title} — ${q.source.locator}`);lines.push(`- **${q.topic}**: ${sequence(set,q,r.responses[q.id]).replace(/\n/g,' ')}`,`  - Mẫu: ${q.pattern}`,`  - ${q.analysis}`);});lines.push('');});
    lines.push('## Mẫu ngôn ngữ cần nhớ','',...[...patterns].map(p=>`- ${p}`),'','## Những điểm cần ôn lại','');
    let retries=0;
    course.sets.forEach(set=>{const r=state.sets[set.id];if(!r?.history.length)return;r.history[0].wrong.forEach(id=>{const q=set.items.find(q=>q.id===id);lines.push(`- ${q.id} — ${q.topic}: ${q.analysis}`);retries++;});});
    if(!retries)lines.push('- Chưa ghi nhận lỗi ở các lượt nộp đầu. Tiếp tục chuyển giao sang ngữ cảnh mới.');
    lines.push('','## Nguồn nội dung','',...[...sources].map(v=>`- ${v}`),'','Thuật ngữ Anh trong bài là cách dịch theo ngữ cảnh. Ghi chú này không thay thế nguyên tác.','');return lines.join('\n');
  }
  const api={create,record,current,isSequence,isComplete,isCorrect,saveResponse,missing,submit,retry,advance,sequence,shuffled,validate,statistics,markdown};
  root.PQEngine=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
