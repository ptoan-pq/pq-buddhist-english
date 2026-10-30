(function(root){
  'use strict';
  const advanced=root.PQAdvancedVerbs,bank=root.PQContextBank,old=root.PQVerbBank;
  const main={id:'verb-mastery',programId:'verbs',title:'Master động từ — Vận dụng nâng cao',subtitle:'Gần nghĩa, khác sắc thái',version:'verb-mastery-v4',storageKey:'pq-english-verb-mastery-v4',previousSources:[{key:'pq-english-verb-mastery-v3',courseId:'verb-mastery',version:'verb-mastery-v3'},{key:'pq-english-verb-mastery-v2',courseId:'verb-mastery',version:'verb-mastery-v2'},{key:'pq-english-verb-mastery-v1',courseId:'verb-mastery',version:'verb-mastery-v1'}],freeSets:true,
    sets:advanced.modules.map(m=>({...m,type:'choice',instruction:'Đọc ngữ cảnh, chọn động từ/cụm động từ giữ đúng nghĩa câu Việt. Mỗi câu có một đáp án phù hợp nhất. Trả lời đủ cả gói rồi nộp để xem phân tích.'}))};
  const archive={id:'verb-review',programId:'verbs',archive:true,title:'Ôn động từ cơ bản — Bộ câu cũ',subtitle:'Giữ lại để ôn, không tính là nâng cao',version:'verb-review-v1',storageKey:'pq-english-verb-review-v1',freeSets:true,
    previousSources:bank.topics.map(t=>({key:`pq-english-context-${t.id}-verbs-v2`,courseId:`context-${t.id.toLowerCase()}`,version:`context-bank-v3-${t.week}`,setIds:t.blocks.map(b=>b.id)})),
    sets:bank.topics.flatMap(t=>t.blocks.map(b=>({id:b.id,title:b.title,type:'choice',instruction:'Đây là bộ động từ cơ bản từ bản trước, được giữ lại cùng tiến độ để ôn. Muốn luyện các phương án gần nghĩa khó hơn, chọn Master động từ — Vận dụng nâng cao.',
      context:{title:b.title,vietnamese:b.source.paragraphs.join('\n\n'),translation:'',source:{title:b.source.title,locator:`${b.source.id}|${b.source.locators.join(', ')}`}},
      items:old.blocks[b.id].map(q=>({...q,topic:b.title,source:{title:b.source.title,locator:`${b.source.id}|${b.source.locators.join(', ')}`}}))
    })))};
  root.PQVerbCourse=main;root.PQVerbArchive=archive;
  if(typeof module!=='undefined')module.exports={main,archive};
})(typeof globalThis!=='undefined'?globalThis:this);
