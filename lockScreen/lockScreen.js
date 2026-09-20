lucide.createIcons();

function updateDateTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}`;

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-GB', options).replace(',', '');
    document.getElementById('date').textContent = dateStr.replace(',', '');
}

updateDateTime();
setInterval(updateDateTime, 1000);

//auth
const account=JSON.parse(localStorage.getItem('xenon-account')||'null');
if (!account) window.location.replace('../setup/setup.html');
const lockScreen=document.getElementById('lockScreen');
const passcodeInput=document.getElementById('passcode');
const passHint=document.getElementById('passHint');
let attempts=0;
document.getElementById('userName').textContent=account?.name||'User';

function switchState() {
    window.location.href='../desktop/desktop.html';
}

function unlock() {
    passcodeInput.disabled=true;
    passHint.classList.remove('show');
    lockScreen.addEventListener('transitionend',(e)=>{
        if (e.propertyName==='transform') switchState();
    });
    lockScreen.classList.add('unlocked');
}

function wrongPass() {
    attempts++;
    passcodeInput.classList.remove('shake');
    void passcodeInput.offsetWidth;
    passcodeInput.classList.add('shake');
    setTimeout(()=>{passcodeInput.value=''},400);
    if (attempts>=2) {
        passHint.textContent=account.hint?'Hint: '+account.hint:'No hint was set.';
        passHint.classList.add('show');
    }
}

function checkPasscode() {
    if (passcodeInput.value===account.password) unlock();
    else wrongPass();
}

passcodeInput.addEventListener('keydown',(e)=>{
    if (e.key==='Enter') checkPasscode();
});