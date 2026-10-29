const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../engine.js'),P=require('../project.js'),sandbox={window:{}};
for(const file of ['context-bank.js','context-verbs.js','advanced-verbs.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox);
Object.assign(globalThis,JSON.parse(JSON.stringify(sandbox.window)));
const topics=require('../context-lessons.js'),{main:verbs,archive}=require('../verb-lessons.js'),all=[...topics,verbs,archive];
function previousCombined(){const c=topics[0];return {...c,version:'context-bank-v3-1',previousSources:null,sets:c.sets.map(s=>({...s,items:[...s.items,...archive.sets.find(v=>v.id===s.id).items]}))};}
test('Two independent programs expose unchanged topics, a new advanced verb course, and a labelled old archive',()=>{
  assert.equal(new Set(all.map(c=>c.programId)).size,2);
  assert.equal(new Set(all.map(c=>P.key(c))).size,all.length);
  assert.equal(topics.flatMap(c=>c.sets.flatMap(s=>s.items)).length,1440);
  assert.equal(verbs.sets.length,300);assert.equal(archive.archive,true);
  assert.equal(verbs.sets.flatMap(s=>s.items).length,1512);
  assert.equal(archive.sets.flatMap(s=>s.items).length,1440);
  assert(!topics.some(c=>c.sets.some(s=>s.items.some(q=>q.group?.startsWith('verb-')))));
});
test('All 1512 advanced questions have complete frames, recalled Vietnamese and source-supported alternatives',()=>{
  const ids=new Set(),dimensions=new Set();
  for(const set of verbs.sets){assert(set.items.length===5||set.items.length===6);for(const q of set.items){
    assert(!ids.has(q.id));ids.add(q.id);dimensions.add(q.dimension);
    assert(q.difficulty.startsWith('advanced-contextual'));assert.equal(q.sentence.split('___').length,2);
    assert(q.prompt.includes(`“${q.evidence}”`));assert(set.context.vietnamese.includes(q.evidence));assert(q.evidence.includes(q.sourceCue));
    assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
    assert(q.analysis.includes(q.sentence.replace('___',q.options[q.answer])));
    assert(q.analysis.split('\n')[1].length>70);assert(q.source.locator&&q.source.title);
  }}assert.equal(ids.size,1512);assert(dimensions.size>=24);
  assert.equal(verbs.sets.filter(s=>s.id.startsWith('N')).length,288);
  assert.equal(verbs.sets.filter(s=>s.id.startsWith('N')).flatMap(s=>s.items).filter(q=>q.group==='verb-advanced-new').length,1440);
});
test('Advanced sets submit six together, retry only wrong answers, and allow free packet selection',()=>{
  const s=E.create(verbs),set=verbs.sets[0];
  for(const q of set.items.slice(0,5))E.saveResponse(verbs,s,set.id,q.id,q.answer);
  assert.throws(()=>E.submit(verbs,s),/đủ cả bộ/);
  const last=set.items[5];E.saveResponse(verbs,s,set.id,last.id,(last.answer+1)%4);E.submit(verbs,s);E.retry(verbs,s);
  assert.deepEqual(s.sets[set.id].round,[last.id]);
  E.openSet(verbs,s,11);E.saveResponse(verbs,s,verbs.sets[11].id,verbs.sets[11].items[0].id,verbs.sets[11].items[0].answer);
  const restored=E.validate(verbs,JSON.parse(JSON.stringify(s)));E.openSet(verbs,restored,0);
  E.saveResponse(verbs,restored,set.id,last.id,last.answer);assert.equal(E.submit(verbs,restored).wrong.length,0);
  assert.equal(restored.sets[verbs.sets[11].id].responses[verbs.sets[11].items[0].id],verbs.sets[11].items[0].answer);
});
test('Displayed answer positions are not biased by using the same shuffle twice',()=>{
  const count=[0,0,0,0];for(const q of verbs.sets.flatMap(s=>s.items))count[E.shuffled(4,q.id).indexOf(q.answer)]++;
  assert(Math.max(...count)-Math.min(...count)<=100,JSON.stringify(count));assert(Math.min(...count)>=250,JSON.stringify(count));
});
test('Splitting combined progress retains correct original and archived items but awards no advanced credit',()=>{
  const old=previousCombined(),s=E.create(old),set=old.sets[0];
  for(const [i,q]of set.items.entries())E.saveResponse(old,s,set.id,q.id,i===9?(q.answer+1)%4:q.answer);
  E.submit(old,s);E.openSet(old,s,11);
  const q=old.sets[11].items[0];E.saveResponse(old,s,old.sets[11].id,q.id,q.answer);
  const before=JSON.stringify(s),base=P.migrateSubset(topics[0],[s]),review=P.migrateSubset(archive,[s]);
  assert.equal(JSON.stringify(s),before);assert.equal(base.active,11);
  assert.equal(base.sets[set.id].passedItems.length,5);assert.equal(base.sets[set.id].status,'passed');
  assert.equal(review.sets[set.id].passedItems.length,4);assert.equal(review.sets[set.id].status,'answer');
  assert.deepEqual(base.sets[old.sets[11].id].responses,{[q.id]:q.answer});
  assert.equal(E.statistics(verbs,E.create(verbs)).passed,0);
  assert.doesNotThrow(()=>E.validate(topics[0],base));assert.doesNotThrow(()=>E.validate(archive,review));
});
test('Old combined JSON imports into both programs and new backups round trip without mixing course IDs',()=>{
  const old=previousCombined(),s=E.create(old),q=old.sets[0].items[5];E.saveResponse(old,s,old.sets[0].id,q.id,q.answer);
  const restored=P.validateBackup(all,{format:'pq-english-project',schema:2,selected:old.id,progress:{[old.id]:s}});
  assert.equal(restored.selected,topics[0].id);assert.equal(restored.progress[archive.id].sets[old.sets[0].id].responses[q.id],q.answer);
  const fresh=E.create(verbs),v=verbs.sets[0].items[0];E.saveResponse(verbs,fresh,verbs.sets[0].id,v.id,v.answer);
  restored.progress[verbs.id]=fresh;const exported=P.exportProject(all,restored.progress,verbs.id),again=P.validateBackup(all,JSON.parse(JSON.stringify(exported)));
  assert.equal(again.selected,verbs.id);assert.deepEqual(again.progress[verbs.id].sets.V01.responses,{[v.id]:v.answer});
  assert.equal(again.progress[archive.id].sets[old.sets[0].id].responses[q.id],q.answer);
  const corrupt=JSON.parse(JSON.stringify(s));corrupt.sets[old.sets[0].id].responses[q.id]=99;
  assert.throws(()=>P.migrateSubset(archive,[corrupt]));
});
test('Every advanced packet completes, restores and exports source-aware Markdown',()=>{
  const s=E.create(verbs);for(const set of verbs.sets){for(const q of set.items)E.saveResponse(verbs,s,set.id,q.id,q.answer);E.submit(verbs,s);E.advance(verbs,s);}
  assert(P.complete(verbs,s));assert.equal(E.statistics(verbs,s).passed,1512);
  assert.doesNotThrow(()=>E.validate(verbs,JSON.parse(JSON.stringify(s))));assert(E.markdown(verbs,s).includes(verbs.title));
});
