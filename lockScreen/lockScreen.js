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

//temporary authentication functionality
const PASSCODE='123456';
const lockScreen=document.getElementById('lockScreen');
const passcodeInput=document.getElementById('passcode');

function switchState() {
    window.location.href='../desktop/desktop.html';
}

function unlock() {
    passcodeInput.disabled=true;
    lockScreen.addEventListener('transitionend',(e)=>{
        if (e.propertyName==='transform') switchState();
    });
    lockScreen.classList.add('unlocked');
}

function wrongPass() {
    passcodeInput.classList.remove('shake');
    void passcodeInput.offsetWidth;
    passcodeInput.classList.add('shake');
    setTimeout(()=>{passcodeInput.value=''},400);
}

function checkPasscode() {
    if (passcodeInput.value===PASSCODE) unlock();
    else wrongPass();
}

passcodeInput.addEventListener('keydown',(e)=>{
    if (e.key==='Enter') checkPasscode();
});