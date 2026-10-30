'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const rows=require('../authoring/reviewed-verb-sets.cjs');
const drafts=require('../authoring/manual-drafts.cjs');
const {assemble,markdown,loadBank,quoteFromSource}=require('../authoring/build-manual-preview.cjs');
const E=require('../engine.js');

test('hand-authored batch has five distinct verb tasks and a rationale per option',()=>{
  assert(rows.length>0);
  const ids=new Set(),blocks=new Set(drafts.map(x=>x[0]));
  for(const m of rows){
    assert(!ids.has(m.id),m.id);ids.add(m.id);
    assert(!blocks.has(m.sourceBlockId),m.sourceBlockId);blocks.add(m.sourceBlockId);
    assert.equal(m.items.length,5);
    assert.equal(new Set(m.items.map(q=>(q.taskKind==='expression-choice'?q.options[q.answer]:q.sentence).toLowerCase().replace(/[\p{P}\p{S}]/gu,'').trim())).size,5);
    assert.equal(new Set(m.items.map(q=>q.sourceCue)).size,5);
    assert.equal(new Set(m.items.map(q=>q.targetVietnamese)).size,5);
    assert.equal(new Set(m.items.map(q=>q.dimension)).size,5);
    for(const q of m.items){
      assert(q.targetVietnamese&&q.targetVietnamese.length<220);
      assert.equal(new Set(q.options).size,4);
      assert.equal(q.rationales.length,4);
      for(const [i,reason]of q.rationales.entries()){
        assert(reason.startsWith(q.options[i]+':'),`${m.id}: rationale must identify its option`);
        assert(reason.length>40,`${m.id}: explain a meaningful contrast`);
      }
      assert(!/As the passage puts it|The English predicate should be|A careful reader can/.test(q.sentence));
    }
  }
});

test('preview prints each whole passage once, with only short Vietnamese targets on cards',()=>{
  const modules=assemble(),md=markdown(modules);
  for(const m of modules){
    assert.equal(md.replace(/^> /gm,'').split(m.context.vietnamese).length-1,1,m.id);
    for(const q of m.items){
      assert(!q.prompt.includes(m.context.vietnamese));
      assert(q.prompt.includes(q.targetVietnamese));
      assert.equal(q.sentence.split('___').length,2);
      assert(m.context.vietnamese.includes(q.evidence));
      assert.equal(q.rationales.length,q.options.length);
      for(let i=0;i<4;i++)assert(q.rationales[i].startsWith(q.options[i]+':'));
    }
  }
});

