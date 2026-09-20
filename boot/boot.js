const done=localStorage.getItem('xenon-item-done')==='true';
function switchState() {
    window.location.href=(done?'../lockScreen/lockScreen.html':'../setup/setup.html');
}
setTimeout(switchState, 3000);