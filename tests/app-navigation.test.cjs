const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
// Small DOM test double: verifies handlers and storage, not visual browser layout.
class Element{
  constructor(tag,text=''){this.tagName=tag;this.ownText=text;this.children=[];this.dataset={};this.attrs={};this.style={};}
  set textContent(value){this.ownText=String(value);this.children=[];}
  get textContent(){return this.ownText+this.children.map(c=>c.textContent).join(' ');}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.ownText='';this.children=children;}
  setAttribute(k,v){this.attrs[k]=v;}
  removeAttribute(k){delete this.attrs[k];}
  addEventListener(){}
  scrollIntoView(){}
  focus(){}
}
const walk=e=>[e,...e.children.flatMap(walk)];
function boot(hash=''){
  const roots=['main','storage-warning','backup-file'].map(id=>{const e=new Element('div');e.id=id;return e;}),nav=['catalog','learn','notes','progress'].map(view=>{const e=new Element('button');e.dataset.view=view;return e;});
  const document={createElement:tag=>new Element(tag),getElementById:id=>roots.flatMap(walk).find(e=>e.id===id),querySelectorAll:()=>nav,querySelector:()=>null,body:new Element('body')};
  const saved=new Map(),localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
  const sandbox={document,localStorage,setTimeout,Blob,URL,location:{hash},window:null};sandbox.window=sandbox;sandbox.addEventListener=()=>{};sandbox.confirm=()=>true;
  vm.createContext(sandbox);
  for(const file of ['course.js','context-bank.js','context-verbs.js','advanced-verbs.js','context-lessons.js','verb-lessons.js','translation-units-v2.js','translation-batch-01.js','translation-batch-02.js','translation-batch-03.js','translation-batch-04.js','translation-course.js','engine.js','project.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox);
  const main=document.getElementById('main');
  return {main,saved,translation:sandbox.PQTranslationCourse,get:id=>document.getElementById(id),buttons:()=>walk(main).filter(e=>e.tagName==='button'),questions:()=>walk(main).filter(e=>(e.className||'').split(' ').includes('question')),select:(id,value)=>{const e=document.getElementById(id);e.value=value;e.onchange();}};
}
test('The actual app switches between the two programs, keeps 5/6 questions separate, and retains click answers',()=>{
  const app=boot();assert(app.main.textContent.includes('Ba chương trình độc lập'));
  app.select('program-select','verbs');
  assert(app.main.textContent.includes('Các gói động từ nâng cao'));
  app.buttons().filter(b=>b.textContent==='Mở gói này').at(11).onclick();
  assert.equal(app.questions().length,6);assert(app.questions().every(q=>q.id.startsWith('V12-')));
  const choice=walk(app.questions()[0]).find(e=>e.className==='option');choice.onclick();
  const verbResponse=JSON.parse(app.saved.get('pq-english-verb-mastery-v4')).sets.V12.responses;
  assert.equal(Object.keys(verbResponse).length,1);
  app.select('program-select','dharma');app.select('topic-select','context-w24');
  assert.equal(app.questions().length,5);assert(app.questions().every(q=>q.id.startsWith('W24-B01-Q0')));
  assert(!app.main.textContent.includes('Phần 2 —'));
  app.select('program-select','verbs');app.select('topic-select','verb-mastery');
  assert.equal(app.questions().length,6);assert(app.questions().every(q=>q.id.startsWith('V12-')));
  assert.deepEqual(JSON.parse(app.saved.get('pq-english-verb-mastery-v4')).sets.V12.responses,verbResponse);
  app.select('topic-select','verb-review');assert.equal(app.questions().length,5);
  assert(app.main.textContent.includes('Ôn động từ cơ bản'));
});

test('Translation is a separate program with five click-only questions and persistent one-word hints',()=>{
  const app=boot();app.select('program-select','translation');
  assert(app.main.textContent.includes('Các gói dịch theo ý'));
  app.buttons().find(b=>b.textContent==='Mở gói dịch').onclick();
  assert.equal(app.questions().length,5);
  app.buttons().find(b=>b.textContent==='Gợi ý · 0/3').onclick();
  assert.equal(walk(app.questions()[0]).filter(e=>e.className?.includes('word-locked')).length,1);
  assert(app.buttons().some(b=>b.textContent==='Gợi ý · 1/3'));
  const submit=app.buttons().find(b=>b.textContent==='Nộp cả bộ →');assert(submit.disabled);
  assert(!app.main.textContent.includes('Một đáp án phù hợp'));
  app.select('packet-select','11');assert(app.questions().every(q=>q.id.startsWith('D12-')));
  app.select('packet-select','0');assert(app.buttons().some(b=>b.textContent==='Gợi ý · 1/3'));
  const saved=JSON.parse(app.saved.get('pq-english-meaning-translation-v2'));
  assert.equal(saved.sets.D01.hints['D01-Q1'].length,1);
});

test('a direct translation link opens its packet catalog without changing the other courses',()=>{
  const app=boot('#translation');assert(app.main.textContent.includes('Các gói dịch theo ý'));
  assert.equal(app.buttons().filter(b=>b.textContent==='Mở gói dịch').length,92);
  assert(!app.saved.has('pq-english-verb-mastery-v4'));
});

test('the translation thinking guide opens inline without losing a draft or hints',()=>{
  const app=boot('#translation');
  const guide=()=>walk(app.main).find(e=>e.tagName==='details'&&e.children.some(c=>c.tagName==='summary'&&c.textContent==='Cách tư duy trước khi dịch'));
  assert(guide(),'The translation catalog should offer a compact guide');
  assert.equal(guide().open,false);
  app.buttons().find(b=>b.textContent==='Mở gói dịch').onclick();
  app.buttons().find(b=>b.textContent==='Gợi ý · 0/3').onclick();
  const chunk=walk(app.questions()[0]).find(e=>e.className==='chip chunk-card'&&!e.disabled);chunk.onclick();
  const draft=app.saved.get('pq-english-meaning-translation-v2');
  guide().open=true;guide().ontoggle();
  assert.equal(walk(guide()).filter(e=>e.tagName==='li').length,5);
  assert(guide().textContent.includes('không phải luôn chọn từ mạnh hoặc hiếm nhất'));
  assert(guide().textContent.includes('Với yêu cầu 2–3 câu'));
  assert.equal(app.saved.get('pq-english-meaning-translation-v2'),draft);
  app.buttons().find(b=>b.textContent==='Hoàn tác').onclick();
  assert.equal(guide().open,true,'The guide should stay open when the exercise rerenders');
  const afterUndo=app.saved.get('pq-english-meaning-translation-v2');
  guide().open=false;guide().ontoggle();
  assert.equal(app.saved.get('pq-english-meaning-translation-v2'),afterUndo);
  assert.equal(app.questions().length,5);
  assert(app.buttons().some(b=>b.textContent==='Gợi ý · 1/3'));
  app.select('program-select','verbs');assert.equal(guide(),undefined);
});

test('failed answers have an unmistakable red-card state and stay marked while retrying',()=>{
  const app=boot('#translation');app.buttons().find(b=>b.textContent==='Mở gói dịch').onclick();
  const set=app.translation.sets[0];
  for(const [i,q]of set.items.entries()){
    const chunks=q.chunks.filter(c=>c.every(a=>q.answer.includes(a)));if(i===4)chunks.reverse();
    for(const chunk of chunks){const card=app.questions().find(c=>c.id===q.id),label='Thêm cụm: '+chunk.map(a=>q.tokens[a]).join(' ');walk(card).find(e=>e.attrs?.['aria-label']===label).onclick();}
  }
  app.buttons().find(b=>b.textContent==='Nộp cả bộ →').onclick();
  const failed=app.questions().filter(c=>c.className.includes('question-failed'));
  assert.equal(failed.length,1);assert(failed[0].textContent.includes('CHƯA ĐẠT'));
  assert.equal(app.questions().filter(c=>c.className.includes('question-passed')).length,4);
  app.buttons().find(b=>b.textContent==='Làm lại câu chưa đạt').onclick();
  assert.equal(app.questions().length,1);assert(app.questions()[0].className.includes('question-needs-retry'));
  const q=set.items[4];for(const chunk of q.chunks.filter(c=>c.every(a=>q.answer.includes(a)))){const label='Thêm cụm: '+chunk.map(a=>q.tokens[a]).join(' ');walk(app.questions()[0]).find(e=>e.attrs?.['aria-label']===label).onclick();}
  app.buttons().find(b=>b.textContent==='Nộp cả bộ →').onclick();
  assert.equal(app.questions().filter(c=>c.className.includes('question-failed')).length,0);
  assert.equal(app.questions().filter(c=>c.className.includes('question-passed')).length,5);
});

test('Authored packets show five concise cards, one shared instruction, and free selection through M288',()=>{
  const app=boot();app.select('program-select','verbs');
  app.buttons().filter(b=>b.textContent==='Mở gói này').at(12).onclick();
  assert.equal(app.questions().length,5);
  assert(app.questions().every(q=>q.id.startsWith('M001-')));
  assert(app.questions().every(q=>!q.textContent.includes('Chọn động từ')));
  assert.equal((app.main.textContent.match(/Mỗi câu có một đáp án phù hợp nhất/g)||[]).length,1);
  app.select('packet-select','299');
  assert(app.questions().every(q=>q.id.startsWith('M288-')));
  const option=walk(app.questions()[0]).find(e=>e.className==='option');option.onclick();
  app.select('packet-select','12');app.select('packet-select','299');
  assert.equal(Object.keys(JSON.parse(app.saved.get('pq-english-verb-mastery-v4')).sets.M288.responses).length,1);
});
