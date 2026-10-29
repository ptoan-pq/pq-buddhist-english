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
function boot(){
  const roots=['main','storage-warning','backup-file'].map(id=>{const e=new Element('div');e.id=id;return e;}),nav=['catalog','learn','notes','progress'].map(view=>{const e=new Element('button');e.dataset.view=view;return e;});
  const document={createElement:tag=>new Element(tag),getElementById:id=>roots.flatMap(walk).find(e=>e.id===id),querySelectorAll:()=>nav,querySelector:()=>null,body:new Element('body')};
  const saved=new Map(),localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
  const sandbox={document,localStorage,setTimeout,Blob,URL,window:null};sandbox.window=sandbox;sandbox.addEventListener=()=>{};sandbox.confirm=()=>true;
  vm.createContext(sandbox);
  for(const file of ['course.js','context-bank.js','context-verbs.js','advanced-verbs.js','context-lessons.js','verb-lessons.js','engine.js','project.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox);
  const main=document.getElementById('main');
  return {main,saved,get:id=>document.getElementById(id),buttons:()=>walk(main).filter(e=>e.tagName==='button'),questions:()=>walk(main).filter(e=>e.className==='question'),select:(id,value)=>{const e=document.getElementById(id);e.value=value;e.onchange();}};
}
test('The actual app switches between the two programs, keeps 5/6 questions separate, and retains click answers',()=>{
  const app=boot();assert(app.main.textContent.includes('Hai khóa học độc lập'));
  app.select('program-select','verbs');
  assert(app.main.textContent.includes('Các gói động từ nâng cao'));
  app.buttons().filter(b=>b.textContent==='Mở gói này').at(11).onclick();
  assert.equal(app.questions().length,6);assert(app.questions().every(q=>q.id.startsWith('V12-')));
  const choice=walk(app.questions()[0]).find(e=>e.className==='option');choice.onclick();
  const verbResponse=JSON.parse(app.saved.get('pq-english-verb-mastery-v3')).sets.V12.responses;
  assert.equal(Object.keys(verbResponse).length,1);
  app.select('program-select','dharma');app.select('topic-select','context-w24');
  assert.equal(app.questions().length,5);assert(app.questions().every(q=>q.id.startsWith('W24-B01-Q0')));
  assert(!app.main.textContent.includes('Phần 2 —'));
  app.select('program-select','verbs');app.select('topic-select','verb-mastery');
  assert.equal(app.questions().length,6);assert(app.questions().every(q=>q.id.startsWith('V12-')));
  assert.deepEqual(JSON.parse(app.saved.get('pq-english-verb-mastery-v3')).sets.V12.responses,verbResponse);
  app.select('topic-select','verb-review');assert.equal(app.questions().length,5);
  assert(app.main.textContent.includes('Ôn động từ cơ bản'));
});
