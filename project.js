(function(root){
  'use strict';
  const E=root.PQEngine||(typeof require!=='undefined'?require('./engine.js'):null);
  function key(course){return course.storageKey||(course.weekId?`pq-english-${course.weekId}-v1`:'pq-english-progress-v1');}
  function previousKey(course){return course.previousStorageKeys?.[0]||course.previousStorageKey||null;}
  function complete(course,state){return !!state&&course.sets.every(set=>state.sets[set.id]?.status==='passed');}
  function canOpen(courses,id){return courses.some(course=>course.id===id);}
  function exportProject(courses,states,selected){return {format:'pq-english-project',schema:2,selected,exportedAt:new Date().toISOString(),progress:Object.fromEntries(courses.filter(c=>states[c.id]).map(c=>[c.id,states[c.id]]))};}
  function validateBackup(courses,payload){
    const lookup=new Map(courses.map(c=>[c.id,c]));
    if(payload?.schema===1&&lookup.has(payload.courseId)){const c=lookup.get(payload.courseId);return {selected:c.id,progress:{[c.id]:E.validate(c,payload)}};}
    if(!payload||payload.format!=='pq-english-project'||payload.schema!==2||!payload.progress||typeof payload.progress!=='object'||!lookup.has(payload.selected))throw Error('File này không phải bản sao lưu PQ English được hỗ trợ.');
    const progress={};for(const [id,value] of Object.entries(payload.progress)){const c=lookup.get(id);if(!c)throw Error(`Không nhận ra chủ điểm trong bản sao lưu: ${id}`);progress[id]=E.validate(c,value);}
    if(!progress[payload.selected])throw Error('Thiếu tiến độ của chủ điểm đang chọn.');
    return {selected:payload.selected,progress};
  }
  const api={key,previousKey,complete,canOpen,exportProject,validateBackup};root.PQProject=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
