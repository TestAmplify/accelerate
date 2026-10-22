# Day 24 · DOM Manipulation

**Goal:** Find an HTML element, read it, and change what appears on the page.

Day 23 organized values in arrays and objects. Today, an array holds the
messages that JavaScript can display in an HTML paragraph.

The **DOM** means **Document Object Model**: the browser's representation of
the HTML page as objects. JavaScript can find those objects and change them.

## 1. Copy all three files

Create a folder named **day24-dom-practice** and open it in VS Code. Copy and
save these files in that same folder, keeping the exact names:

| File | What it does |
| --- | --- |
| [dom.html](dom.html) | Provides the heading, paragraph, three buttons, and list |
| [style.css](style.css) | Styles the page and defines `highlight` and `hidden` |
| [day24-dom-manipulation.js](day24-dom-manipulation.js) | Finds elements and changes the page |

Find `dom.html` in Finder on Mac or File Explorer on Windows and double-click
it to open it in your browser. You do not need npm, a server, or an extension.
Live Server, shown in the recording, is optional if you already use it.

**Expected at first:** A **DOM Manipulation Demo** heading, the paragraph
**This text will change dynamically**, three buttons, and Test Item 1 and 2.

This JavaScript runs **in the browser**, where `document` exists. Do not run
`node day24-dom-manipulation.js`; Node.js does not provide this browser DOM.

## 2. Find the elements

Right-click the heading in the browser and choose **Inspect**. In Developer
Tools, find `<h1 id="main-title">`. Then choose the **Console** tab and refresh.
You should see:

```text
DOM manipulation demo started
DOM fully loaded
Elements found: {title: true, text: true, buttons: true, list: true}
```

Your browser may display the object as an expandable row. Expand it to see
the four properties; their formatting can differ from the text above.

Open the JavaScript file and compare these lines with the HTML:

```js
const mainTitle = document.getElementById('main-title');
const demoText = document.querySelector('#demo-text');
```

`getElementById` takes the ID **without** `#`. `querySelector` takes a CSS
selector: `#demo-text` means an element with that ID. It returns the first match.
Either method returns `null` when nothing matches. `!!` converts each result
to `true` or `false` for the **Elements found** message.

The code runs inside `DOMContentLoaded`, after the browser has parsed the HTML.
That lets it find the heading, paragraph, and buttons before using them.

## 3. Change the text

Click **Change Text** once.

**Expected:**

- The heading becomes **DOM Updated!**.
- The paragraph has a yellow background and contains one message from the array.
- The Console logs **Change text button clicked** and **Text updated to:**
  followed by the selected message.

The four possible messages are:

```text
Text changed successfully!
DOM manipulation in action!
This is how dynamic content works!
Perfect for automation testing!
```

Click again. The same message can appear twice in a row: random selection does
not guarantee a different message on every click.

Follow the code in this order:

1. `addEventListener('click', ...)` registers the function to run on a click.
2. `Math.random()` produces a number from 0 up to, but not including, 1.
3. Multiplying by `messages.length` and applying `Math.floor` gives an index
   from 0 through 3. The index selects a message from the array.
4. `demoText.textContent = randomMessage` replaces the paragraph's text.
5. `classList.add('highlight')` adds the CSS class that colors its background.
6. `mainTitle.textContent = 'DOM Updated!'` changes the visible heading.

`textContent` reads or sets text. It does not interpret a string as HTML.
`classList` changes the element's CSS classes; it does not add list items.
Adding a class only changes appearance when CSS defines a style for it.

## 4. Try a controlled change

In your copy of the JavaScript, replace:

```js
const randomIndex = Math.floor(Math.random() * messages.length);
```

with:

```js
const randomIndex = 0;
```

Save, refresh the browser, then click **Change Text**. The paragraph should
always show **Text changed successfully!**, the first array item.
Try index `1`: it should show **DOM manipulation in action!**.
Restore the original random-selection line when finished.

This connects to Day 23: indexes start at 0, so an index of 4 would be outside
this four-item array.

## 5. Extra practice · add and hide content

The recording leaves **Add Element** and **Toggle Visibility** as things to
explore. This repository includes working handlers for both, in the section
marked **Extra practice** below the main Change Text example.

| Action | Expected result |
| --- | --- |
| Click Add Element once | `New element 1` appears below the buttons |
| Click it again | `New element 2` appears below the first new paragraph |
| Click Toggle Visibility | The message paragraph disappears |
| Click Toggle Visibility again | The same paragraph reappears |
| Refresh the browser | The original heading and paragraph return; new paragraphs are gone |

`createElement('p')` makes a paragraph object. `appendChild` attaches it to
`dynamic-content`, making it part of the visible page. `classList.toggle`
adds or removes `hidden`; the CSS rule `display: none` hides the paragraph.

**Try it:** Change `'New element '` to `'My test note '`, save, refresh, and
click Add Element. You should see **My test note 1**.

## If something does not work

| Symptom | What to inspect |
| --- | --- |
| Buttons do nothing | Keep all three files together. In `dom.html`, `script src` must be `day24-dom-manipulation.js`. Read errors in the browser Console. |
| A value in Elements found is false | Compare that selector with the matching HTML ID, including spelling and dashes. |
| Cannot read properties of null | JavaScript tried to use an element it did not find. Restore matching IDs and refresh. |
| The paragraph is hidden | Click Toggle Visibility again, or refresh to restore the starting page. |
| The page did not reflect your edit | Save the file in VS Code, then refresh the browser. |

## Match the recording

This is **Week 5 / Day 24**. The recording may show `day9-dom-manipulation.js`
and an earlier `week2` folder. Here, `dom.html` already links the current
filename, `day24-dom-manipulation.js`. Use these files together.
CSS is in a separate file to keep the HTML easier to read. The code uses
`classList.add('highlight')` rather than replacing `className`, so highlighting
does not remove other classes, such as `hidden`.

Continue to Day 25 to look more closely at event handlers and their results.

Reference: [MDN · DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event).

[Previous: Day 23](../day-23-arrays-and-objects/)
· [Next: Day 25](../day-25-event-handling/)
· [Copying and running help](../START-HERE.md)
· [All lessons](../README.md)
