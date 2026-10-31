'use strict';
// Export the authored translation course for inspection; no question generation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../engine.js'),sandbox={window:null};sandbox.window=sandbox;vm.createContext(sandbox);
for(const file of ['advanced-verbs.js','translation-units-v2.js','translation-course.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox);
const course=sandbox.PQTranslationCourse,out=['# Dịch theo ý — Không word by word — v2','','12 gói × 5 yêu cầu = 60 bài dịch. Mỗi yêu cầu gồm 1–3 câu nguồn; ngữ cảnh chung giữ đầy đủ đoạn gốc. Dựa vào nguồn Việt và đối chiếu theo Janna Translation. Đây là bài dịch có thẻ hỗ trợ, không thay thế khả năng tự viết.',''];
for(const set of course.sets){
  out.push(`## ${set.id} — ${set.title}`,``,`${set.mode} · ${set.context.source.title} · ${set.context.source.locator}`,'',set.context.vietnamese.split('\n\n').map(p=>'> '+p).join('\n\n'),'','Mỗi gói nộp đủ 5 câu trước khi mở phản hồi. Gợi ý tối đa 3 từ/câu, mỗi lần đúng một từ.','');
  for(const q of set.items){out.push(`### ${q.id} — ${q.sourceSentenceCount} câu nguồn`,'',q.prompt,'');if(q.original)out.push('Bản dịch sát chữ cần sửa: '+q.original,'');out.push('Các thẻ (có thẻ dư):','',E.shuffled(q.chunks.length,q.id).map(i=>'`'+q.chunks[i].map(a=>q.tokens[a]).join(' ')+'`').join(' · '),'');}
  out.push('<details>','<summary>Bản dịch và phân tích cả gói</summary>','');
  for(const q of set.items){out.push(`### ${q.id}`,'',E.sequence(set,q,q.answer),'',q.analysis,'','Cụm cần nhớ: '+q.pattern,'');if(q.accepted.length>1)out.push('Trật tự khác được chấp nhận:',...q.accepted.slice(1).map(a=>'- '+E.sequence(set,q,a)),'');}
  out.push('</details>','');
}
const target=path.resolve(process.argv[2]||path.join(__dirname,'../../outputs/meaning-translation-v2/QUESTIONS-60.md'));
fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,out.join('\n'));console.log(target);
