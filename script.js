(function(){
  const DEFAULT_HABITS = [];

  const newTaskInput = document.getElementById('newTaskInput');
  const monthInput = document.getElementById('monthInput');
  const daysSelect = document.getElementById('daysSelect');
  const habitTable = document.getElementById('habitTable');
  const addHabitBtn = document.getElementById('addHabitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resetTasksBtn = document.getElementById('resetTasksBtn');
  const studySvg = document.getElementById('studyChart');
  const sleepSvg = document.getElementById('sleepChart');

  for(let d=28; d<=31; d++){
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = d + ' days';
    if(d===30) opt.selected = true;
    daysSelect.appendChild(opt);
  }

  const ACTIVE_MONTH_KEY = 'ledger:activeMonth';

  function storageKey(){
    return 'ledger:' + monthInput.value.trim().toLowerCase();
  }

  function defaultState(){
    return {
      habits: DEFAULT_HABITS.slice(),
      days: 30,
      marks: {},       // "habitIdx-day" -> 'ok'|'no'
      study: {},        // day -> hours
      sleep: {}
    };
  }

  let state = defaultState();

  function load(){
    localStorage.setItem(ACTIVE_MONTH_KEY, monthInput.value.trim());
    const raw = localStorage.getItem(storageKey());
    if(raw){
      try{ state = Object.assign(defaultState(), JSON.parse(raw)); }
      catch(e){ state = defaultState(); }
    } else {
      state = defaultState();
    }
    daysSelect.value = state.days;
    render();
  }

  function save(){
    localStorage.setItem(storageKey(), JSON.stringify(state));
  }

  function render(){
    renderTable();
    renderChart(studySvg, state.study, '#c85c54', 0, 10);
    renderChart(sleepSvg, state.sleep, '#c85c54', 4, 12);
  }

  function renderTable(){
    habitTable.innerHTML = '';
    const days = state.days;

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    const thHabit = document.createElement('th');
    thHabit.className = 'habit-col';
    thHabit.textContent = 'Habit';
    trh.appendChild(thHabit);
    for(let d=1; d<=days; d++){
      const th = document.createElement('th');
      th.textContent = d;
      trh.appendChild(th);
    }
    thead.appendChild(trh);
    habitTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    if(state.habits.length===0){
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.className = 'empty-state';
      td.colSpan = days+1;
      td.textContent = 'No tasks yet — add one below to start tracking.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    state.habits.forEach((name, hIdx)=>{
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.className = 'habit-col';
      const wrap = document.createElement('div');
      wrap.className = 'habit-name';
      const idx = document.createElement('span');
      idx.className = 'habit-index';
      idx.textContent = (hIdx+1) + '.';
      const inp = document.createElement('input');
      inp.value = name;
      inp.addEventListener('input', ()=>{ state.habits[hIdx] = inp.value; save(); });
      const del = document.createElement('button');
      del.className = 'del-habit';
      del.textContent = '✕';
      del.title = 'remove habit';
      del.addEventListener('click', ()=>{
        state.habits.splice(hIdx,1);
        // shift marks
        const newMarks = {};
        Object.keys(state.marks).forEach(k=>{
          const [hi, day] = k.split('-').map(Number);
          if(hi < hIdx) newMarks[k] = state.marks[k];
          else if(hi > hIdx) newMarks[(hi-1)+'-'+day] = state.marks[k];
        });
        state.marks = newMarks;
        save(); render();
      });
      wrap.appendChild(idx); wrap.appendChild(inp); wrap.appendChild(del);
      tdName.appendChild(wrap);
      tr.appendChild(tdName);

      for(let d=1; d<=days; d++){
        const td = document.createElement('td');
        td.className = 'day-cell';
        const key = hIdx+'-'+d;
        const mark = state.marks[key];
        if(mark==='ok'){ td.className += ' ok'; td.textContent='✓'; }
        else if(mark==='no'){ td.className += ' no'; td.textContent='✗'; }
        td.addEventListener('click', ()=>{
          const cur = state.marks[key];
          if(!cur) state.marks[key] = 'ok';
          else if(cur==='ok') state.marks[key] = 'no';
          else delete state.marks[key];
          save(); renderTable();
        });
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    habitTable.appendChild(tbody);
  }

  function addHabit(){
    const name = newTaskInput.value.trim();
    if(!name) { newTaskInput.focus(); return; }
    state.habits.push(name);
    newTaskInput.value = '';
    save(); render();
    newTaskInput.focus();
  }

  // ---- CHART RENDERING ----
  const CHART_PAD = {left:34, right:14, top:10, bottom:24};
  const COL_W = 22;

  function chartDims(){
    const days = state.days;
    const width = CHART_PAD.left + CHART_PAD.right + days*COL_W;
    const height = 200;
    return {width, height, days};
  }

  function renderChart(svg, dataObj, lineColor, minH, maxH){
    const {width, height, days} = chartDims();
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', '0 0 '+width+' '+height);
    svg.innerHTML = '';

    const plotH = height - CHART_PAD.top - CHART_PAD.bottom;
    const plotW = days*COL_W;
    const range = maxH - minH;

    function yForHours(h){
      return CHART_PAD.top + plotH - ((h-minH)/range)*plotH;
    }
    function xForDay(d){
      return CHART_PAD.left + (d-0.5)*COL_W;
    }

    const ns = 'http://www.w3.org/2000/svg';
    function el(tag, attrs){
      const e = document.createElementNS(ns, tag);
      for(const k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }

    // horizontal gridlines + y labels
    for(let h=minH; h<=maxH; h+=2){
      const y = yForHours(h);
      svg.appendChild(el('line',{x1:CHART_PAD.left, x2:CHART_PAD.left+plotW, y1:y, y2:y, class:'grid-l' + ((h-minH)%4===0?' strong':'')}));
      const t = el('text',{x:CHART_PAD.left-8, y:y+3, class:'axis-label', 'text-anchor':'end'});
      t.textContent = h+'h';
      svg.appendChild(t);
    }
    // vertical gridlines + day labels + click targets
    for(let d=1; d<=days; d++){
      const x0 = CHART_PAD.left + (d-1)*COL_W;
      svg.appendChild(el('line',{x1:x0, x2:x0, y1:CHART_PAD.top, y2:CHART_PAD.top+plotH, class:'grid-l'}));
      const lbl = el('text',{x:xForDay(d), y:height-8, class:'day-label', 'text-anchor':'middle'});
      lbl.textContent = d;
      svg.appendChild(lbl);
      const hit = el('rect',{x:x0, y:CHART_PAD.top, width:COL_W, height:plotH, class:'plot-col-hit'});
      hit.addEventListener('click', (ev)=>{
        const rect = svg.getBoundingClientRect();
        const scaleY = height / rect.height;
        const clickY = (ev.clientY - rect.top) * scaleY;
        let hours = minH + ((CHART_PAD.top+plotH - clickY) / plotH) * range;
        hours = Math.max(minH, Math.min(maxH, Math.round(hours*2)/2));
        if(dataObj[d] === hours){ delete dataObj[d]; } else { dataObj[d] = hours; }
        save(); render();
      });
      svg.appendChild(hit);
    }
    svg.appendChild(el('line',{x1:CHART_PAD.left, x2:CHART_PAD.left, y1:CHART_PAD.top, y2:CHART_PAD.top+plotH, class:'grid-l strong'}));
    svg.appendChild(el('line',{x1:CHART_PAD.left, x2:CHART_PAD.left+plotW, y1:CHART_PAD.top+plotH, y2:CHART_PAD.top+plotH, class:'grid-l strong'}));

    // line + dots
    const pts = [];
    for(let d=1; d<=days; d++){
      if(dataObj[d] !== undefined){ pts.push([d, dataObj[d]]); }
    }
    if(pts.length>1){
      const pathStr = pts.map(p=> xForDay(p[0])+','+yForHours(p[1])).join(' ');
      svg.appendChild(el('polyline',{points:pathStr, class:'plot-line'}));
    }
    pts.forEach(p=>{
      const dot = el('circle',{cx:xForDay(p[0]), cy:yForHours(p[1]), r:4, class:'plot-dot'});
      svg.appendChild(dot);
    });
  }

  monthInput.addEventListener('change', load);
  monthInput.addEventListener('input', ()=>{
    localStorage.setItem(ACTIVE_MONTH_KEY, monthInput.value.trim());
  });
  daysSelect.addEventListener('change', ()=>{
    state.days = parseInt(daysSelect.value, 10);
    save(); render();
  });
  addHabitBtn.addEventListener('click', addHabit);
  newTaskInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ addHabit(); } });
  resetBtn.addEventListener('click', ()=>{
    if(confirm('Clear all checkmarks and hours for this month?')){
      state.marks = {}; state.study = {}; state.sleep = {};
      save(); render();
    }
  });
  resetTasksBtn.addEventListener('click', ()=>{
    if(confirm('Remove all tasks from the list? This also clears their checkmarks.')){
      state.habits = []; state.marks = {};
      save(); render();
    }
  });

  const savedMonth = localStorage.getItem(ACTIVE_MONTH_KEY);
  if(savedMonth){ monthInput.value = savedMonth; }
  load();
})();
