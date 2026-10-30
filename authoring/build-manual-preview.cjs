'use strict';
// Packaging only: all Vietnamese targets, English frames, alternatives, and
// explanations must already exist in reviewed-verb-sets.cjs.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const authored=require('./reviewed-verb-sets.cjs');
const drafts=require('./manual-drafts.cjs');
const {shuffled}=require('../engine.js');

function loadBank(){
  const sandbox={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../context-bank.js'),'utf8'),sandbox);
  return sandbox.window.PQContextBank;
}

function assemble(sets=authored,bank=loadBank()){
  const blocks=new Map(bank.topics.flatMap(t=>t.blocks).map(b=>[b.id,b]));
  return sets.map(set=>{
    const block=blocks.get(set.sourceBlockId);
    assert(block,`Missing source: ${set.sourceBlockId}`);
    assert.equal(set.items.length,5,`${set.id}: exactly five authored questions`);
    assert.equal(new Set(set.items.map(q=>q.sentence)).size,5,`${set.id}: repeated frame`);
    assert.equal(new Set(set.items.map(q=>q.sourceCue)).size,5,`${set.id}: repeated source focus`);
    const vietnamese=block.source.paragraphs.join('\n\n');
    const source={title:block.source.title,locator:`${block.source.id}|${block.source.locators.join(', ')}`};
    return {
      id:set.id,title:set.title,sourceBlockId:set.sourceBlockId,
      review:set.review,
      context:{title:block.title,vietnamese,translation:'',source},
      items:set.items.map((q,i)=>{
        const id=`${set.id}-Q${i+1}`;
        assert(vietnamese.includes(q.sourceCue),`${id}: source cue absent`);
        assert.equal(q.sentence.split('___').length,2,`${id}: one blank`);
        assert.equal(q.options.length,4,`${id}: four alternatives`);
        assert.equal(new Set(q.options).size,4,`${id}: repeated alternative`);
        assert.equal(q.rationales.length,4,`${id}: explanation for each alternative`);
        assert(q.targetVietnamese&&q.targetVietnamese.length<220,`${id}: short Vietnamese target required`);
        for(let j=0;j<4;j++)assert(q.rationales[j].startsWith(q.options[j]+':'),`${id}: unbound rationale`);
        assert.equal(q.answer,0,`${id}: authoring answer convention`);
        const order=shuffled(4,crypto.createHash('sha256').update(id).digest('hex'));
        const model=q.sentence.replace('___',q.options[q.answer]);
        return {
          id,type:'choice',group:'verb-hand-authored',difficulty:'advanced-contextual',
          topic:set.title,pattern:q.options[0],dimension:q.dimension,
          sourceCue:q.sourceCue,evidence:q.sourceCue,source,
          targetVietnamese:q.targetVietnamese,sentence:q.sentence,
          prompt:`Câu cần diễn đạt: ${q.targetVietnamese}\n\n${q.sentence}`,
          options:order.map(j=>q.options[j]),answer:order.indexOf(q.answer),
          analysis:`Câu hoàn chỉnh: ${model}\n\n${q.rationales.join('\n\n')}`,
          rationales:order.map(j=>q.rationales[j])
        };
      })
    };
  });
}

function markdown(modules){
  const out=['# Master động từ — bản thảo biên soạn thủ công','',
    'Chưa phát hành. Ngữ cảnh Việt được in một lần cho mỗi gói; mỗi câu hỏi chỉ nhắc câu Việt ngắn cần diễn đạt.',
    'Các gói dưới đây đã được chính người biên soạn rà nguồn và phương án; chưa có người rà độc lập. Không coi kiểm thử cấu trúc là chứng nhận chất lượng ngôn ngữ.',''];
  for(const set of modules){
    out.push(`## ${set.id} — ${set.title}`,'',`Nguồn: ${set.context.source.title} · ${set.context.source.locator}`,'',
      set.context.vietnamese.split('\n\n').map(p=>'> '+p).join('\n\n'),'',
      'Làm cả 5 câu rồi mới mở phần đáp án.','');
    for(const q of set.items)out.push(`### ${q.id}`,'',q.prompt,'',...q.options.map((text,i)=>`- ${String.fromCharCode(65+i)}. ${text}`),'');
    out.push('<details>','<summary>Đáp án và phân tích của cả gói</summary>','');
    for(const q of set.items)out.push(`### ${q.id} — ${String.fromCharCode(65+q.answer)}`,'',q.analysis,'');
    out.push('</details>','');
  }
  return out.join('\n');
}

function writePreview(directory){
  const modules=assemble(),count=modules.flatMap(m=>m.items).length;
  fs.mkdirSync(directory,{recursive:true});
  fs.writeFileSync(path.join(directory,'manual-reviewed-preview.json'),JSON.stringify({status:'unpublished-author-reviewed-draft',modules},null,2)+'\n');
  fs.writeFileSync(path.join(directory,'MANUAL-REVIEWED-PREVIEW.md'),markdown(modules));
  const used=new Set([...drafts.map(d=>d[0]),...modules.map(m=>m.sourceBlockId)]);
  const manifest={
    targetSets:288,targetQuestions:1440,
    authorReviewedSets:modules.length,authorReviewedQuestions:count,
    authorReviewRemainingQuestions:1440-count,
    draftedSetsIncludingLegacy:used.size,
    draftedQuestionsIncludingLegacy:used.size*5,
    undraftedQuestions:(288-used.size)*5,
    preservedSpecialistQuestionsNotCountedTowardNew1440:72,
    legacyDraftSetsAwaitingSemanticRevision:drafts.length,
    legacyDraftQuestionsAwaitingSemanticRevision:drafts.flatMap(d=>d[3]).length,
    notYetDraftedSourceBlocks:loadBank().topics.flatMap(t=>t.blocks).filter(b=>!used.has(b.id)).map(b=>b.id),
    publication:'unchanged',independentLanguageReview:false,
    note:'Author-reviewed drafts are not certified by structural tests. Legacy drafts require semantic revision before release.'
  };
  fs.writeFileSync(path.join(directory,'manual-rewrite-progress.json'),JSON.stringify(manifest,null,2)+'\n');
  return manifest;
}

if(require.main===module){
  const target=process.argv[2]||path.join(__dirname,'../../outputs/context-bank-v1/manual-rewrite-preview');
  const m=writePreview(target);
  console.log(JSON.stringify({authorReviewedSets:m.authorReviewedSets,authorReviewedQuestions:m.authorReviewedQuestions,legacyDraftQuestions:m.legacyDraftQuestionsAwaitingSemanticRevision,publication:m.publication}));
}
module.exports={assemble,markdown,loadBank,writePreview};
