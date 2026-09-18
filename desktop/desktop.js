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
    {name:'app',icon:'layout-grid',action:()=>alert('no apps yet bro who do you think we are.')},
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
            if (typeof app.action==='function') setTimeout(app.action,140);
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

renderMenubar();
renderWidgets();
loadWeather();
setInterval(loadWeather,15*60*1000); //15 minutes (15*60) and then 1000 milliseconds to seconds so its correct
lucide.createIcons();