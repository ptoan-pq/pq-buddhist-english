'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const E=require('../engine.js'),P=require('../project.js'),s={window:null};s.window=s;vm.createContext(s);
for(const file of ['advanced-verbs.js','translation-course.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),s);
const course=JSON.parse(JSON.stringify(s.PQTranslationCourse));
test('12 independently selectable packets contain 60 original-source targets and authored phrase choices',()=>{
  assert.equal(course.sets.length,12);assert.equal(course.sets.flatMap(s=>s.items).length,60);
  assert.equal(new Set(course.sets.map(s=>s.context.vietnamese)).size,12);
  assert.equal(new Set(course.sets.map(s=>s.mode)).size,4);
  const state=E.create(course);E.openSet(course,state,11);assert.equal(E.current(course,state).id,'D12');
  for(const set of course.sets){assert.equal(set.items.length,5);assert(set.context.source.locator);
    assert.equal(new Set(set.items.map(q=>q.targetVietnamese)).size,5);
    for(const q of set.items){assert(set.context.vietnamese.includes(q.targetVietnamese));assert(!q.prompt.includes('Ghép'));assert(q.chunks.filter(chunk=>!chunk.every(a=>q.answer.includes(a))).length>=2);assert(q.chunks.some(chunk=>chunk.length>1));assert(q.tokens.length>q.answer.length);assert(q.analysis.length>100);for(const a of q.accepted){assert(E.isComplete(set,q,a));assert(E.isCorrect(q,a));}}
  }
  const monk=course.sets[0].items[2];assert.equal(E.sequence(course.sets[0],monk,monk.answer),'Disillusioned with his fellow practitioners, a monk drifts into worldly life.');
});
test('all 60 translations support chunk clicks, delayed whole-packet feedback and project backup',()=>{
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
  assert.equal(E.statistics(course,state).independentPassed,60);
  const exported=P.exportProject([course],{[course.id]:state},course.id),restored=P.validateBackup([course],JSON.parse(JSON.stringify(exported)));
  assert(P.complete(course,restored.progress[course.id]));assert(E.markdown(course,state).includes('Đổi trục câu'));
});
test('authored alternative orders and identical word tiles are not rejected just for differing token IDs',()=>{
  const q=course.sets[7].items[0],state=E.create(course);E.openSet(course,state,7);
  E.saveResponse(course,state,'D08',q.id,q.accepted[1]);assert(E.isCorrect(q,state.sets.D08.responses[q.id]));
  const duplicate={type:'compose',tokens:['we','help','we'],answer:[0,1]};assert(E.isCorrect(duplicate,[2,1]));
  assert(!E.isCorrect(duplicate,[1,2]));
});
