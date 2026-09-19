//menu defs
//this defines buttons that will be used on the left hand side, their options, names, icons, and what they do.
const MENUS=[
    {
        icon:'circle',
        className:'menu-btn',
        items:[
            {label:'About This Computer',icon:'laptop',action:()=>alert('clickedatc')},
        ],
    },
    {
        label:'Manager',
        className:'app-name',
        items:[
            {label:'About',icon:'layout-grid',action:()=>alert('clickedmanager')},
        ],
    },
    {
        label:'Menu1',
        className:'menu-label',
        items:[
            {label:'Button1',icon:'app-window',action:()=>alert('clickedmenu1')},
        ],
    },
    {
        label:'Menu2',
        className:'menu-label',
        items:[
            {label:'Button2',icon:'app-window',action:()=>alert('clickedmenu2')},
        ],
    },
];

const menubarLeft=document.getElementById('menubarLeft');
const dropdown=document.getElementById('dropdown');
let openIndex=null;

function renderMenubar() {
    menubarLeft.innerHTML='';
    MENUS.forEach((menu,index)=>{
        const btn=document.createElement('button');
        btn.className=menu.className;
        btn.setAttribute('aria-haspopup','true');
        btn.setAttribute('aria-expanded','false');
        if (menu.icon) {
            btn.innerHTML=`<i data-lucide="${menu.icon}"></i>`;
        } else {
            btn.textContent=menu.label;
        }
        btn.addEventListener('click',(e)=>{
            e.stopPropagation();
            openIndex===index?closeMenu():openMenu(index,btn);
        });
        btn.addEventListener('mouseenter',()=>{
            if (openIndex!==null&&openIndex!==index) openMenu(index,btn);
        });
        menubarLeft.appendChild(btn);
    });
    lucide.createIcons();
}

function openMenu(index,btn) {
    closeLibrary();
    clearActive();
    btn.classList.add('active');
    btn.setAttribute('aria-expanded','true');
    dropdown.innerHTML='';
    MENUS[index].items.forEach((entry)=>{
        if (entry==='-') {
            const sep=document.createElement('div');
            sep.className='sep';
            dropdown.appendChild(sep);
            return;
        }
        const item=document.createElement('div');
        item.className='item'+(entry.disabled?' disabled':'');
        item.setAttribute('role','menuitem');
        const left=document.createElement('span');
        left.className='item-left';
        if (entry.icon) {
            const icon=document.createElement('i');
            icon.setAttribute('data-lucide',entry.icon);
            left.appendChild(icon);
        }
        const label=document.createElement('span');
        label.textContent=entry.label;
        left.appendChild(label);
        item.appendChild(left);
        if (entry.shortcut) {
            const sc=document.createElement('span');
            sc.className='shortcut';
            sc.textContent=entry.shortcut;
            item.appendChild(sc);
        }
        item.addEventListener('click',()=>{
            if (entry.disabled) return;
            closeMenu();
            if (typeof entry.action ==='function') entry.action();
        });
        dropdown.appendChild(item);
    });
    lucide.createIcons();
    dropdown.classList.remove('open');
    void dropdown.offsetWidth;
    dropdown.classList.add('open');
    const rect=btn.getBoundingClientRect();
    const maxLeft=window.innerWidth-dropdown.offsetWidth-6;
    dropdown.style.left=Math.max(6,Math.min(rect.left,maxLeft))+'px';
    openIndex=index;
}

function closeMenu() {
    clearActive();
    openIndex=null;
    if (!dropdown.classList.contains('open')) return;
    dropdown.classList.remove('open');
    dropdown.classList.add('closing');
}

dropdown.addEventListener('animationend',(e)=>{
    if (e.animationName==='menu-out') dropdown.classList.remove('closing');
});

function clearActive() {
    menubarLeft.querySelectorAll('button').forEach((b)=>{
        b.classList.remove('active');
        b.setAttribute('aria-expanded','false');
    });
}

