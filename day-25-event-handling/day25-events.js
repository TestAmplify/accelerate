// Day 25: open events.html in your browser. Do not run this file with Node.js.
// The script tag is after the page elements, so they exist when this file runs.
const clickBox = document.getElementById('click-box');
const hoverBox = document.getElementById('hover-box');
const resetBtn = document.getElementById('reset-btn');
const simulateBtn = document.getElementById('simulate-btn');
const eventLog = document.getElementById('event-log');

let clickCount = 0;
let leaveTimer;

// Make each message a new line in the page's event log.
function log(message) {
  const line = document.createElement('div');
  line.textContent = message;
  eventLog.appendChild(line);
  eventLog.scrollTop = eventLog.scrollHeight;
}

clickBox.addEventListener('click', () => {
  clickCount++;
  const times = clickCount === 1 ? 'time' : 'times';
  clickBox.classList.add('clicked');
  clickBox.textContent = `Clicked ${clickCount} ${times}!`;
  log(`Clicked the box (${clickCount})`);
});

hoverBox.addEventListener('mouseenter', () => {
  hoverBox.style.backgroundColor = '#fff3cd';
  hoverBox.textContent = 'Mouse is over!';
  log('Mouse entered the hover box');
});

hoverBox.addEventListener('mouseleave', () => {
  hoverBox.style.backgroundColor = '';
  hoverBox.textContent = 'Hover over me! (Practice requirement)';
  log('Mouse left the hover box');
});

resetBtn.addEventListener('click', () => {
  // Cancel an unfinished simulation so it cannot add a message after reset.
  clearTimeout(leaveTimer);
  simulateBtn.disabled = false;
  clickCount = 0;
  clickBox.classList.remove('clicked');
  clickBox.textContent = 'Click me! (Practice requirement)';
  hoverBox.style.backgroundColor = '';
  hoverBox.textContent = 'Hover over me! (Practice requirement)';
  eventLog.textContent = '';
  log('All reset!');
});

simulateBtn.addEventListener('click', () => {
  // Avoid overlapping simulations while this sequence is running.
  simulateBtn.disabled = true;
  log('Simulating actions...');
  clickBox.click();
  hoverBox.dispatchEvent(new MouseEvent('mouseenter'));

  // This delay makes the yellow state visible. It is not a test assertion.
  leaveTimer = setTimeout(() => {
    hoverBox.dispatchEvent(new MouseEvent('mouseleave'));
    simulateBtn.disabled = false;
  }, 800);
});
