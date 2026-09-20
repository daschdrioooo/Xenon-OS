const account={
    name:'',
    username:'',
    password:'',
    verify:'',
    hint:'',
};

const STEPS=[
    {
        id:'account',
        title:'Create a Xenon Account',
        subtitle:'The password you create here will be used to log into the system.',
        body:accountForm,
        check:checkAccount,
    },
];

let index=0;
let direction='forward';

const stepArea=document.getElementById('stepArea');
const backBtn=document.getElementById('back');
const continueBtn=document.getElementById('continueBtn');
const hint=document.getElementById('hint');

function renderStep() {
    const step=STEPS[index];
    stepArea.innerHTML='';
    const el=document.createElement('div');
    el.className='step in-'+direction;
    el.innerHTML=`
    <h1>${step.title}</h1>
    <p class="subtitle">${step.subtitle}</p>`;
    stepArea.appendChild(el);
    if (typeof step.body==='function') step.body(el);
    continueBtn.textContent='Continue';
    backBtn.classList.toggle('hidden',index===0);
    setHint('');
    validate();
    const first=el.querySelector('input');
    if (first) first.focus();
}

function setHint(text,isError=false) {
    hint.textContent=text;
    hint.classList.toggle('error',isError);
}

function validate() {
    const step=STEPS[index];
    if (typeof step.check!=='function') {
        continueBtn.disabled=false;
        return true;
    }
    const result=step.check(false);
    continueBtn.disabled=result!==true;
    return result===true;
}

function next() {
    const step=STEPS[index];
    if (typeof step.check==='function') {
        const result=step.check(true);
        if (result!==true) return setHint(result,true);
    }
    if (index===STEPS.length-1) return finish();
    index++;
    direction='forward';
    renderStep();
}

function back() {
    if (index===0) return;
    index--;
    direction='back';
    renderStep();
}

function finish() {
    localStorage.setItem('xenon-account',JSON.stringify({
        name:account.name,
        username:account.username,
        password:account.password,
        hint:account.hint,
    }));
    localStorage.setItem('xenon-setup-done','true');
    window.location.href='../lockScreen/lockScreen.html';
}

continueBtn.addEventListener('click',next);
backBtn.addEventListener('click',back);

document.addEventListener('keydown',(e)=>{
    if (e.key==='Enter'&&!continueBtn.disabled) next();
});

function accountForm(el) {
    const form=document.createElement('div');
    form.className='form';
    form.innerHTML=`
    <div class="field">
        <input id="fullName" type="text" autocomplete="off" spellcheck="false" placeholder="Your full name" value="${account.name}">
    </div>
    <div class="field">
        <input id="username" type="text" autocomplete="off" spellcheck="false" placeholder="Username" value="${account.username}">
        <p class="help">This will be the name of your xenonHome folder.</p>
    </div>
    <div class="spacer"></div>
    <div class="row">   
        <div class="field">
            <input id="password" type="password" autocomplete="new-password" placeholder="Password" value="${account.password}">
        </div>
        <div class="field">
            <input id="verify" type="password" autocomplete="new-password" placeholder="Verify" value="${account.verify}">
        </div>
    </div>
    <div class="field">
        <input id="passHint" type="text" autocomplete="off" placeholder="Hint (optional)" value="${account.hint}">
    </div>`;
    el.appendChild(form);
    const nameInput=form.querySelector('#fullName');
    const userInput=form.querySelector('#username');
    const passInput=form.querySelector('#password');
    const verifyInput=document.querySelector('#verify');
    const hintInput=document.querySelector('#passHint');
    let userEdited=account.username!=='';
    nameInput.addEventListener('input',()=>{
        account.name=nameInput.value;
        if (!userEdited) {
            account.username=slugify(nameInput.value);
            userInput.value=account.username;
        }
        liveCheck();
    });
    userInput.addEventListener('input',()=>{
        userEdited=true;
        userInput.value=slugify(userInput.value);
        account.username=userInput.value;
        liveCheck();
    });
    passInput.addEventListener('input',()=>{
        account.password=passInput.value;
        liveCheck();
    });
    verifyInput.addEventListener('input',()=>{
        account.verify=verifyInput.value;
        verifyInput.classList.toggle('bad',account.verify.length>=account.password.length&&account.verify!==account.password);
        liveCheck();
    });
    hintInput.addEventListener('input',()=>{
        account.hint=hintInput.value;
    });
}

function liveCheck() {
    if (validate()) setHint('');
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,20);
}

function checkAccount(nag) {
    if (account.name.trim().length<2) return nag?'Enter your full name.':'';
    if (account.username.length<2) return nag?'Pick a username of at least 2 characters.':'';
    if (account.password.length<6) return nag?'Your password needs at least 6 characters.':'';
    if (account.verify!==account.password) return nag?'The passwords do not match.':'';
    return true;
}

renderStep();
lucide.createIcons();