(function(root){
  'use strict';
  const topics=[
    ['Định nghĩa và phân loại','Define and classify',['mean','refer to','consist of','be regarded as'],['S01','S09']],
    ['Nguyên nhân và kết quả','Cause and result',['arise from','stem from','give rise to','result in'],['S07','S08','S09']],
    ['Điều kiện và sự phụ thuộc','Conditions and dependence',['condition','depend on','be shaped by','be subject to'],['S07','S08']],
    ['Duy trì và chấm dứt','Continuation and cessation',['sustain','reinforce','perpetuate','subside','cease'],['S09','S13']],
    ['Tri giác và nhận biết','Perception and knowing',['notice','recognize','discern','become aware of'],['S04','S13']],
    ['Vô minh và hiểu lầm','Ignorance and misunderstanding',['overlook','fail to see','mistake A for B','obscure'],['S01','S09']],
    ['Ham muốn và chấp thủ','Desire and attachment',['crave','cling to','grasp at','identify with'],['S09','S13']],
    ['Cảm xúc và phản ứng','Emotion and reaction',['trigger','overwhelm','restrain','respond to'],['S06','S13']],
    ['Ý định và lựa chọn','Intention and choice',['intend','incline toward','refrain from','undertake'],['S06','S07']],
    ['Lời nói và ảnh hưởng','Speech and influence',['convey','persuade','encourage','undermine'],['S01','S06','S13']],
    ['Từ bi và giúp đỡ','Compassion and help',['care for','relieve','reach out to','benefit'],['S01','S06']],
    ['Trách nhiệm và sinh kế','Responsibility and livelihood',['contribute to','provide for','fulfil','uphold'],['S03','S06']],
    ['Thân và sự chú ý','Body and attention',['attend to','bring attention to','remain aware of'],['S02','S04','S05']],
    ['Hơi thở và hướng dẫn thực hành','Breath and instructions',['inhale','exhale','settle','regulate','allow'],['S02','S04','S05','S12']],
    ['Tu dưỡng và vượt chướng ngại','Cultivation and obstacles',['cultivate','maintain','deepen','overcome'],['S02','S04','S12']],
    ['Tiến triển, dấu hiệu và sự thận trọng','Progress, signs, and caution',['indicate','suggest','distinguish','guard against'],['S04','S12','S11']],
    ['Giải thích khái niệm sáng rõ','Clear definitions',['put simply','in this context','by X we mean'],['S01','S09']],
    ['Chuỗi diễn tiến','Process chains',['set in motion','lead to','in turn','thereby'],['S07','S08','S09']],
    ['Đối chiếu và làm rõ ngộ nhận','Contrast and misconception',['distinguish A from B','assume','misinterpret'],['S01','S09']],
    ['Giới hạn phát biểu và lập luận','Qualification and argument',['to some extent','provided that','this does not mean'],['S09','S13']],
    ['Hỏi đáp và giảng giải trước công chúng','Q&A and public teaching',['address a question','clarify','illustrate','sum up'],['S01','S12']],
    ['Xã hội và đối thoại liên tôn','Society and interfaith dialogue',['reconcile','bridge','respect','coexist'],['S01','S06']],
    ['Ví von và diễn giải giàu hình ảnh','Analogy and literary explanation',['evoke','embody','mirror','unfold'],['S06','S07','S13']],
    ['Tổng hợp cuối khóa','Capstone synthesis',['signpost','develop','qualify','conclude'],['approved sources']]
  ];
  const phases=['Xây câu và quan hệ nhân quả','Mô tả tâm và hành động đạo đức','Giải thích thực hành và thiền','Giảng giải giáo lý','Diễn đạt trước công chúng'];
  root.PQCurriculum={id:'buddhist-english-expression-coach-v4',version:2,source:'references/curriculum.md',weeks:topics.map((t,i)=>({week:i+1,id:`W${String(i+1).padStart(2,'0')}`,title:t[0],function:t[1],targets:t[2],likelySources:t[3],phase:phases[i<4?0:i<12?1:i<16?2:i<20?3:4]}))};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.PQCurriculum;
})(typeof globalThis!=='undefined'?globalThis:this);
