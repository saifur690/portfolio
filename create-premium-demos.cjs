const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const names = ['personal-portfolio', 'landing-page', 'todo-list', 'product-page'];
const rect = (x,y,w,h,c,r=12,stroke='none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="${stroke}"/>`;
const text = (x,y,s,size=16,c='#f4f5f7',weight=400) => `<text x="${x}" y="${y}" fill="${c}" font-size="${size}" font-weight="${weight}" font-family="Arial, sans-serif">${s}</text>`;
const line = (x,y,x2,y2,c='#30343d') => `<path d="M${x} ${y}L${x2} ${y2}" stroke="${c}" fill="none"/>`;
const circle = (x,y,r,c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const ease = t => {t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const pill = (x,y,w,label,bg='#242832',fg='#d3d8e2') => rect(x,y,w,30,bg,15)+text(x+13,y+20,label,12,fg,600);
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650"><defs><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#5782fb"/><stop offset="1" stop-color="#142b77"/></linearGradient><linearGradient id="purple" x2="1" y2="1"><stop stop-color="#9380f8"/><stop offset="1" stop-color="#d1c7ff"/></linearGradient><linearGradient id="metal" x2="1" y2="0"><stop stop-color="#343a42"/><stop offset=".45" stop-color="#949da6"/><stop offset="1" stop-color="#252b33"/></linearGradient></defs>${body}</svg>`;

function portfolio(t) {
  const shift=ease((t-3)/1.1)*275;
  let s=rect(0,0,1000,650,'#101319',0);
  s+=`<g transform="translate(0,${-shift})">`;
  s+=pill(48,105,190,'AVAILABLE FOR PROJECTS','#1c2a24','#a6d9b6');
  s+=text(48,205,'Thoughtful design.',57,'#f7f7f5',700)+text(48,270,'Built for the web.',57,'#a9b5cf',700);
  s+=text(50,314,'I turn ideas into fast, intuitive digital experiences.',18,'#a5aebb');
  s+=rect(48,344,174,47,'#dfe8ff',24)+text(74,373,'Explore my work ↗',15,'#19243a',700);
  s+=`<g transform="translate(748,245) rotate(${t*3})"><rect x="-103" y="-103" width="206" height="206" rx="48" fill="url(#blue)" transform="rotate(22)"/><rect x="-74" y="-74" width="148" height="148" rx="34" fill="#101319" transform="rotate(22)"/><rect x="-44" y="-44" width="88" height="88" rx="20" fill="#91b0ff" transform="rotate(22)"/></g>`;
  s+=line(48,429,952,429)+text(48,481,'Selected work',28,'#f4f5f7',700)+text(821,480,'2025 — 2026',14,'#8993a6');
  for(let i=0;i<3;i++){
    const x=48+i*308,hover=i===1?ease((t-5)/.7)*8:0;
    s+=`<g transform="translate(0,${-hover})">`+rect(x,510,288,215,['#223562','#cec9ea','#d7dfd1'][i],15);
    if(i===0){s+=text(x+24,550,'NORTHSTAR',12,'#b9d0ff',700)+text(x+24,608,'A clearer view.',27,'#fff',700);for(let j=0;j<7;j++)s+=rect(x+26+j*34,689-(j%4+1)*18,22,(j%4+1)*18,'#7fa8ff',4);}
    if(i===1){s+=text(x+24,550,'STUDIO / 02',12,'#51436d',700);s+=circle(x+148,627,65,'#756596')+circle(x+148,627,39,'#cec9ea')+line(x+45,686,x+240,568,'#fff');}
    if(i===2){s+=text(x+24,550,'FORM &amp; FUNCTION',12,'#47594b',700)+rect(x+64,576,160,100,'#36493c',25)+rect(x+82,592,124,68,'#bacab8',14)+text(x+102,634,'Create.',21,'#36493c',700);}
    s+=text(x,758,['Analytics platform','Creative studio','Product experience'][i],19,'#f4f5f7',600)+text(x,785,['Dashboard / Development','Brand / Digital design','E-commerce / Interface'][i],13,'#9ca6b8')+'</g>';
  }
  s+='</g>';
  s+=rect(0,0,1000,76,'#101319',0)+text(48,46,'SAIF / STUDIO',19,'#f4f5f7',700)+text(628,45,'Work',14,'#cad1df')+text(710,45,'About',14,'#cad1df')+pill(805,23,145,'Let’s talk  ↗','#232936')+line(48,75,952,75);
  return wrap(s);
}

function landing(t) {
  let s=rect(0,0,1000,650,'#f6f5fa',0)+text(45,49,'pulse',27,'#272238',700)+text(495,45,'Platform     Solutions     Pricing',14,'#625d72')+pill(820,23,134,'Get started  ↗','#292333','#fff');
  s+=pill(48,110,196,'ONE WORKSPACE. IN SYNC.','#e8e3f6','#685194');
  s+=text(48,203,'Less busywork.',52,'#24212e',700)+text(48,264,'More momentum.',52,'#7662bc',700);
  s+=text(50,311,'Plan, collaborate and see what comes next.',18,'#716b7e')+rect(48,343,172,46,'#7662bc',23)+text(72,372,'Start your workspace',14,'#fff',700);
  s+=rect(560,108,391,287,'#fff',17,'#e4dfed')+text(586,146,'Workspace overview',17,'#2d283a',700)+pill(812,123,110,'This month','#f0edf7','#6b617e');
  s+=text(586,194,'Weekly activity',13,'#756e85')+text(586,235,String(Math.round(1280+ease(t/2)*560)),36,'#30283e',700)+text(737,231,'↑ 24.8%',14,'#42775f',700);
  for(let i=0;i<12;i++){const h=(25+((i*31)%91))*ease((t-i*.055)/1.1);s+=rect(587+i*28,361-h,17,h,i>8?'#8a73d2':'#ddd5f1',5);}
  s+=text(585,381,'MON',10,'#8b8399')+text(878,381,'SUN',10,'#8b8399');
  s+=text(48,455,'Make room for your best work.',26,'#30283e',700);
  ['One shared plan','Progress, in focus','Built for your team'].forEach((label,i)=>{const x=48+i*308;const active=Math.floor(t/2)%3===i;s+=rect(x,484,288,126,active?'#eae5f5':'#fff',14,'#e3deed')+circle(x+31,516,12,active?'#8a73d2':'#c5badf')+text(x+24,553,label,19,'#30283e',700)+text(x+24,581,['Bring every project together.','Know exactly where you stand.','Keep everyone moving forward.'][i],13,'#716b7e');});
  return wrap(s);
}

function tasks(t) {
  const added=t>2.8,done=t>5.5;
  let s=rect(0,0,1000,650,'#12151b',0)+rect(0,0,208,650,'#191d25',0)+text(28,52,'focus /',26,'#f3f5fa',700);
  s+=text(28,108,'WORKSPACE',11,'#818ba0',700)+rect(16,129,176,42,'#2b3444',9)+text(35,156,'◉  My tasks',15,'#d6e3ff',600)+text(35,207,'◷  Upcoming',15,'#9ca6b8')+text(35,256,'▦  Projects',15,'#9ca6b8')+line(28,288,180,288)+text(28,326,'YOUR PROJECTS',11,'#818ba0',700);
  ['Website launch','Design system','Personal'].forEach((v,i)=>{s+=circle(35,362+i*39,4,['#a3b8ee','#c3a4da','#8cc8b4'][i])+text(51,367+i*39,v,13,'#b3bdce');});
  s+=text(242,51,'My tasks',16,'#aab4c8')+pill(807,24,158,'+  Invite a teammate','#252c38','#c6d0e1')+line(208,76,1000,76);
  s+=text(246,137,'A little focus. A lot done.',32,'#f4f6fb',700)+text(246,170,'Your next great idea starts with one small task.',15,'#9ca6b8');
  for(let i=0;i<3;i++){const x=246+i*240;s+=rect(x,201,222,91,'#1c222c',12)+text(x+18,227,['TASKS TODAY','COMPLETED','FOCUS TIME'][i],10,'#9ca6b8',700)+text(x+18,267,[added?'05':'04',done?'03':'02','2h 40m'][i],28,'#e7edf8',700);}
  s+=rect(246,315,702,48,'#1c222c',10,'#384153')+text(264,345,t<2.8?('Review the mobile experience'.slice(0,Math.floor(Math.max(0,t-.4)*14))||'Add a task…'):'Add your next task…',15,'#b9c7dd')+pill(856,324,78,'+ Add','#b7caf7','#172237');
  const labels=['Define the project direction','Build reusable components','Polish the interaction details',...(added?['Review the mobile experience']:[])];
  labels.forEach((v,i)=>{const y=389+i*50,check=i===0||(done&&i===1);s+=rect(246,y,702,43,'#191f28',8)+rect(262,y+12,19,19,check?'#9db9ee':'#293342',5)+text(297,y+28,v,15,check?'#8999af':'#d7dfec');if(check)s+=`<path d="M266 ${y+21}l4 4 7-9" stroke="#192337" stroke-width="2" fill="none"/>`;s+=pill(837,y+7,96,['Strategy','Frontend','Design','Review'][i],'#262e3c','#aebed6');});
  s+=rect(246,611,702,4,'#2b3240',2)+rect(246,611,702*(done?.6:.4),4,'#a5bcea',2);
  return wrap(s);
}

function product(t) {
  const team=t>3.2, purchased=t>6.8;
  const ink='#2c263d',muted='#797185',purple='#7c63c5';
  let s=rect(0,0,1000,650,'#f6f4fa',0)+text(44,47,'forma.',27,ink,700)
    +text(487,44,'Overview     Components     Reviews',13,muted)
    +pill(827,22,128,'Explore kits','#e9e3f6','#685194')+line(44,73,955,73,'#e5dfed');
  s+=pill(44,111,192,'THE DIGITAL PRODUCT KIT','#eae4f6','#755aa9');
  s+=text(44,201,'Your next launch,',45,ink,700)+text(44,254,'beautifully built.',45,purple,700)
    +text(46,299,'A refined dashboard kit for modern products.',16,muted)
    +text(46,326,'Thoughtful components. Ready to make yours.',16,muted);
  s+=rect(44,358,326,43,'#e9e4f1',22)
    +rect(team?208:48,362,158,35,'#fff',18)
    +text(78,385,'Personal license',12,team?muted:ink,600)
    +text(242,385,'Team license',12,team?ink:muted,600);
  s+=text(44,455,team?'$129':'$49',43,ink,700)+text(team?160:136,452,'one-time payment',13,muted)
    +rect(44,482,327,49,purchased?'#487660':purple,25)
    +text(purchased?133:138,513,purchased?'Kit added to bag':'Get the kit',15,'#fff',700)
    +text(46,559,'Lifetime updates included',12,muted);
  // A complete miniature product preview, with animated data and a chart.
  s+=rect(485,109,472,365,'#e6dff2',18)
    +rect(498,122,446,337,'#fff',12)
    +rect(498,122,91,337,'#f0edf6',12)
    +text(512,151,'forma',15,'#716084',700);
  ['Overview','Analytics','Customers','Settings'].forEach((v,i)=>{
    if(i===0)s+=rect(506,174,75,25,'#ded3ef',6);
    s+=text(513,191+i*36,v,10,i===0?'#715599':'#8b8097',i===0?600:400);
  });
  s+=text(608,154,'Overview',17,ink,700)+pill(819,135,107,'Last 30 days','#f3f0f8','#80718f');
  const progress=ease(t/2.2);
  for(let i=0;i<3;i++){
    const x=607+i*108;s+=rect(x,177,99,64,'#faf8fc',8,'#ebe5f1')
      +text(x+10,196,['REVENUE','CUSTOMERS','GROWTH'][i],8,muted,600)
      +text(x+10,223,[`$${Math.round(18400+progress*4000).toLocaleString('en-US')}`,String(Math.round(1040+progress*244)),'+18.6%'][i],17,ink,700);
  }
  s+=text(608,271,'Revenue over time',12,ink,600)+text(857,271,'+24.8%',10,'#5e8b73',600);
  for(let i=0;i<3;i++)s+=line(608,299+i*32,921,299+i*32,'#eeeaf4');
  const pts=Array.from({length:10},(_,i)=>[609+i*34,369-(20+[3,10,7,28,21,43,37,65,59,83][i])*progress]);
  s+=`<path d="M609 378 L${pts.map(p=>p.join(' ')).join(' L')} L915 378Z" fill="#eee7fa"/>`
    +`<path d="M${pts.map(p=>p.join(' ')).join(' L')}" fill="none" stroke="${purple}" stroke-width="3" stroke-linejoin="round"/>`;
  s+=text(608,402,'01 JUN',8,muted)+text(886,402,'30 JUN',8,muted)
    +rect(607,419,315,23,'#f5f2f9',5)+circle(619,430,3,'#80ac92')+text(628,434,'All systems up to date',9,'#82738d');
  s+=text(488,511,'Everything you need to get started.',18,ink,700);
  ['80+ components','Fully responsive','Easy to customize'].forEach((v,i)=>{
    const x=487+i*159;s+=rect(x,534,149,67,'#fff',10,'#e7e0f0')+circle(x+18,553,4,'#af9bd2')+text(x+13,580,v,11,'#746386',600);
  });
  if(purchased){const y=81+8*(1-ease((t-6.8)/.4));s+=rect(675,y,270,43,'#e4f0e8',10,'#c4dfce')+circle(694,y+21,5,'#629575')+text(709,y+26,'Your next project starts here.',12,'#467056',600);}
  return wrap(s);
}

(async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1000,height:650},deviceScaleFactor:1});
    for(const [i,name] of names.entries()){
      if(process.argv[2] && process.argv[2]!==name) continue;
      const frames=path.join(__dirname,'premium-frames-'+name);fs.mkdirSync(frames,{recursive:true});
      const scene=[portfolio,landing,tasks,product][i];
      await page.setContent('<body style="margin:0;overflow:hidden"></body>');
      for(let f=0;f<180;f++){
        await page.evaluate(svg=>document.body.innerHTML=svg,scene(f/20));
        await page.screenshot({path:path.join(frames,String(f).padStart(4,'0')+'.png')});
      }
      fs.copyFileSync(path.join(frames,i===2?'0130.png':'0030.png'),path.join(root,'images',`project-${i+1}-premium.png`));
      const output=path.join(root,'videos',name+'-premium.mp4');
      const result=spawnSync(path.join(__dirname,'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'),['-y','-framerate','20','-i',path.join(frames,'%04d.png'),'-t','9','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',output],{windowsHide:true,encoding:'utf8'});
      if(result.status!==0)throw Error(result.stderr);
      console.log(name+': '+fs.statSync(output).size+' bytes, 9 seconds');
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