dropdown.addEventListener('click',(e)=>e.stopPropagation());
document.addEventListener('click',()=>{closeMenu();closeLibrary();});
document.addEventListener('keydown',(e)=>{if (e.key==="Escape"){closeMenu();closeLibrary();}});
window.addEventListener('resize',closeMenu);

//clock
const clock=document.getElementById('clock');
function updateClock() {
    const now=new Date();
    const day=now.toLocaleDateString('en-GB',{weekday:'short'});
    const month=now.toLocaleDateString('en-GB',{month:'short'});
    const time=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
    clock.textContent=`${day} ${now.getDate()} ${month}  ${time}`;
}

//weather

updateClock();
setInterval(updateClock,1000);

//weather
//claude gave me these codes
const CODES={
    0:['Clear','sun'],1:['Mostly Clear','sun'],2:['Partly Cloudy','cloud-sun'],3:['Cloudy','cloud'],
    45:['Fog','cloud-fog'],48:['Fog','cloud-fog'],
    51:['Drizzle','cloud-drizzle'],53:['Drizzle','cloud-drizzle'],55:['Drizzle','cloud-drizzle'],
    56:['Freezing Drizzle','cloud-drizzle'],57:['Freezing Drizzle','cloud-drizzle'],
    61:['Light Rain','cloud-rain'],63:['Rain','cloud-rain'],65:['Heavy Rain','cloud-rain'],
    66:['Freezing Rain','cloud-rain'],67:['Freezing Rain','cloud-rain'],
    71:['Light Snow','cloud-snow'],73:['Snow','cloud-snow'],75:['Heavy Snow','cloud-snow'],
    77:['Snow Grains','cloud-snow'],
    80:['Showers','cloud-rain'],81:['Showers','cloud-rain'],82:['Heavy Showers','cloud-rain'],
    85:['Snow Showers','cloud-snow'],86:['Snow Showers','cloud-snow'],
    95:['Thunderstorm','cloud-lightning'],96:['Thunderstorm','cloud-lightning'],99:['Thunderstorm','cloud-lightning'],
};

const widgets=document.getElementById('widgets');

function renderWidgets(w={}) {
    widgets.innerHTML='';
    const el=document.createElement('div');
    el.className='widget weather';
    el.innerHTML=`
    <div class="widget-top">
        <div>
            <div class="widget-place">${w.place??'...'}</div>
            <div class="widget-temp">${w.temp??'--'}&deg;</div>
        </div>
        <i data-lucide="${w.icon??'cloud'}"></i>
    </div>
    <div class="widget-bottom">
        <div>${w.condition??'Loading...'}</div>
        <div class="widget-range">H:${w.high??'--'}&deg; L:${w.low??'--'}&deg;</div>
    </div>`;
    widgets.appendChild(el);
    lucide.createIcons();
}

async function getLocation() {
    const res=await fetch('https://ipwho.is');
    if (!res.ok) throw new Error('loc lookup failed'+res.status);
    const d=await res.json();
    if (!d.success) throw new Error(d.message||'loc lookup failed');
    return {
        place:d.city||d.region||d.country,
        lat:d.latitude,
        lon:d.longitude,
    };
}

async function loadWeather() {
    try {
        const loc=await getLocation();
        const url=`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}`+`&current=temperature_2m,weather_code`+`&daily=temperature_2m_max,temperature_2m_min&timezone=auto`; //claude helped me for this URL
        const res=await fetch(url);
        if (!res.ok) throw new Error('weather request failed'+res.status);
        const data=await res.json();
        const [condition,icon]=CODES[data.current.weather_code]??['Unknown','cloud'];
        renderWidgets({
            place:loc.place,
            temp:Math.round(data.current.temperature_2m),
            high:Math.round(data.daily.temperature_2m_max[0]),
            low:Math.round(data.daily.temperature_2m_min[0]),
            condition,
            icon,
        });
    } catch (e) {
        console.log('weather failed',e);
        renderWidgets({place:'Weather',condition:'Unavailable',icon:'cloud-off'});
    }
}

