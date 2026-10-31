(function(root){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const storageKey='pq-english-expressions-v1';
 const bank=root.PQExpressionBank||(typeof require!=='undefined'?require('./expression-bank.js'):[]);
 const kinds=['source','r','n','o','e'],intervals=[1,3,7,14,30];
 const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
 const idFor=s=>'phrase:'+encodeURIComponent(normalize(s));
 function today(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
 function dayOK(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;}
 function requireDay(s){if(!dayOK(s))throw Error('Ngày ôn chưa hợp lệ.');}
 function create(){return {schema:1,cards:{},session:null};}
 function candidates(en,pattern='',chunks=[]){
  const results=[],seen=new Set();
  const add=c=>{const key=idFor(c.expression);if(!seen.has(key)){seen.add(key);results.push(c);}};
  for(const entry of bank){const match=en.match(new RegExp(entry.match,'i'));if(match)add({expression:entry.expression,surface:match[0],meaning:entry.meaning,frame:entry.frame,curatedId:entry.id});}
  for(const expression of pattern.split(' · ').map(s=>s.trim()).filter(Boolean)){
   if(results.some(c=>normalize(c.expression).includes(normalize(expression))))continue;
   const escaped=expression.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),match=en.match(new RegExp('\\b'+escaped+'\\b','i'));
   if(match)add({expression,surface:match[0],meaning:'',frame:expression,curatedId:null});
  }
  if(!results.length)for(const chunk of chunks){if(chunk.trim().split(/\s+/).length>=2&&chunk.trim().length<=100&&en.toLowerCase().includes(chunk.trim().toLowerCase()))add({expression:chunk.trim().replace(/[.,;:!?]+$/,''),surface:chunk.trim(),meaning:'',frame:chunk.trim(),curatedId:null});}
  if(!results.length){const expression=pattern.trim()||en;if(expression.length<=500)add({expression,surface:expression,meaning:'',frame:expression,curatedId:null});}
  return results.slice(0,8);
 }
 function text(value,max=40000){return typeof value==='string'&&value.length>0&&value.length<=max;}
 function contextOK(c){return c&&['courseId','setId','itemId','en','vi'].every(k=>text(c[k]))&&text(c.paragraph)&&typeof c.analysis==='string'&&c.source&&text(c.source.title)&&text(c.source.locator)&&(c.chunks===undefined||(Array.isArray(c.chunks)&&c.chunks.length<=1000&&c.chunks.every(t=>text(t,5000))));}
 function validate(value){
  if(!value||value.schema!==1||!value.cards||typeof value.cards!=='object'||Array.isArray(value.cards)||Object.keys(value.cards).length>10000)throw Error('Sổ tay cụm từ không hợp lệ.');
  const book=clone(value);
  for(const [id,c]of Object.entries(book.cards)){
   if(!c||!text(c.expression,500)||id!==idFor(c.expression)||c.id!==id||!text(c.surface,1000)||typeof c.meaning!=='string'||typeof c.frame!=='string'||!(c.curatedId===null||text(c.curatedId,100))||!Array.isArray(c.contexts)||!c.contexts.length||c.contexts.length>30||!c.contexts.every(contextOK)||!dayOK(c.savedOn)||!dayOK(c.due)||!Number.isInteger(c.stage)||c.stage<0||c.stage>5||!Array.isArray(c.events)||c.events.length>500)throw Error('Một thẻ cụm từ bị thiếu hoặc sai dữ liệu.');
   for(const e of c.events)if(!e||!dayOK(e.day)||!text(e.taskId,1000)||!text(e.kind,30)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||typeof e.fresh!=='boolean')throw Error('Lịch sử ôn chưa hợp lệ.');
  }
  if(book.session!==null){
   const s=book.session;
   if(!s||!kinds.includes(s.kind)||!dayOK(s.day)||!['answer','review','passed'].includes(s.status)||!Array.isArray(s.cardIds)||!s.cardIds.length||s.cardIds.length>7||new Set(s.cardIds).size!==s.cardIds.length||!s.cardIds.every(id=>Object.hasOwn(book.cards,id))||!Array.isArray(s.round)||!s.round.length||new Set(s.round).size!==s.round.length||!s.round.every(id=>s.cardIds.includes(id))||!s.responses||!s.hints||!Array.isArray(s.history)||s.history.length>100||typeof s.graded!=='boolean')throw Error('Phiên ôn chưa hợp lệ.');
   for(const id of s.cardIds){const q=task(book.cards[id],s.kind);if(Object.hasOwn(s.responses,id)&&!validAnswer(q,s.responses[id],true))throw Error('Đáp án ôn chưa hợp lệ.');if(Object.hasOwn(s.hints,id)&&typeof s.hints[id]!=='boolean')throw Error('Gợi ý chưa hợp lệ.');}
   for(const attempt of s.history){if(!Array.isArray(attempt)||!attempt.every(r=>r&&s.cardIds.includes(r.cardId)&&typeof r.correct==='boolean'&&typeof r.assisted==='boolean'))throw Error('Kết quả ôn chưa hợp lệ.');}
   if(s.status!=='answer'&&(!s.graded||!s.history.length))throw Error('Thiếu kết quả ôn.');
   if(s.status!=='answer'&&s.round.some(id=>!validAnswer(task(book.cards[id],s.kind),s.responses[id])))throw Error('Thiếu đáp án của lượt đã nộp.');
   if(s.history.length&&s.status!=='answer'&&(s.history.at(-1).length!==s.round.length||!s.round.every(id=>s.history.at(-1).some(r=>r.cardId===id))))throw Error('Kết quả không khớp câu đang ôn.');
  }
  return book;
 }
 function save(book,candidate,context,day=today()){
  requireDay(day);if(!text(candidate.expression,500)||!text(candidate.surface,1000)||!contextOK(context))throw Error('Thiếu cụm hoặc ngữ cảnh để lưu.');
  const id=idFor(candidate.expression),previous=book.cards[id];
  if(previous){if(!previous.contexts.some(c=>c.courseId===context.courseId&&c.setId===context.setId&&c.itemId===context.itemId)&&previous.contexts.length<30)previous.contexts.push(clone(context));return id;}
  book.cards[id]={id,expression:candidate.expression.trim(),surface:candidate.surface,meaning:candidate.meaning||'',frame:candidate.frame||candidate.expression,curatedId:candidate.curatedId||null,contexts:[clone(context)],savedOn:day,due:day,stage:0,events:[]};return id;
 }
 function entry(card){return bank.find(e=>e.id===card.curatedId);}
 function status(card){
  if(!card.events.length)return 'saved';
  if(!card.events.at(-1).correct)return 'needs-review';
  if(card.events.at(-1).assisted)return 'learning';
  const good=card.events.filter(e=>e.fresh&&e.correct&&!e.assisted);
  if(entry(card)&&card.stage>=3&&new Set(good.map(e=>e.taskId)).size>=3&&new Set(good.map(e=>e.day)).size>=3)return 'mastered';
  return 'learning';
 }
 function due(book,day=today()){requireDay(day);return Object.values(book.cards).filter(c=>c.due<=day);}
 function eligible(book,kind,day=today(),early=false){return Object.values(book.cards).filter(c=>(early||c.due<=day)&&(kind==='source'||entry(c))).sort((a,b)=>a.due.localeCompare(b.due)||a.savedOn.localeCompare(b.savedOn)||a.id.localeCompare(b.id));}
 function start(book,kind,day=today(),early=false){
  requireDay(day);if(!kinds.includes(kind))throw Error('Không có dạng ôn này.');if(book.session)throw Error('Hãy học tiếp hoặc kết thúc lượt đang mở.');
  const cards=eligible(book,kind,day,early).slice(0,7);if(!cards.length)throw Error('Chưa có cụm phù hợp đến lượt ôn.');
  book.session={kind,day,cardIds:cards.map(c=>c.id),round:cards.map(c=>c.id),responses:{},hints:{},history:[],graded:false,status:'answer'};
 }
 const format=s=>s.replace(/\s+([,.;!?])/g,'$1').replace(/(^|[.!?]\s+)([a-z])/g,(_,p,l)=>p+l.toUpperCase());
 function task(card,kind){
  const curated=entry(card),base={id:card.id,cardId:card.id,kind,fresh:kind!=='source',taskId:(curated?.id||card.id)+':'+kind+':v1'};
  if(kind==='source'){
   const c=card.contexts[0],chunks=c.chunks?.length?c.chunks:c.en.split(/\s+/);
   return {...base,type:'order',fresh:false,vi:c.vi,prompt:'Dựng lại câu đã học. Đây là ôn câu nguồn, chưa phải vận dụng mới.',tokens:chunks,answer:chunks.map((_,i)=>i),english:c.en,analysis:c.analysis};
  }
  const data=curated?.[kind];if(!data)throw Error('Cụm này chưa có bài vận dụng mới.');
  if(kind==='o'){const chunks=data[1].split('|');return {...base,type:'order',vi:data[0],prompt:'Ghép câu cho tình huống mới; có cụm không dùng.',tokens:[...chunks,...data[2].split('|')],answer:chunks.map((_,i)=>i),english:format(chunks.join(' '))+(/[.!?]$/.test(chunks.at(-1))?'':'.'),analysis:data[3]};}
  if(kind==='e'){const options=data[2].split('|');return {...base,type:'choice',vi:data[0],prompt:'Chọn bản sửa tự nhiên và giữ đúng ý Việt.',original:data[1],options,answer:0,english:options[0],analysis:data[3]};}
  return {...base,type:'choice',vi:data[0],prompt:kind==='n'?'Chọn cụm đúng sắc thái nhất.':'Chọn cụm để diễn đạt ý Việt trong câu.',frame:data[1],options:[data[2],...data[3].split('|')],answer:0,english:data[1].replace('___',data[2]),analysis:data[4]};
 }
 function tasks(book){return book.session?book.session.round.map(id=>task(book.cards[id],book.session.kind)):[];}
 function validAnswer(q,a,partial=false){return q.type==='choice'?Number.isInteger(a)&&a>=0&&a<q.options.length:Array.isArray(a)&&a.length<=(partial?q.tokens.length:q.answer.length)&&(partial||a.length===q.answer.length)&&new Set(a).size===a.length&&a.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length);}
 function respond(book,id,value){const s=book.session,q=tasks(book).find(q=>q.id===id);if(s?.status!=='answer'||!q||!validAnswer(q,value,true))throw Error('Lựa chọn ôn chưa hợp lệ.');s.responses[id]=clone(value);}
 function hint(book,id){const s=book.session;if(s?.status!=='answer'||!s.round.includes(id))throw Error('Câu này không đang ôn.');s.hints[id]=true;return book.cards[id].expression;}
 function answerText(q,value){return q.type==='choice'?q.options[value]:format(value.map(i=>q.tokens[i]).join(' '));}
 function correct(q,value){return validAnswer(q,value)&&(q.type==='choice'?value===q.answer:normalize(answerText(q,value).replace(/[.!?]+$/,''))===normalize(q.english.replace(/[.!?]+$/,'')));}
 function addDays(day,days){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
 function schedule(card,result,day){
  const previousToday=card.events.some(e=>e.day===day);
  card.events.push({day,taskId:result.taskId,kind:result.kind,correct:result.correct,assisted:result.assisted,fresh:result.fresh});card.events=card.events.slice(-500);
  if(!result.correct){card.stage=0;card.due=addDays(day,1);return;}
  if(result.assisted){card.stage=Math.max(0,card.stage-1);card.due=addDays(day,1);return;}
  if(!previousToday){card.stage=Math.max(card.stage,Math.min(card.stage+1,result.fresh?5:2));card.due=addDays(day,intervals[card.stage-1]);}
 }
 function submit(book,day=today()){
  requireDay(day);const s=book.session;if(!s||s.status!=='answer')throw Error('Lượt này đã nộp hoặc chưa bắt đầu.');
  const qs=tasks(book);if(qs.some(q=>!validAnswer(q,s.responses[q.id])))throw Error('Hãy trả lời đủ cả lượt trước khi nộp.');
  const results=qs.map(q=>({cardId:q.id,correct:correct(q,s.responses[q.id]),assisted:!!s.hints[q.id],taskId:q.taskId,kind:q.kind,fresh:q.fresh}));
  if(!s.graded)for(const r of results)schedule(book.cards[r.cardId],r,day);
  s.graded=true;s.history.push(results);s.history=s.history.slice(-100);s.status=results.some(r=>!r.correct)?'review':'passed';return results;
 }
 function retry(book){const s=book.session;if(s?.status!=='review')throw Error('Không có câu cần làm lại.');s.round=s.history.at(-1).filter(r=>!r.correct).map(r=>r.cardId);for(const id of s.round)delete s.responses[id];s.status='answer';}
 function finish(book){if(book.session?.status!=='passed')throw Error('Cần hoàn thành lượt ôn trước.');book.session=null;}
 function markdown(book){const lines=['# Sổ tay cụm diễn đạt','',`Đã lưu: ${Object.keys(book.cards).length} cụm.`, ''];for(const c of Object.values(book.cards)){lines.push('## '+c.expression,'',c.meaning||'Chưa có chú giải riêng cho cụm; xem ý Việt của cả câu bên dưới.',`Khung: ${c.frame}`,`Ôn tiếp: ${c.due}`,'');for(const ref of c.contexts)lines.push('> '+ref.en,'',`Ý Việt của câu: ${ref.vi}`,`Phân tích: ${ref.analysis}`,`Nguồn: ${ref.source.title} · ${ref.source.locator} · ${ref.setId}/${ref.itemId}`,'');}return lines.join('\n');}
 const api={storageKey,create,validate,save,idFor,today,candidates,status,due,eligible,start,tasks,respond,hint,submit,retry,finish,answerText,markdown,isComplete:validAnswer};root.PQExpressions=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
