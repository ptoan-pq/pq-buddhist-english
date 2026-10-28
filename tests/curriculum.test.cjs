const test=require('node:test');
const assert=require('node:assert/strict');
const curriculum=require('../curriculum.js');
const courses=require('../lessons.js');
const legacy=require('../course.js');
const E=require('../engine.js');
const P=require('../project.js');
const expected=[
  'Define and classify','Cause and result','Conditions and dependence','Continuation and cessation',
  'Perception and knowing','Ignorance and misunderstanding','Desire and attachment','Emotion and reaction',
  'Intention and choice','Speech and influence','Compassion and help','Responsibility and livelihood',
  'Body and attention','Breath and instructions','Cultivation and obstacles','Progress, signs, and caution',
  'Clear definitions','Process chains','Contrast and misconception','Qualification and argument',
  'Q&A and public teaching','Society and interfaith dialogue','Analogy and literary explanation','Capstone synthesis'
];
function passCourse(course){const s=E.create(course);for(const set of course.sets){for(const q of set.items)E.saveResponse(course,s,set.id,q.id,q.answer);E.submit(course,s);E.advance(course,s);}return s;}
test('The actual v4 sequence is preserved, rather than a replacement grammar syllabus',()=>{
  assert.deepEqual(curriculum.weeks.map(w=>w.function),expected);
  assert.equal(courses.length,24);
  courses.forEach((c,i)=>{assert.equal(c.week,i+1);assert.equal(c.subtitle,expected[i]);assert.deepEqual(c.targets,curriculum.weeks[i].targets);});
  assert.deepEqual(courses[0].targets,['mean','refer to','consist of','be regarded as']);
});
test('Every published topic contains six complete homogeneous sets, with six items each',()=>{
  const ids=new Set();let count=0,application=0;
  courses.forEach(c=>{assert.equal(c.sets.length,6);for(const s of c.sets){assert.equal(s.items.length,6);if(s.phase!=='Làm quen nhanh')application+=6;for(const q of s.items){count++;assert(!ids.has(q.id));ids.add(q.id);assert(E.isComplete(s,q,q.answer),q.id);assert(E.isCorrect(q,q.answer),q.id);assert(q.prompt&&q.analysis&&q.pattern&&q.meaningId);assert(q.source?.title&&q.source.locator);if(q.options)assert.equal(new Set(q.options).size,q.options.length,q.id);if(q.tokens)assert.equal(new Set(q.tokens).size,q.tokens.length,q.id);}}});
  assert.equal(count,864);assert.equal(application,720);
});
test('Core curriculum language appears in the actual answers, not only in the menu',()=>{
  const variants={condition:'conditioned',mean:'means?','refer to':'refers? to',clarify:'clarif(?:y|ies)','be regarded as':'is regarded as','be shaped by':'is shaped by','be subject to':'is subject to','mistake A for B':'mistak(?:e|ing).+for','distinguish A from B':'distinguish.+from','by X we mean':'by .+we mean','address a question':'address the question'};
  courses.forEach(c=>{const answers=c.sets.flatMap(s=>s.items.map(q=>E.sequence(s,q,q.answer))).join(' ').toLowerCase().replace(/,/g,'');for(const target of c.targets){const pattern=variants[target]||target;assert(new RegExp(pattern,'i').test(answers),`${c.weekId} must practice ${target}`);}});
});
test('Every chapter is usable through completion, retry, restore, and Markdown export',()=>{
  for(const c of courses){const s=E.create(c),first=c.sets[0],bad=first.items[0];for(const q of first.items)E.saveResponse(c,s,first.id,q.id,q===bad?1:q.answer);assert.equal(E.submit(c,s).wrong.length,1);assert.throws(()=>E.advance(c,s));E.retry(c,s);assert.deepEqual(s.sets.M01.round,[bad.id]);E.saveResponse(c,s,first.id,bad.id,bad.answer);E.submit(c,s);E.advance(c,s);
    for(const set of c.sets.slice(1)){for(const q of set.items)E.saveResponse(c,s,set.id,q.id,q.answer);E.submit(c,s);E.advance(c,s);}
    assert.equal(E.statistics(c,s).passed,36);assert(P.complete(c,s));assert.equal(E.validate(c,JSON.parse(JSON.stringify(s))).active,5);assert(E.markdown(c,s).includes(c.title));
  }
});
test('Natural alternative orders are accepted in paragraph composition',()=>{
  for(const c of courses){const set=c.sets.at(-1);for(const q of set.items){assert(E.isCorrect(q,[0,2,1]));assert(!E.isCorrect(q,[3,0,1]));assert(!E.isCorrect(q,[0,1,4]));}}
});
test('A future chapter remains locked until earlier chapters actually pass',()=>{
  const states=Object.fromEntries(courses.map(c=>[c.id,E.create(c)]));
  assert(P.canOpen(courses,states,courses[0].id));assert(!P.canOpen(courses,states,courses[1].id));
  states[courses[0].id]=passCourse(courses[0]);assert(P.canOpen(courses,states,courses[1].id));assert(!P.canOpen(courses,states,courses[2].id));
});
test('Original progress is stored separately and old JSON backups remain importable',()=>{
  assert.equal(P.key(legacy),'pq-english-progress-v1');assert.notEqual(P.key(courses[0]),P.key(legacy));
  const old=E.create(legacy),q=legacy.sets[0].items[0];E.saveResponse(legacy,old,'M01',q.id,q.answer);
  const imported=P.validateBackup([...courses,legacy],JSON.parse(JSON.stringify(old)));assert.equal(imported.selected,legacy.id);assert.deepEqual(imported.progress[legacy.id].sets.M01.responses,old.sets.M01.responses);
});
test('Full-project backup round trips independent chapter states without conflating IDs',()=>{
  const states={};states[courses[0].id]=passCourse(courses[0]);states[courses[1].id]=E.create(courses[1]);
  const q=courses[1].sets[0].items[0];E.saveResponse(courses[1],states[courses[1].id],'M01',q.id,q.answer);
  const backup=P.exportProject([...courses,legacy],states,courses[1].id),restored=P.validateBackup([...courses,legacy],JSON.parse(JSON.stringify(backup)));
  assert.equal(Object.keys(restored.progress).length,2);assert(P.complete(courses[0],restored.progress[courses[0].id]));assert.equal(E.missing(courses[1].sets[0],restored.progress[courses[1].id].sets.M01).length,5);
  const bad=JSON.parse(JSON.stringify(backup));bad.progress.unknown={};assert.throws(()=>P.validateBackup([...courses,legacy],bad));
});
