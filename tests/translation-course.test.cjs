'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const E=require('../engine.js'),P=require('../project.js'),s={window:null};s.window=s;vm.createContext(s);
for(const file of ['advanced-verbs.js','translation-units-v2.js','translation-sources-new.js','translation-batch-01.js','translation-batch-02.js','translation-batch-03.js','translation-batch-04.js','translation-batch-05.js','translation-batch-06.js','translation-batch-07.js','translation-batch-08.js','translation-batch-09.js','translation-batch-10.js','translation-batch-11.js','translation-batch-12.js','translation-batch-13.js','translation-course.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),s);
const course=JSON.parse(JSON.stringify(s.PQTranslationCourse));
test('272 independently selectable packets contain 1360 original-source targets and authored phrase choices',()=>{
  assert.equal(course.sets.length,272);assert.equal(course.sets.flatMap(s=>s.items).length,1360);
  assert.equal(new Set(course.sets.map(s=>s.context.vietnamese)).size,272);
  assert(new Set(course.sets.map(s=>s.mode)).size>=4);
  const state=E.create(course);E.openSet(course,state,11);assert.equal(E.current(course,state).id,'D12');
  for(const set of course.sets){assert.equal(set.items.length,5);assert(set.context.source.locator);
    assert.equal(new Set(set.items.map(q=>q.targetVietnamese)).size,5);
    for(const q of set.items){assert(set.context.vietnamese.includes(q.targetVietnamese));assert(!q.prompt.includes('Ghép'));assert(q.chunks.filter(chunk=>!chunk.every(a=>q.answer.includes(a))).length>=2);assert(q.chunks.some(chunk=>chunk.length>1));assert(q.tokens.length>q.answer.length);assert(q.analysis.length>100);for(const a of q.accepted){assert(E.isComplete(set,q,a));assert(E.isCorrect(q,a));}}
  }
  const monk=course.sets[0].items[2];assert.equal(E.sequence(course.sets[0],monk,monk.answer),'Disillusioned with his fellow practitioners, a monk drifts into worldly life.');
});

test('v1 imports retain unchanged PASS answers and spent hints but not revised multi-sentence answers',()=>{
  const old=require('./fixtures/translation-v1-progress.json');
  const snapshot=JSON.stringify(old),restored=P.migrateSubset(course,[old]);
  assert.equal(JSON.stringify(old),snapshot);
  assert.equal(E.statistics(course,restored).passed,3);
  assert.equal(restored.sets.D01.hints['D01-Q1'].length,1);
  assert.equal(restored.sets.D01.status,'answer');
  assert.deepEqual(restored.sets.D01.round,['D01-Q2-r2','D01-Q5-r2']);
  assert(!Object.hasOwn(restored.sets.D01.responses,'D01-Q2-r2'));
  assert.doesNotThrow(()=>E.validate(course,restored));
  const backup={format:'pq-english-project',schema:2,selected:course.id,progress:{[course.id]:old}};
  assert.equal(P.validateBackup([course],backup).progress[course.id].sets.D01.hints['D01-Q1'].length,1);
});
test('all published translations support chunk clicks, delayed whole-packet feedback and project backup',()=>{
  const state=E.create(course);
  for(const [index,set]of course.sets.entries()){
    E.openSet(course,state,index);
    for(const [i,q]of set.items.entries()){
      for(const chunk of q.chunks.map((c,j)=>({c,j})).filter(({c})=>c.every(n=>q.answer.includes(n))))E.placeChunk(course,state,set.id,q.id,chunk.j);
      assert(E.isCorrect(q,state.sets[set.id].responses[q.id]),q.id);
      if(i<4)assert.throws(()=>E.submit(course,state),/đủ cả bộ/);
    }
    assert.equal(E.submit(course,state).wrong.length,0);
  }
  assert.equal(E.statistics(course,state).independentPassed,1360);
  const exported=P.exportProject([course],{[course.id]:state},course.id),restored=P.validateBackup([course],JSON.parse(JSON.stringify(exported)));
  assert(P.complete(course,restored.progress[course.id]));assert(E.markdown(course,state).includes('Đổi trục câu'));
});

test('the first expansion preserves all existing progress, hints and item IDs',()=>{
  const legacy={...course,sets:course.sets.slice(0,12)},state=E.create(legacy),set=legacy.sets[0],q=set.items[0];
  E.hintWord(legacy,state,set.id,q.id);
  const snapshot=JSON.stringify(state),restored=E.validate(course,JSON.parse(snapshot));
  assert.deepEqual(restored.sets.D01.responses,state.sets.D01.responses);
  assert.deepEqual(restored.sets.D01.hints,state.sets.D01.hints);
  assert.equal(restored.active,0);
  E.openSet(course,restored,31);assert.equal(E.current(course,restored).id,'D32');
  E.openSet(course,restored,0);assert.deepEqual(restored.sets.D01.hints,state.sets.D01.hints);
  assert.equal(JSON.stringify(state),snapshot);
});
test('authored alternative orders and identical word tiles are not rejected just for differing token IDs',()=>{
  const q=course.sets[7].items[0],state=E.create(course);E.openSet(course,state,7);
  E.saveResponse(course,state,'D08',q.id,q.accepted[1]);assert(E.isCorrect(q,state.sets.D08.responses[q.id]));
  const duplicate={type:'compose',tokens:['we','help','we'],answer:[0,1]};assert(E.isCorrect(duplicate,[2,1]));
  assert(!E.isCorrect(duplicate,[1,2]));
});

test('every packet keeps its complete source context and includes two- and three-sentence translation units',()=>{
  const bank=[...s.PQAdvancedVerbs.modules,...(s.PQTranslationSources||[])];
  for(const set of course.sets){
    const original=bank.find(m=>m.context.source.locator===set.context.source.locator&&m.context.vietnamese===set.context.vietnamese);
    assert(original,set.id+': use complete context, not isolated excerpts');
    assert(set.items.some(q=>q.sourceSentenceCount===2),set.id+': two-sentence unit');
    assert(set.items.some(q=>q.sourceSentenceCount===3),set.id+': three-sentence unit');
    assert(set.items.every(q=>[1,2,3].includes(q.sourceSentenceCount)));
  }
});
