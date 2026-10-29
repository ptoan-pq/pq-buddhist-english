(function(root){
  'use strict';
  const bank=root.PQContextBank,verbs=root.PQVerbBank;
  const phases=['Xây câu và quan hệ nhân quả','Mô tả tâm và hành động đạo đức','Giải thích thực hành và thiền','Giảng giải giáo lý','Diễn đạt trước công chúng'];
  const phaseFor=week=>week<=4?phases[0]:week<=12?phases[1]:week<=16?phases[2]:week<=20?phases[3]:phases[4];
  const sourceFor=b=>({title:b.source.title,locator:`${b.source.id}|${b.source.locators.join(', ')}`});
  const choicesFor=q=>q.options.map((text,i)=>({text,value:i}));
  function item(block,q,index){
    const type=q.type||(block.type==='repair'?'choice':block.type);
    const out={...q,id:q.id||`${block.id}-Q${index+1}`,topic:block.title,pattern:q.pattern||q.focus,analysis:q.analysis,source:sourceFor(block)};
    if(block.type==='repair')out.original=q.original;
    if(type==='choice')out.options=q.options;
    if(type==='gaps'){out.parts=q.parts;out.options=q.options;}
    if(type==='order'){out.tokens=q.tokens;out.answer=q.answer;out.accepted=q.accepted;}
    return out;
  }
  const courses=(bank?.topics||[]).map(topic=>({
    id:`context-${topic.id.toLowerCase()}`,week:topic.week,weekId:topic.id,version:`context-bank-v3-${topic.week}`,previousVersion:`context-bank-v1-${topic.week}`,replacedVersion:`context-bank-v2-${topic.week}`,
    storageKey:`pq-english-context-${topic.id}-verbs-v2`,previousStorageKeys:[`pq-english-context-${topic.id}-verbs-v1`,`pq-english-${topic.id}-v1`],freeSets:true,
    title:`Chủ điểm ${topic.week} — ${topic.title}`,subtitle:topic.function,phase:topic.phase||phaseFor(topic.week),targets:topic.targets,
    sets:topic.blocks.map((block,i)=>({
      id:block.id,title:block.title,phase:topic.phase||phaseFor(topic.week),type:block.type==='repair'?'choice':block.type,
      originalType:block.type,baseItemCount:5,instruction:'Đọc ngữ cảnh rồi làm 5 câu cũ và 5 câu chọn động từ phù hợp nhất để diễn đạt đúng ý nguồn. Nộp đủ 10 câu để xem phân tích cả gói; bạn được đổi gói bất kỳ lúc nào.',
      context:{title:block.title,vietnamese:block.source.paragraphs.join('\n\n'),translation:block.translation.join('\n\n'),source:sourceFor(block)},
      items:[...block.questions,...(verbs?.blocks[block.id]||[])].map((q,j)=>item(block,q,j))
    }))
  }));
  root.PQContextCourses=courses;
  if(typeof module!=='undefined')module.exports=courses;
})(typeof globalThis!=='undefined'?globalThis:this);
