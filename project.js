(function(root){
  'use strict';
  const E=root.PQEngine||(typeof require!=='undefined'?require('./engine.js'):null);
  function key(course){return course.storageKey||(course.weekId?`pq-english-${course.weekId}-v1`:'pq-english-progress-v1');}
  function previousKey(course){return course.previousStorageKeys?.[0]||course.previousStorageKey||null;}
  function complete(course,state){return !!state&&course.sets.every(set=>state.sets[set.id]?.status==='passed');}
  function canOpen(courses,id){return courses.some(course=>course.id===id);}
  function compatibleSource(course,state){return course.previousSources?.find(s=>s.courseId===state?.courseId&&s.version===state.courseVersion);}
  function migrateSubset(course,sources){
    const state=E.create(course);state.sets={};let focusChosen=false;
    if(typeof sources[0]?.startedAt==='string')state.startedAt=sources[0].startedAt;
    for(const source of sources){
      const spec=compatibleSource(course,source);if(!spec)throw Error('Không nhận ra phiên bản tiến độ nguồn.');
      for(const set of course.sets){
        const old=source.sets?.[set.id];if(!old||state.sets[set.id])continue;
        const ids=set.items.map(q=>q.id),pick=values=>Object.fromEntries(Object.entries(values||{}).filter(([id])=>ids.includes(id)));
        const r=E.record(set);r.responses=pick(old.responses);r.visited=!!old.visited;
        r.history=(old.history||[]).map(a=>{const round=a.round.filter(id=>ids.includes(id)),responses=pick(a.responses);return {submittedAt:a.submittedAt,round,responses,wrong:round.filter(id=>!E.isCorrect(set.items.find(q=>q.id===id),responses[id]))};}).filter(a=>a.round.length);
        r.passedItems=ids.filter(id=>r.history.some(a=>a.round.includes(id)&&!a.wrong.includes(id)));
        const pending=ids.filter(id=>!r.passedItems.includes(id));r.round=pending.length?pending:ids;r.status=pending.length?'answer':'passed';state.sets[set.id]=r;
      }
      const focusId=spec.setIds?.[source.active]||course.sets[source.active]?.id,index=course.sets.findIndex(s=>s.id===focusId);
      if(!focusChosen&&index>=0&&state.sets[focusId]){state.active=index;focusChosen=true;}
    }
    if(!state.sets[course.sets[state.active].id])state.sets[course.sets[state.active].id]=E.record(course.sets[state.active]);
    return E.validate(course,state);
  }
  function restoreState(course,state){return compatibleSource(course,state)?migrateSubset(course,[state]):E.validate(course,state);}
  function exportProject(courses,states,selected){return {format:'pq-english-project',schema:2,selected,exportedAt:new Date().toISOString(),progress:Object.fromEntries(courses.filter(c=>states[c.id]).map(c=>[c.id,states[c.id]]))};}
  function validateBackup(courses,payload){
    const lookup=new Map(courses.map(c=>[c.id,c]));
    if(payload?.schema===1&&lookup.has(payload.courseId))payload={format:'pq-english-project',schema:2,selected:payload.courseId,progress:{[payload.courseId]:payload}};
    if(!payload||payload.format!=='pq-english-project'||payload.schema!==2||!payload.progress||typeof payload.progress!=='object'||!lookup.has(payload.selected))throw Error('File này không phải bản sao lưu PQ English được hỗ trợ.');
    const progress={};for(const [id,value] of Object.entries(payload.progress)){const c=lookup.get(id);if(!c)throw Error(`Không nhận ra chủ điểm trong bản sao lưu: ${id}`);progress[id]=restoreState(c,value);}
    for(const c of courses)if(!progress[c.id]&&c.previousSources){const sources=Object.values(payload.progress).filter(s=>compatibleSource(c,s));if(sources.length)progress[c.id]=migrateSubset(c,sources);}
    if(!progress[payload.selected])throw Error('Thiếu tiến độ của chủ điểm đang chọn.');
    return {selected:payload.selected,progress};
  }
  const api={key,previousKey,complete,canOpen,compatibleSource,migrateSubset,restoreState,exportProject,validateBackup};root.PQProject=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
