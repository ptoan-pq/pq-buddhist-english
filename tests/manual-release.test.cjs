'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const {assemble,loadBank}=require('../authoring/build-manual-preview.cjs');
const E=require('../engine.js'),P=require('../project.js');
const sandbox={window:{}};
for(const file of ['context-bank.js','context-verbs.js','advanced-verbs.js'])vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'..',file),'utf8'),sandbox);
Object.assign(globalThis,JSON.parse(JSON.stringify(sandbox.window)));
const {main:course}=require('../verb-lessons.js');
test('release contains all 288 authored sets, all source blocks, and no generated replacements',()=>{
  const authored=assemble(),served=JSON.parse(JSON.stringify(sandbox.window.PQAdvancedVerbs.modules.filter(m=>m.id.startsWith('M'))));
  assert.equal(authored.length,288);assert.equal(authored.flatMap(m=>m.items).length,1440);
  assert.deepEqual(authored.map(m=>m.id),Array.from({length:288},(_,i)=>`M${String(i+1).padStart(3,'0')}`));
  assert.deepEqual(authored.map(m=>m.sourceBlockId).sort(),Array.from(loadBank().topics.flatMap(t=>t.blocks),b=>b.id).sort());
  assert.deepEqual(served,authored);
  for(const m of served)for(const q of m.items){assert(!q.prompt.includes('Chọn động từ'));assert(!q.prompt.includes('Chỉ một đáp án'));assert.equal(q.assessmentMode,'single-best-verb');}
});
test('the 72 original specialist questions are byte-for-byte preserved as data',()=>{
  const original=JSON.parse(JSON.stringify(sandbox.window.PQAdvancedVerbs.modules.filter(m=>m.id.startsWith('V'))));
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex'),'8c0fbb1b747f812dfd2a41ff06e6913305d1c2d263c7ab8737b1a2039afe1403');
});
test('v3 progress keeps unchanged specialist answers but gives no credit to new authored questions',()=>{
  const old={...course,version:'verb-mastery-v3',sets:course.sets.slice(0,12)};
  const state=E.create(old),v=old.sets[0];
  for(const q of v.items)E.saveResponse(old,state,v.id,q.id,q.answer);
  E.submit(old,state);
  state.sets.N001={...E.record(course.sets[12]),passedItems:['N001-Q1'],status:'passed'};
  const snapshot=JSON.stringify(state),migrated=P.migrateSubset(course,[state]);
  assert.equal(JSON.stringify(state),snapshot);
  assert.equal(migrated.sets.V01.status,'passed');
  assert.equal(E.statistics(course,migrated).passed,6);
  assert(course.sets.filter(s=>s.id.startsWith('M')).every(s=>!migrated.sets[s.id]?.passedItems.length));
  assert.doesNotThrow(()=>E.validate(course,migrated));
});
