const test=require('node:test'),assert=require('node:assert/strict');
const manual=require('../authoring/manual-drafts.cjs');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../context-bank.js'),'utf8'),sandbox);
const bank=sandbox.window.PQContextBank;
const blocks=new Map(bank.topics.flatMap(t=>t.blocks).map(b=>[b.id,b]));

// This checks draft structure only. It does not certify answer uniqueness,
// grammatical distractors, or semantic faithfulness.
test('preserved manual drafts have traceable cues and distinct frame strings',()=>{
  assert.equal(manual.length,54);
  assert.equal(manual.flatMap(x=>x[3]).length,270);
  for(const [blockId,id,title,rows] of manual){
    const block=blocks.get(blockId);assert(block,id);
    assert.equal(rows.length,5,id);
    assert.equal(new Set(rows.map(r=>r[1])).size,5,id+': duplicate English frame');
    for(const [cue,sentence,options,analysis,dimension] of rows){
      assert(cue&&sentence.includes('___')&&options.length===4&&new Set(options).size===4&&analysis.length>80&&dimension,id);
      assert(block.source.paragraphs.join('\n\n').toLowerCase().includes(cue.toLowerCase()),`${id}: cue not in Vietnamese source: ${cue}`);
    }
  }
});