test('new tasks do not copy the basic verb questions or their complete option sets',()=>{
  const sandbox={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../context-verbs.js'),'utf8'),sandbox);
  for(const m of assemble())for(const q of m.items){
    const old=sandbox.window.PQVerbBank.blocks[m.sourceBlockId];
    assert(old);
    for(const prior of old){
      assert.notEqual(q.prompt,prior.prompt);
      assert.notEqual(q.sentence,prior.sentence,`${q.id}: copied basic frame`);
      assert.notDeepEqual([...q.options].sort(),[...prior.options].sort(),`${q.id}: copied basic alternatives`);
    }
  }
});

test('packaging preserves authored text and five-item delayed feedback behavior',()=>{
  const c={id:'manual-preview',version:1,freeSets:true,sets:assemble().map(m=>({...m,type:'choice'}))};
  const state=E.create(c);
  for(const [index,set]of c.sets.entries()){
    E.openSet(c,state,index);
    for(const q of set.items.slice(0,4))E.saveResponse(c,state,set.id,q.id,q.answer);
    assert.throws(()=>E.submit(c,state),/đủ cả bộ/);
    const q=set.items[4];
    const notPreferred=[0,1,2,3].find(j=>!(q.accepted||[q.answer]).includes(j));
    E.saveResponse(c,state,set.id,q.id,notPreferred);
    assert.equal(E.submit(c,state).wrong.length,1);
    E.retry(c,state);
    assert.deepEqual(state.sets[set.id].round,[q.id]);
    E.saveResponse(c,state,set.id,q.id,q.answer);
    assert.equal(E.submit(c,state).wrong.length,0);
  }
  assert.equal(E.statistics(c,state).passed,c.sets.length*5);
  assert.doesNotThrow(()=>E.validate(c,JSON.parse(JSON.stringify(state))));
  assert.equal(loadBank().topics.length,24);
});

test('packaging rejects missing evidence, repeated frames, and detached explanations',()=>{
  const copy=()=>JSON.parse(JSON.stringify(rows.slice(0,1)));
  const absent=copy();absent[0].items[0].sourceCue='Không có câu này trong nguồn.';
  assert.throws(()=>assemble(absent),/source cue absent/);
  const repeated=copy();repeated[0].items[1].sentence=repeated[0].items[0].sentence;
  assert.throws(()=>assemble(repeated),/repeated frame/);
  const unbound=copy();unbound[0].items[0].rationales.reverse();
  assert.throws(()=>assemble(unbound),/unbound rationale/);
});

test('source-aligned sets quote the passage rather than adding translation advice',()=>{
  const aligned=rows.filter(m=>m.sourceAlignment==='quote-and-english-checked');
  assert(aligned.some(m=>m.id==='M129'),'reported set must be corrected');
  const bank=loadBank();
  const blocks=new Map(bank.topics.flatMap(t=>t.blocks).map(b=>[b.id,b]));
  for(const set of aligned){
    const source=blocks.get(set.sourceBlockId).source.paragraphs.join('\n\n');
    for(const q of set.items)assert(source.includes(q.targetVietnamese),set.id+': quote must be verbatim');
  }
  const bad=JSON.parse(JSON.stringify(aligned.slice(0,1)));
  bad[0].items[0].targetVietnamese+='; điều này chưa có nghĩa muốn nắm quyền điều khiển.';
  assert.throws(()=>assemble(bad),/target quote absent/);
});

test('every learner-facing Vietnamese target is a verbatim source span',()=>{
  for(const set of assemble())for(const q of set.items){
    assert(set.context.vietnamese.includes(q.targetVietnamese),q.id);
    assert(q.targetVietnamese.includes(q.sourceCue),q.id);
    assert(q.prompt.includes(`“${q.targetVietnamese}”`),q.id);
    assert.equal(q.evidence,q.targetVietnamese);
  }
  const reported=assemble().find(m=>m.id==='M129').items[0];
  assert.equal(reported.targetVietnamese,'Ta chỉ thích đến nơi đâu mà ta được tôn trọng');
  assert(!reported.prompt.includes('nắm quyền điều khiển'));
});

test('source quotation preserves wording and punctuation without making new content',()=>{
  const text='Câu mở đầu. Ta chỉ thích đến nơi được tôn trọng, và tránh xa nơi bị coi thường. Câu kết.';
  assert.equal(quoteFromSource(text,'thích đến nơi'),
    'Ta chỉ thích đến nơi được tôn trọng, và tránh xa nơi bị coi thường.');
  assert.equal(quoteFromSource(text,'tránh xa','và tránh xa nơi bị coi thường.'),
    'và tránh xa nơi bị coi thường.');
  assert.throws(()=>quoteFromSource(text,'Không có trong nguồn'),/source cue absent/);
});

test('best-fit questions preserve valid alternatives, criteria, and tied preferences after shuffle',()=>{
  const set=assemble().find(m=>m.id==='M129');
  assert.equal(set.assessmentMode,'best-fit-among-valid-alternatives');
  for(const q of set.items){
    assert.deepEqual([...q.validAnswers].sort(),[0,1,2,3]);
    assert(q.selectionCriterion.length>30);
    assert(q.preferredAnswers.includes(q.answer));
    for(const index of q.preferredAnswers)assert(E.isCorrect(q,index));
    assert(q.analysis.includes('Cả bốn cách đều dùng được'));
  }
  const distance=set.items[1];
  assert.deepEqual(distance.preferredAnswers.map(i=>distance.options[i]).sort(),['stay away from','steer clear of']);
  const gift=set.items[3];
  assert.equal(gift.accepted.length,2);
  assert(markdown([set]).includes('Ưu tiên'));
  const bad=JSON.parse(JSON.stringify(rows.filter(m=>m.id==='M129')));
  bad[0].items[0].validAnswers=[0];
  assert.throws(()=>assemble(bad),/all four alternatives must be valid/);
});

test('whole-expression tasks offer complete sentences without a fixed verb-gap frame',()=>{
  const sets=assemble().filter(s=>s.items.some(q=>q.taskKind==='expression-choice'));
  assert(sets.length>0);
  for(const set of sets)for(const q of set.items.filter(q=>q.taskKind==='expression-choice')){
    assert.equal(q.assessmentMode,'best-fit-among-valid-alternatives');
    assert(!q.prompt.includes('___'));
    assert(q.options.every(s=>/[.!?]$/.test(s)&&s.split(/\s+/).length>=4));
    assert(q.selectionCriterion.length>30);
    assert(set.context.vietnamese.includes(q.targetVietnamese));
  }
});
