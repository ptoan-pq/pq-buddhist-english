const test=require('node:test'),assert=require('node:assert/strict');
const X=require('../expressions.js');
const context={courseId:'meaning-translation',setId:'D299',itemId:'D299-Q2',en:'Hoan far outstripped me in professional life.',vi:'Khi ra công tác thì Hoan thành công vượt trội hơn tôi.',paragraph:'Hoan học cùng khóa với tôi. Khi ra công tác thì Hoan thành công vượt trội hơn tôi.',analysis:'Giữ so sánh về kết quả công tác.',source:{title:'Nền Tảng Đạo Đức',locator:'S06|example'}};
const candidate={expression:'outstrip someone in something',surface:'outstripped',meaning:'vượt xa ai về một mặt nào đó',frame:'A outstrips B in…',curatedId:'outstrip'};
test('a completed source sentence offers a reusable expression, not just its inflected verb',()=>{
 const options=X.candidates(context.en,'graduate second · outstrip');
 assert(options.some(c=>c.expression==='outstrip someone in something'&&c.surface==='outstripped'));
 assert(!options.some(c=>c.expression==='outstripped'));
 assert(X.candidates('We lean on our friends.','lean on').some(c=>c.expression==='lean on someone'));
});
test('saving a phrase keeps its context; saving it again adds a source without resetting learning',()=>{
 const book=X.create(),id=X.save(book,candidate,context,'2026-10-30');
 assert.equal(book.cards[id].expression,'outstrip someone in something');
 assert.equal(book.cards[id].due,'2026-10-30');assert.equal(book.cards[id].stage,0);
 book.cards[id].due='2026-11-06';book.cards[id].stage=3;
 X.save(book,{...candidate,expression:'  OUTSTRIP someone in something '},context,'2026-10-31');
 assert.equal(Object.keys(book.cards).length,1);assert.equal(book.cards[id].contexts.length,1);
 assert.equal(book.cards[id].due,'2026-11-06');assert.equal(book.cards[id].stage,3);
 X.save(book,candidate,{...context,itemId:'another'},'2026-10-31');
 assert.equal(book.cards[id].contexts.length,2);
 const restored=X.validate(JSON.parse(JSON.stringify(book)));assert.deepEqual(restored,book);
});
test('a review round survives reload, reveals only after all answers, and schedules a correct unaided answer',()=>{
 let book=X.create();const id=X.save(book,candidate,context,'2026-10-30');
 X.start(book,'r','2026-10-30');assert.equal(X.tasks(book).length,1);
 assert.throws(()=>X.submit(book,'2026-10-30'),/đủ/);
 X.respond(book,id,0);book=X.validate(JSON.parse(JSON.stringify(book)));
 assert.equal(book.session.status,'answer');assert.equal(book.cards[id].stage,0);
 const results=X.submit(book,'2026-10-30');assert.equal(results[0].correct,true);
 assert.equal(book.cards[id].due,'2026-10-31');assert.equal(book.cards[id].stage,1);
 assert.equal(X.status(book.cards[id]),'learning');
 assert.throws(()=>X.submit(book,'2026-10-30'),/nộp/);
 X.finish(book);assert.equal(book.session,null);
 assert.equal(X.validate(JSON.parse(JSON.stringify(book))).cards[id].stage,1);
});
test('source recognition and assisted answers never establish mastery; new contexts on separate days do',()=>{
 const book=X.create(),id=X.save(book,candidate,context,'2026-10-30');
 for(const day of ['2026-10-30','2026-10-31','2026-11-03']){X.start(book,'source',day,true);X.respond(book,id,X.tasks(book)[0].answer);X.submit(book,day);X.finish(book);}
 assert.notEqual(X.status(book.cards[id]),'mastered');assert.equal(book.cards[id].stage,2);
 for(const [day,kind]of [['2026-11-06','r'],['2026-11-13','n'],['2026-11-27','e']]){X.start(book,kind,day);X.respond(book,id,0);X.submit(book,day);X.finish(book);}
 assert.equal(X.status(book.cards[id]),'mastered');assert.equal(book.cards[id].due,'2026-12-27');
 X.start(book,'r','2026-12-27');X.hint(book,id);X.respond(book,id,0);X.submit(book,'2026-12-27');
 assert.notEqual(X.status(book.cards[id]),'mastered');assert.equal(book.cards[id].due,'2026-12-28');
});
test('seven same-type questions submit together; only errors retry and retries do not earn independent credit',()=>{
 const book=X.create();for(let i=0;i<9;i++)X.save(book,{...candidate,expression:'sample expression '+i,curatedId:null},{...context,en:'We seek support.',chunks:['we seek','support.'],itemId:'item'+i},'2026-10-30');
 X.start(book,'source','2026-10-30');const qs=X.tasks(book);assert.equal(qs.length,7);
 for(const q of qs.slice(0,6))X.respond(book,q.id,[0,1]);
 assert.throws(()=>X.submit(book,'2026-10-30'),/đủ/);assert.equal(book.cards[qs[0].id].events.length,0);
 X.respond(book,qs[6].id,[1,0]);X.submit(book,'2026-10-30');assert.equal(book.session.status,'review');
 const wrong=qs[6].id;assert.equal(book.cards[wrong].due,'2026-10-31');
 X.retry(book);assert.deepEqual(X.tasks(book).map(q=>q.id),[wrong]);
 const restored=X.validate(JSON.parse(JSON.stringify(book)));X.respond(restored,wrong,[0,1]);X.submit(restored,'2026-10-30');
 assert.equal(restored.session.status,'passed');assert.equal(restored.cards[wrong].events.length,1);assert.equal(X.status(restored.cards[wrong]),'needs-review');
 assert(X.markdown(restored).includes('Nền Tảng Đạo Đức'));assert(X.markdown(restored).includes('sample expression 0'));
});
test('all curated expressions have four authored new contexts and usable click-only answers',()=>{
 const bank=require('../expression-bank.js');assert.equal(bank.length,24);
 for(const entry of bank){const book=X.create(),id=X.save(book,{expression:entry.expression,surface:'sample',meaning:entry.meaning,frame:entry.frame,curatedId:entry.id},context,'2026-10-30');
  const cues=new Set();for(const kind of ['r','n','o','e']){X.start(book,kind,'2026-10-30',true);const q=X.tasks(book)[0];cues.add(q.vi);assert(q.analysis.length>60,entry.id+kind);assert(!q.english.includes('___'),entry.id+kind);if(q.type==='choice')assert.equal(new Set(q.options).size,4,entry.id+kind);X.respond(book,id,q.answer);assert.equal(X.submit(book,'2026-10-30')[0].correct,true,entry.id+kind);X.finish(book);}
  assert.equal(cues.size,4,entry.id+': genuinely different contexts');
 }
});
test('project backups include phrase cards and an unfinished review; old backups leave the notebook absent',()=>{
 const P=require('../project.js'),E=require('../engine.js'),course={id:'c',version:'1',sets:[{id:'s',type:'choice',items:[{id:'q',options:['yes','no'],answer:0}]}]},states={c:E.create(course)};
 const book=X.create(),id=X.save(book,candidate,context,'2026-10-30');X.start(book,'n','2026-10-30');X.respond(book,id,1);
 const exported=P.exportProject([course],states,'c',book),restored=P.validateBackup([course],JSON.parse(JSON.stringify(exported)));
 assert.deepEqual(restored.expressions,book);assert.equal(restored.expressions.session.responses[id],1);
 const old=P.exportProject([course],states,'c');assert(!Object.hasOwn(P.validateBackup([course],old),'expressions'));
 const broken=structuredClone(exported);broken.expressions.cards[id].due='2026-02-31';assert.throws(()=>P.validateBackup([course],broken));
});
test('corrupt review answers and malformed saved chunks are rejected before replacing a notebook',()=>{
 const book=X.create(),id=X.save(book,candidate,context,'2026-10-30');X.start(book,'o','2026-10-30');
 const duplicate=structuredClone(book);duplicate.session.responses[id]=[0,0];assert.throws(()=>X.validate(duplicate));
 const falseReview=structuredClone(book);falseReview.session.status='review';falseReview.session.graded=true;falseReview.session.history=[[{cardId:id,correct:false,assisted:false}]];assert.throws(()=>X.validate(falseReview));
 const badChunks=structuredClone(book);badChunks.cards[id].contexts[0].chunks=[null];assert.throws(()=>X.validate(badChunks));
});
