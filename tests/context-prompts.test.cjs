const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../engine.js');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../context-bank.js'),'utf8'),sandbox);
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../context-verbs.js'),'utf8'),sandbox);
globalThis.PQContextBank=JSON.parse(JSON.stringify(sandbox.window.PQContextBank));
globalThis.PQVerbBank=JSON.parse(JSON.stringify(sandbox.window.PQVerbBank));
const courses=require('../context-lessons.js');

test('Published contextual bank keeps 1440 old questions and appends 1440 verb questions',()=>{
  assert.equal(courses.length,24);
  for(const course of courses){
    assert.equal(course.sets.length,12);
    for(const set of course.sets){
      assert.equal(set.items.length,10);
      const oldBlock=globalThis.PQContextBank.topics.flatMap(t=>t.blocks).find(b=>b.id===set.id);
      for(let i=0;i<5;i++)for(const field of ['id','prompt','options','tokens','parts','answer','accepted','analysis'])assert.deepEqual(set.items[i][field],oldBlock.questions[i][field],set.id+': old '+field);
      assert(set.items.slice(5).every(q=>q.type==='choice'&&q.group==='verb-nuance'));
      for(const q of set.items){
        assert(!/^(Giữ |Sửa |Dịch |That |Those |Depends |From )/.test(q.prompt),q.id);
        assert(!/register|collocation|glossary|\uFFFD/.test(q.prompt),q.id);
        const type=q.type||set.type;
        if(type==='gaps')assert(q.prompt.includes('điền'),q.id);
        if(type==='order')assert(q.prompt.startsWith('Sắp xếp'),q.id);
      }
    }
  }
});

test('Revised prompt text does not break completion, restore or notes in any contextual topic',()=>{
  for(const course of courses){
    const state=E.create(course);
    for(const set of course.sets){
      E.saveResponse(course,state,set.id,set.items[0].id,set.items[0].answer);
      assert.throws(()=>E.submit(course,state),/đủ cả bộ/);
      assert.doesNotThrow(()=>E.validate(course,JSON.parse(JSON.stringify(state))));
      for(const q of set.items.slice(1))E.saveResponse(course,state,set.id,q.id,q.answer);
      assert.equal(E.submit(course,state).wrong.length,0);
      E.advance(course,state);
    }
    assert.equal(E.statistics(course,state).passed,120);
    assert.doesNotThrow(()=>E.validate(course,JSON.parse(JSON.stringify(state))));
    assert(E.markdown(course,state).includes(course.title));
  }
});
test('All new verb questions have four explained alternatives and exact Vietnamese evidence',()=>{
  const targets=new Set();
  for(const topic of globalThis.PQContextBank.topics)for(const b of topic.blocks){
    const extras=globalThis.PQVerbBank.blocks[b.id];assert.equal(extras.length,5);
    assert.equal(new Set(extras.map(q=>q.sourceCue)).size,5);
    for(const [i,q]of extras.entries()){
      assert.equal(q.id,`${b.id}-Q${String(i+6).padStart(2,'0')}`);
      assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
      assert.equal(q.options[q.answer],q.verbTarget);
      assert(b.source.paragraphs.join('\n\n').includes(q.evidence),q.id);
      assert(q.evidence.includes(q.sourceCue),q.id+': cue absent from its quoted sentence');
      assert(q.prompt.includes(q.sourceCue),q.id+': source cue must be shown');
      assert(q.prompt.includes('phù hợp nhất với ngữ cảnh ở trên'),q.id);
      assert.equal(q.grounding,'direct-source-predicate');
      assert(!/nếu cần|muốn diễn đạt|Ngữ cảnh gợi ý|Bài vận dụng|không phải khẳng định/.test(q.prompt+' '+q.analysis),q.id);
      for(const v of q.options)assert(q.analysis.includes(`“${v}”`),q.id+': missing contrast explanation');
      targets.add(q.verbTarget);
    }
  }
  assert(targets.size>=100);
});
test('Verb revision fixes the reported adjective-to-action error and contextual homonyms',()=>{
  const bank=globalThis.PQVerbBank.blocks;
  assert(!bank['W01-B01'].some(q=>q.verbLemma==='enrich'));
  assert.equal(bank['W01-B01'][1].verbTarget,'originated');
  assert(bank['W01-B01'].every(q=>q.sentence?.includes('___')));
  assert(!bank['W02-B04'].some(q=>q.sourceCue==='học'));
  assert(!bank['W13-B03'].some(q=>q.sourceCue==='thuộc'));
  assert(!bank['W22-B09'].some(q=>q.sourceCue==='thuộc'));
  assert(!bank['W11-B02'].some(q=>q.sourceCue==='đặt'));
  assert(!bank['W11-B06'].some(q=>q.sourceCue==='đứng'));
});
test('Each actual topic migrates a completed 5-question history without losing a single old PASS',()=>{
  for(const course of courses){
    const legacy={...course,version:course.previousVersion,previousVersion:null,freeSets:false,sets:course.sets.map(s=>({...s,items:s.items.slice(0,5)}))};
    const old=E.create(legacy);
    for(const set of legacy.sets){for(const q of set.items)E.saveResponse(legacy,old,set.id,q.id,q.answer);E.submit(legacy,old);E.advance(legacy,old);}
    const expanded=E.validate(course,JSON.parse(JSON.stringify(old)));
    assert.equal(expanded.active,old.active);
    for(const set of course.sets){
      const r=expanded.sets[set.id];assert.equal(r.passedItems.length,5);assert.equal(r.round.length,5);
      assert.deepEqual(r.history,old.sets[set.id].history);
      E.openSet(course,expanded,course.sets.indexOf(set));
      for(const q of set.items.slice(5))E.saveResponse(course,expanded,set.id,q.id,q.answer);
      assert.equal(E.submit(course,expanded).wrong.length,0);
    }
    assert.equal(E.statistics(course,expanded).passed,120);
    assert.doesNotThrow(()=>E.validate(course,expanded));
  }
});
