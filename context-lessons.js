(function(root){
  'use strict';
  const bank=root.PQContextBank;
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
    id:`context-${topic.id.toLowerCase()}`,programId:'dharma',week:topic.week,weekId:topic.id,version:`context-base-v1-${topic.week}`,
    storageKey:`pq-english-context-${topic.id}-base-v1`,freeSets:true,
    previousSources:[
      {key:`pq-english-context-${topic.id}-verbs-v2`,courseId:`context-${topic.id.toLowerCase()}`,version:`context-bank-v3-${topic.week}`},
      {key:`pq-english-context-${topic.id}-verbs-v1`,courseId:`context-${topic.id.toLowerCase()}`,version:`context-bank-v2-${topic.week}`},
      {key:`pq-english-${topic.id}-v1`,courseId:`context-${topic.id.toLowerCase()}`,version:`context-bank-v1-${topic.week}`}
    ],
    title:`Chủ điểm ${topic.week} — ${topic.title}`,subtitle:topic.function,phase:topic.phase||phaseFor(topic.week),targets:topic.targets,
    sets:topic.blocks.map((block,i)=>({
      id:block.id,title:block.title,phase:topic.phase||phaseFor(topic.week),type:block.type==='repair'?'choice':block.type,
      originalType:block.type,instruction:'Đọc ngữ cảnh rồi hoàn thành 5 câu của gói. Nộp đủ để xem bản dịch và phân tích. Phần luyện động từ đã có khóa riêng; bạn được chọn gói bất kỳ.',
      context:{title:block.title,vietnamese:block.source.paragraphs.join('\n\n'),translation:block.translation.join('\n\n'),source:sourceFor(block)},
      items:block.questions.map((q,j)=>item(block,q,j))
    }))
  }));
  root.PQContextCourses=courses;
  if(typeof module!=='undefined')module.exports=courses;
})(typeof globalThis!=='undefined'?globalThis:this);
