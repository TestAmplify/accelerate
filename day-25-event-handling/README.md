# Day 25 · Event Handling

**Goal:** Connect a user action to a visible response and explain which handler
produced it.

Day 24 found elements and changed their content. Today, you attach functions
to those elements so the page responds to clicks and mouse movements.
An **event** signals that something happened; an **event handler** is the
function that runs in response.

## 1. Copy all three files

Create a folder named **day25-events-practice** and open it in VS Code. Copy
and save these files together, keeping the exact names:

| File | What it does |
| --- | --- |
| [events.html](events.html) | Provides the click box, hover box, buttons, and event log |
| [style.css](style.css) | Defines the boxes and the green clicked state |
| [day25-events.js](day25-events.js) | Registers the handlers and writes log messages |

Double-click `events.html` in Finder on Mac or File Explorer on Windows to
open it in your browser. No npm install, server, account, or extension is needed.
Live Server is optional. Use a mouse or trackpad to try the hover example.

**Expected at first:** An **Event Handling for Automation** heading, **Click me!**
and **Hover over me!** boxes, **Reset Events** and **Simulate Automation** buttons,
and an empty event log. The two boxes also show **(Practice requirement)**,
as in the recording.

This code uses the browser's DOM. Do not run `node day25-events.js`.
The `<script>` tag sits after the HTML elements, so they exist before this
script selects them. Day 24 instead wrapped its code in `DOMContentLoaded`.

## 2. Click · count, change, log

Click the **Click me!** box once, then again.

| Action | Visible response | New log message |
| --- | --- | --- |
| First click | The box turns green and says `Clicked 1 time!` | `Clicked the box (1)` |
| Second click | The box says `Clicked 2 times!` | `Clicked the box (2)` |

Find the `clickBox.addEventListener('click', ...)` block in the JavaScript:

1. `clickCount++` increases the stored number by 1.
2. `classList.add('clicked')` applies the green CSS style.
3. `textContent` updates the text inside the box.
4. `log(...)` adds a message to the event log.

`let clickCount = 0` must exist before the handler uses it. Each click calls
the handler once; this is **not a loop**. The counter keeps its value between
clicks until you reset or refresh the page.

The click box is a real HTML button here, so you can also focus it with Tab
and activate it with Enter or Space.

## 3. Mouse enter and leave

Move the pointer into the **Hover over me!** box, then move it outside.

| Event | Visible response | New log message |
| --- | --- | --- |
| `mouseenter` | Yellow background; `Mouse is over!` | `Mouse entered the hover box` |
| `mouseleave` | Original background and text return | `Mouse left the hover box` |

These are two separate handlers. `hoverBox.style.backgroundColor` changes
one style directly. Setting it back to `''` removes that inline setting,
allowing CSS to control the color again.

The CSS `:hover` rule also changes the border while the pointer is over a box.
That CSS rule does not write log messages; the JavaScript handlers do.

## 4. Follow the log function

The same `log(message)` function is reused by the handlers:

```js
const line = document.createElement('div');
line.textContent = message;
eventLog.appendChild(line);
```

It creates a new element, puts text into it, then attaches it to the event log.
Each call adds a line. The next line in the function scrolls the log to show
the newest message.

`classList.add` and `classList.remove` change **CSS classes** on an existing
element. `appendChild` adds an **element** to the DOM. They do different jobs.

## 5. Reset · return to a known starting point

Click **Reset Events** after clicking and hovering.

**Expected:** Both boxes return to their original text, the click count returns
to 0, the green and yellow changes are removed, and the old log messages are
replaced by one line:

```text
All reset!
```

Click the click box again. It should say **Clicked 1 time!**, not continue the
previous count. Resetting both the stored number and the visible state makes
the exercise repeatable. Refreshing the page also starts again, with an empty log.

## 6. Simulate actions from JavaScript

Click **Reset Events**, then **Simulate Automation**. Keep your pointer on the
button so you do not add extra mouse-enter/leave messages yourself.
After the short yellow state, the event log should contain:

```text
All reset!
Simulating actions...
Clicked the box (1)
Mouse entered the hover box
Mouse left the hover box
```

The click box is green and says **Clicked 1 time!**. The hover box has returned
to its original text. The simulation button becomes available again.

Follow the last handler in the JavaScript:

- `clickBox.click()` triggers the click handler without moving your pointer.
- `dispatchEvent(new MouseEvent('mouseenter'))` sends a synthetic event to
  the hover box; its existing handler runs.
- `setTimeout(..., 800)` schedules the synthetic mouse-leave event after
  about 800 milliseconds. The delay lets you see the yellow state.

The simulation button is disabled during the sequence to prevent overlapping
runs. Reset cancels any pending mouse-leave timer so a message cannot appear
after the reset. These two small additions make repeated practice predictable.

**Connection to Playwright:** This button demonstrates the page's event handlers
using ordinary browser JavaScript. It is not a Playwright test and has no
assertions. Sending a synthetic event does not move the real pointer or prove
an element is visible and clickable. Later, Playwright's `click()` and `hover()`
actions let a test interact with the page and assert the resulting behavior.
The 800 ms demo delay is not a fixed wait to copy into a test.

## 7. Practice · change one thing at a time

Save in VS Code and refresh the browser after each edit.

| Change | Action | Expected result |
| --- | --- | --- |
| Change the `mouseenter` handler's `#fff3cd` to `lightblue` | Move into the hover box | The box becomes light blue; enter/leave messages still appear |
| Change `800` to `1500` in `setTimeout` | Reset, then simulate | The yellow state lasts about 1.5 seconds |
| Restore `800` | Simulate, then immediately click Reset Events | Only `All reset!` remains, even after the original delay |

Restore the original color and delay when finished. Also try reset → click
twice → reset → click once. The final visible count should be 1.

## If something does not work

| Symptom | What to inspect |
| --- | --- |
| Nothing responds | Keep all three files together. `events.html` must load `day25-events.js` exactly. Look for errors in the browser Console. |
| Cannot read properties of null | Compare the HTML IDs with the five `getElementById` calls. Put the script tag after the page elements. |
| `clickCount is not defined` | Restore `let clickCount = 0` before the handlers. |
| No hover response on a phone | Try a desktop mouse/trackpad, or use Simulate Automation to send the events. Touch is a different interaction. |
| Extra mouse messages appear | Move the pointer away from the hover box before Reset and Simulate. Actual pointer movement also runs those handlers. |

## Match the recording

This is **Week 5 / Day 25**. The recording builds `events.html` and an event
script, and demonstrates fixing a filename mismatch. Here, the matching
`<script src="day25-events.js">` is already supplied. Keep the filenames above;
you do not need to reproduce the missing-file error.

CSS is separated from HTML. The click box is a button instead of a clickable
`div` to support keyboard activation. The count uses `time` for 1 and `times`
for other values. The handlers, counter, color changes, log, reset, and
simulated sequence follow the lesson.

References: [MDN · dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
· [Playwright · Actions](https://playwright.dev/docs/input).

[Previous: Day 24](../day-24-dom-manipulation/)
· [Next: Day 26](../day-26-es6-features/)
· [Copying and running help](../START-HERE.md)
· [All lessons](../README.md)
