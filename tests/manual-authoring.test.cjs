const test=require('node:test'),assert=require('node:assert/strict');
const manual=require('../../outputs/context-bank-v1/manual-verb-authoring.cjs');
const bank=require('../../outputs/context-bank-v1/bank.json');
const blocks=new Map(bank.topics.flatMap(t=>t.blocks).map(b=>[b.id,b]));

test('manual advanced authoring keeps distinct source-grounded frames',()=>{
  assert.equal(manual.length,18);
  assert.equal(manual.flatMap(x=>x[3]).length,90);
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
