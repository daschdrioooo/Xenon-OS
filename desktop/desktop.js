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
document.addEventListener('click',closeMenu);
document.addEventListener('keydown',(e)=>{
    if (e.key==='Escape') closeMenu();
});
window.addEventListener('resize',closeMenu);

const clock=document.getElementById('clock');
function updateClock() {
    const now=new Date();
    const day=now.toLocaleDateString('en-GB',{weekday:'short'});
    const month=now.toLocaleDateString('en-GB',{month:'short'});
    const time=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
    clock.textContent=`${day} ${now.getDate()} ${month}  ${time}`;
}

updateClock();
setInterval(updateClock,1000);

renderMenubar();
lucide.createIcons();