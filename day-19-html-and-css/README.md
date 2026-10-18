# Day 19 · HTML & CSS

**Goal:** Build and inspect the profile page from the lesson.

## Copy these two files

1. Make a folder named **profile-practice** and open it in VS Code.
2. Copy [index.html](index.html) into a new file named **index.html**.
3. Copy [style.css](style.css) into a new file named **style.css**.
4. Save both files in that same folder.
5. Find `index.html` in Finder or Windows File Explorer and double-click it
   to open it in your browser.

**Expected:** A navy **Tony Mak** heading, a gray italic bio, an email input,
a blue **Submit** button, and a **View Portfolio** link.
Edit in VS Code, save, then refresh the browser to see your change.

HTML and CSS open in the browser. Do not run them with `node`.
No npm install or extension is needed. Live Server, shown in the recording,
is another way to preview the page if you already have it.

## Inspect the page

Right-click the email field in your browser and choose **Inspect**.
Find `id="email"`, `type="email"`, and `placeholder="Enter email"`.

| Selector | What it finds |
| --- | --- |
| `#profile-name` | The heading with that ID |
| `.bio` | Every paragraph with the bio class |
| `.btn-primary` | The blue button |
| `input[type="email"]` | An input whose type is email |

The form demonstrates page structure and the browser's email format check.
It does not save or send an email; there is no server behind it.
The portfolio link points to a paragraph on this same page so it works locally.

## Try a change

Change `Tony Mak` to your name. Change `navy` to `purple` in the CSS.
Add another `<p class="bio">` paragraph: it will share the bio styling.

To save this page on GitHub, put the two files in the **git-practice** repository
you created on [Day 18](../day-18-git-and-github/). Open its terminal, then run:

```sh
git status
git add index.html style.css
git commit -m "Add my profile page"
git push
```

[Next: Day 20](../day-20-variables/) · [All lessons](../README.md)
