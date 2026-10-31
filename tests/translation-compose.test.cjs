'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js');
const q={id:'T1',type:'compose',tokens:['we','look','for','ways','to','help','look','after'],chunks:[[0],[1,2],[3,4],[5],[6,7]],answer:[0,1,2,3,4,5],pattern:'look for ways to help',analysis:'Look for expresses seeking an opportunity, not looking after someone.',source:{title:'Test source',locator:'test:1'}};
const course={id:'translation',version:1,freeSets:true,sets:[{id:'T',type:'compose',items:[q]}]};
test('clicking chunks builds a translation with unused distractors and supports undo',()=>{
  const s=E.create(course);
  E.placeChunk(course,s,'T','T1',0);
  E.placeChunk(course,s,'T','T1',4);
  assert.equal(E.sequence(course.sets[0],q,s.sets.T.responses.T1),'We look after … … ….');
  E.undoWords(course,s,'T','T1');
  E.placeChunk(course,s,'T','T1',1);
  E.placeChunk(course,s,'T','T1',2);
  E.placeChunk(course,s,'T','T1',3);
  assert.equal(E.sequence(course.sets[0],q,s.sets.T.responses.T1),'We look for ways to help.');
  assert.equal(E.submit(course,s).wrong.length,0);
});

test('a hint places exactly one word, is capped at three, and survives reload and reset',()=>{
  const s=E.create(course);
  E.hintWord(course,s,'T','T1');
  assert.equal(s.sets.T.responses.T1.filter(i=>i!==null).length,1);
  assert.equal(E.sequence(course.sets[0],q,s.sets.T.responses.T1),'We … … … … ….');
  const restored=E.validate(course,JSON.parse(JSON.stringify(s)));
  E.hintWord(course,restored,'T','T1');E.hintWord(course,restored,'T','T1');
  assert.equal(restored.sets.T.responses.T1.filter(i=>i!==null).length,3);
  assert.throws(()=>E.hintWord(course,restored,'T','T1'),/3 từ/);
  E.resetWords(course,restored,'T','T1');
  assert.equal(restored.sets.T.hints.T1.length,3);
  assert.equal(restored.sets.T.responses.T1.filter(i=>i!==null).length,3);
  assert.throws(()=>E.removeWord(course,restored,'T','T1',0),/gợi ý/);
  const corrupt=JSON.parse(JSON.stringify(restored));corrupt.sets.T.hints.T1[0].atom=7;
  assert.throws(()=>E.validate(course,corrupt),/gợi ý/);
});

test('assisted completion is recorded separately and retries retain the three-word budget',()=>{
  const second={...q,id:'T2'},c={...course,sets:[{...course.sets[0],items:[q,second]}]},s=E.create(c);
  E.hintWord(c,s,'T','T1');
  for(const x of [q,second])E.saveResponse(c,s,'T',x.id,x.answer);
  E.saveResponse(c,s,'T','T2',[0,6,7,3,4,5]);
  assert.equal(E.submit(c,s).wrong.length,1);
  E.retry(c,s);assert.deepEqual(s.sets.T.round,['T2']);
  assert.equal(s.sets.T.hints.T1.length,1);
  E.saveResponse(c,s,'T','T2',second.answer);E.submit(c,s);
  assert.equal(E.statistics(c,s).assistedPassed,1);
  assert.equal(E.statistics(c,s).independentPassed,0);
  assert.equal(E.statistics(c,s).afterReviewPassed,1);
  const p=require('../project.js'),restored=p.validateBackup([c],p.exportProject([c],{[c.id]:s},c.id));
  assert.equal(restored.progress[c.id].sets.T.hints.T1.length,1);
  assert(E.markdown(c,s).includes('có hỗ trợ'));
});
