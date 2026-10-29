const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../engine.js');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../context-bank.js'),'utf8'),sandbox);
globalThis.PQContextBank=JSON.parse(JSON.stringify(sandbox.window.PQContextBank));
const courses=require('../context-lessons.js');

test('Published contextual bank contains all 1440 learner-facing Vietnamese prompts',()=>{
  assert.equal(courses.length,24);
  for(const course of courses){
    assert.equal(course.sets.length,12);
    for(const set of course.sets){
      assert.equal(set.items.length,5);
      for(const q of set.items){
        assert(!/^(Giữ |Sửa |Dịch |That |Those |Depends |From )/.test(q.prompt),q.id);
        assert(!/register|collocation|glossary|\uFFFD/.test(q.prompt),q.id);
        if(set.type==='gaps')assert(q.prompt.includes('điền'),q.id);
        if(set.type==='order')assert(q.prompt.startsWith('Sắp xếp'),q.id);
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
    assert.equal(E.statistics(course,state).passed,60);
    assert.doesNotThrow(()=>E.validate(course,JSON.parse(JSON.stringify(state))));
    assert(E.markdown(course,state).includes(course.title));
  }
});
