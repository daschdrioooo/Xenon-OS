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