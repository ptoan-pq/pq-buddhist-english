const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js'),P=require('../project.js');
const choice=id=>({id,options:['sustain','initiate','restore','reinforce'],answer:0,pattern:'sustain',topic:'verb',analysis:'Duy trì điều đã có.',source:{title:'Test',locator:'test'}});
const old={id:'context-test',weekId:'W00',version:'1',sets:[1,2].map(i=>({id:`B${i}`,type:'order',title:'Test',items:[1,2].map(j=>({id:`B${i}.${j}`,tokens:['We','practice.'],answer:[0,1],source:{title:'Test',locator:'test'}}))}))};
const expanded={...old,version:'2',previousVersion:'1',storageKey:'context-test-v2',previousStorageKey:'context-test-v1',sets:old.sets.map(s=>({...s,baseItemCount:2,items:[...s.items,{...choice(`${s.id}.3`),type:'choice'}]}))};
test('A set accepts its original ordering items and new verb-choice items together',()=>{
  const s=E.create(expanded),set=expanded.sets[0];
  for(const q of set.items.slice(0,2))E.saveResponse(expanded,s,set.id,q.id,q.answer);
  assert.throws(()=>E.submit(expanded,s),/đủ cả bộ/);
  E.saveResponse(expanded,s,set.id,set.items[2].id,0);
  assert.equal(E.submit(expanded,s).wrong.length,0);
  assert.equal(E.sequence(set,set.items[2],0),'sustain');
});
test('Expansion preserves every previously visited set and its historical answers',()=>{
  const s=E.create(old);
  for(const q of old.sets[0].items)E.saveResponse(old,s,'B1',q.id,q.answer);
  E.submit(old,s);E.advance(old,s);
  E.saveResponse(old,s,'B2','B2.1',[0,1]);
  const migrated=E.validate(expanded,JSON.parse(JSON.stringify(s)));
  assert.equal(migrated.courseVersion,'2');assert.equal(migrated.active,0);
  assert.deepEqual(migrated.sets.B1.round,['B1.3']);
  assert.equal(migrated.sets.B1.passedItems.length,2);
  assert.deepEqual(migrated.sets.B1.history,s.sets.B1.history);
  assert.deepEqual(migrated.sets.B2.responses,s.sets.B2.responses);
  assert.doesNotThrow(()=>E.validate(expanded,migrated));
  E.saveResponse(expanded,migrated,'B1','B1.3',0);E.submit(expanded,migrated);E.advance(expanded,migrated);
  assert.deepEqual(migrated.sets.B2.responses['B2.1'],[0,1]);
});
test('Expansion keeps an old wrong answer in history and does not grant a PASS',()=>{
  const s=E.create(old);E.saveResponse(old,s,'B1','B1.1',[1,0]);E.saveResponse(old,s,'B1','B1.2',[0,1]);E.submit(old,s);
  const m=E.validate(expanded,s);assert.equal(m.sets.B1.status,'answer');
  assert.deepEqual(m.sets.B1.round,['B1.1','B1.3']);
  assert.deepEqual(m.sets.B1.history[0].responses['B1.1'],[1,0]);
  assert.throws(()=>E.advance(expanded,m),/PASS/);
});
test('Expanded storage uses a new key so the original saved data is retained',()=>{
  assert.equal(P.key(expanded),'context-test-v2');assert.equal(P.previousKey(expanded),'context-test-v1');
});
test('Free packet selection preserves unfinished answers in sparse, independent packets',()=>{
  const course={...expanded,freeSets:true,sets:[...expanded.sets,{...expanded.sets[0],id:'B3',items:[choice('B3.1')],type:'choice'}]};
  const s=E.create(course);E.saveResponse(course,s,'B1','B1.1',[0,1]);
  E.openSet(course,s,2);E.saveResponse(course,s,'B3','B3.1',1);
  let restored=E.validate(course,JSON.parse(JSON.stringify(s)));
  assert(!Object.hasOwn(restored.sets,'B2'));assert.deepEqual(restored.sets.B1.responses['B1.1'],[0,1]);
  assert.equal(restored.sets.B3.responses['B3.1'],1);
  E.openSet(course,restored,0);E.advance(course,restored);
  assert.equal(restored.active,1);assert.deepEqual(restored.sets.B1.responses['B1.1'],[0,1]);
  assert.doesNotThrow(()=>E.validate(course,restored));
});