//app library stuff
const APPS=[
    {name:'app',icon:'layout-grid'},
];

const appsBtn=document.getElementById('appsBtn');
const appsLibrary=document.getElementById('appLibrary');
const appSearch=document.getElementById('appSearch');
const appList=document.getElementById('appList');
let libraryOpen=false;

function renderApps(query='') {
    const q=query.trim().toLowerCase();
    const matches=APPS.filter((a)=>a.name.toLowerCase().includes(q));
    appList.innerHTML='';
    if (!matches.length) {
        appList.innerHTML='<div class="app-empty">No apps found</div>';
        return;
    }
    matches.forEach((app)=>{
        const item=document.createElement('button');
        item.className='app-item';
        item.innerHTML=`
        <span class="app-tile"><i data-lucide="${app.icon}"></i></span>
        <span class="app-name-label">${app.name}</span>`;
        item.addEventListener('click',()=>{
            closeLibrary();
            if (typeof app.action==='function') app.action();
            else openWindow(app);
        });
        appList.appendChild(item);
    });
    lucide.createIcons();
}

function openLibrary() {
    closeMenu();
    appsLibrary.classList.remove('open','closing');
    void appsLibrary.offsetWidth;
    appsLibrary.classList.add('open');
    appsBtn.classList.add('active');
    libraryOpen=true;
    appSearch.value='';
    renderApps();
    appSearch.focus();
}

function closeLibrary() {
    appsBtn.classList.remove('active');
    libraryOpen=false;
    if (!appsLibrary.classList.contains('open')) return;
    appsLibrary.classList.remove('open');
    appsLibrary.classList.add('closing');
}

appsLibrary.addEventListener('animationend',(e)=>{
    if (e.animationName==='library-out') appsLibrary.classList.remove('closing');
});

appsBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    libraryOpen?closeLibrary():openLibrary();
});

appSearch.addEventListener('input',()=>renderApps(appSearch.value));

appSearch.addEventListener('keydown',(e)=>{
    if (e.key!=='Enter') return;
    const first=appList.querySelector('.app-item');
    if (first) first.click();
});

appsLibrary.addEventListener('click',(e)=>e.stopPropagation());
window.addEventListener('resize',closeLibrary);

//window system
const MENUBAR_H=32;
const windowLayer=document.getElementById('windowLayer');
const windows=new Map();
let zTop=1;
let focused=null;

function openWindow(app) {
    //focus if app is already open
    const existing=windows.get(app.name);
    if (existing) {
        existing.classList.remove('minimised');
        focusWindow(existing);
        return existing;
    }
    const win=document.createElement('section');
    win.className='window opening';
    win.dataset.app=app.name;
    //dont OVERLAY LIKE MICROSOFT POODOWS, step down and right
    const step=windows.size%6*26;
    win.style.left=(120+step)+'px';
    win.style.top=(MENUBAR_H+40+step)+'px';
    win.style.width='560px';
    win.style.height='360px';
    win.innerHTML=`
    <div class="titlebar">
        <div class="traffic">   
            <button class="tl-close"><i data-lucide="x"></i></button>
            <button class="tl-min"><i data-lucide="minus"></i></button>
            <button class="tl-zoom"><i data-lucide="plus"></i></button>
        </div>
        <div class="win-title">${app.name}</div>
    </div>
    <div class="win-body"></div>
    <div class="win-resize"></div>`;
    const titlebar=win.querySelector('.titlebar');
    const traffic=win.querySelector('.traffic');
    win.querySelector('.tl-close').addEventListener('click',(e)=>{e.stopPropagation();closeWindow(win);});
    win.querySelector('.tl-min').addEventListener('click',(e)=>{e.stopPropagation();minimiseWindow(win);});
    win.querySelector('.tl-zoom').addEventListener('click',(e)=>{e.stopPropagation();zoomWindow(win);});
    traffic.addEventListener('pointerdown',(e)=>e.stopPropagation());
    titlebar.addEventListener('pointerdown',(e)=>startDrag(e,win));
    titlebar.addEventListener('dblclick',()=>zoomWindow(win));
    win.querySelector('.win-resize').addEventListener('pointerdown',(e)=>startResize(e,win));
    win.addEventListener('pointerdown',()=>focusWindow(win));
    win.addEventListener('animationend',(e)=>{
        if (e.animationName==='window-in') win.classList.remove('opening');
    });
    windowLayer.appendChild(win);
    windows.set(app.name,win);
    focusWindow(win);
    lucide.createIcons();
    return win;
}

