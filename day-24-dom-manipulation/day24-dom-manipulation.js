// Day 24: open dom.html in your browser. Do not run this file with Node.js.
console.log('DOM manipulation demo started');

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded');

  // 1. Find the elements. IDs here must match the IDs in dom.html.
  const mainTitle = document.getElementById('main-title');
  const demoText = document.querySelector('#demo-text');
  const changeTextBtn = document.getElementById('change-text-btn');
  const testList = document.querySelector('#test-list');

  console.log('Elements found:', {
    title: !!mainTitle,
    text: !!demoText,
    buttons: !!changeTextBtn,
    list: !!testList,
  });

  // 2. Change the page when the user clicks Change Text.
  changeTextBtn.addEventListener('click', function () {
    console.log('Change text button clicked');

    const messages = [
      'Text changed successfully!',
      'DOM manipulation in action!',
      'This is how dynamic content works!',
      'Perfect for automation testing!',
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];
    demoText.textContent = randomMessage;
    demoText.classList.add('highlight');
    mainTitle.textContent = 'DOM Updated!';

    console.log('Text updated to:', randomMessage);
  });

  // 3. Extra practice: working extensions beyond the recorded Change Text demo.
  const addElementBtn = document.getElementById('add-element-btn');
  const dynamicContent = document.getElementById('dynamic-content');
  let addedCount = 0;

  addElementBtn.addEventListener('click', function () {
    addedCount++;
    const paragraph = document.createElement('p');
    paragraph.textContent = 'New element ' + addedCount;
    dynamicContent.appendChild(paragraph);
  });

  const toggleVisibilityBtn = document.getElementById('toggle-visibility-btn');
  toggleVisibilityBtn.addEventListener('click', function () {
    demoText.classList.toggle('hidden');
  });
});