function focusWindow(win) {
    if (focused===win&&win.style.zIndex) return;
    if (focused) focused.classList.remove('focused');
    win.classList.add('focused');
    win.style.zIndex=++zTop;
    focused=win;
    setMenubarApp(win.dataset.app);
}

function closeWindow(win) {
    windows.delete(win.dataset.app);
    win.classList.add('closing');
    win.addEventListener('animationend',(e)=>{
        if (e.animationName!=='window-out') return;
        win.remove();
        if (focused===win) {
            focused=null;
            focusTopWindow();
        }
    },{once:true});
}

function minimiseWindow(win) {
    win.classList.add('minimised');
    win.classList.remove('focused');
    if (focused===win) {
        focused=null;
        focusTopWindow();
    }
}

function zoomWindow(win) {
    if (win.classList.contains('maximised')) {
        const old=win.dataset.restore.split(',');
        win.style.left=old[0];
        win.style.top=old[1];
        win.style.width=old[2];
        win.style.height=old[3];
        win.classList.remove('maximised');
        return;
    }
    win.dataset.restore=[win.style.left,win.style.top,win.style.width,win.style.height].join(',');
    win.style.left='0px';
    win.style.top=MENUBAR_H+'px';
    win.style.width='100%';
    win.style.height=`calc(100% - ${MENUBAR_H}px)`;
    win.classList.add('maximised');
    focusWindow(win);
}

function focusTopWindow() {
    let top=null;
    windows.forEach((w)=>{
        if (w.classList.contains('minimised')) return;
        if (!top||Number(w.style.zIndex)>Number(top.style.zIndex)) top=w;
    });
    if (top) focusWindow(top);
    else setMenubarApp('Manager');
}

function setMenubarApp(name) {
    if (MENUS[1].label===name) return;
    MENUS[1].label=name;
    renderMenubar();
}

function startDrag(e,win) {
    if (e.button!==0) return;
    if (win.classList.contains('maximised')) return;
    focusWindow(win);
    const rect=win.getBoundingClientRect();
    const grabX=e.clientX-rect.left;
    const grabY=e.clientY-rect.top;
    win.classList.add('dragging');
    function move(ev) {
        let x=ev.clientX-grabX;
        let y=ev.clientY-grabY;
        x=Math.min(Math.max(x,60-rect.width),window.innerWidth-60);
        y=Math.min(Math.max(y,MENUBAR_H),window.innerHeight-38);
        win.style.left=x+'px';
        win.style.top=y+'px';
    }
    function up() {
        win.classList.remove('dragging');
        window.removeEventListener('pointermove',move);
        window.removeEventListener('pointerup',up);
    }
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',up);
}

function startResize(e,win) {
    if (e.button!==0) return;
    e.stopPropagation();
    focusWindow(win);
    const rect=win.getBoundingClientRect();
    const startX=e.clientX;
    const startY=e.clientY;
    win.classList.add('dragging');
    function move(ev) {
        win.style.width=Math.max(280,rect.width+ev.clientX-startX)+'px';
        win.style.height=Math.max(120,rect.height+ev.clientY-startY)+'px';
    }
    function up() {
        win.classList.remove('dragging');
        window.removeEventListener('pointermove',move);
        window.removeEventListener('pointerup',up);
    }
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',up);
}

renderMenubar();
renderWidgets();
loadWeather();
setInterval(loadWeather,15*60*1000); //15 minutes (15*60) and then 1000 milliseconds to seconds so its correct
lucide.createIcons();