# Day 18 · Git & GitHub

**Goal:** Save a change locally, then push it to a repository you own.

Git saves snapshots (commits) on your computer. GitHub hosts repositories online.
You can use the Accelerate examples without an account; pushing your own work
requires your own GitHub account and repository.

## 1. Make your own local repository

Create a new empty folder named **git-practice** outside the downloaded
Accelerate folder. Open it in VS Code and choose **Terminal → New Terminal**.
Run one line at a time:

```sh
git init
git branch -M main
git status
```

Copy [README-practice.md](README-practice.md) into this new folder and save it
as **README.md**. It should appear as an untracked file in `git status`.

## 2. Save your first snapshot

```sh
git add README.md
git status
git commit -m "Add my practice README"
git log --oneline
git status
```

Expect a commit in the log and `nothing to commit, working tree clean`.
If Git asks who you are, set your identity for this practice repository,
replacing both example values with your own name and email, then retry the commit:

```sh
git config user.name "Your Name"
git config user.email "YOUR_EMAIL"
```

## 3. Change, review, and commit again

Add `This is my second change.` to README.md in VS Code and save it.

```sh
git diff
git status
git add README.md
git commit -m "Update my practice README"
git log --oneline
```

You should now see two commits. Their letters and numbers will differ from
anyone else's; each commit has its own ID.

## 4. Push to your own GitHub repository

On GitHub create a new repository named **git-practice**. Leave the options
to add a README, .gitignore, and license unchecked so it starts empty.

In the commands below replace **YOUR_USERNAME** with your GitHub username.
Use your own repository URL, then run:

```sh
git remote add origin https://github.com/YOUR_USERNAME/git-practice.git
git remote -v
git push -u origin main
```

Follow Git's sign-in prompt if it appears. Refresh your new GitHub repository:
your README and commits should be visible. Push to your own repository;
`TestAmplify/accelerate` is the course library you are reading.

## Useful commands from the lesson

| Command | What it does |
| --- | --- |
| `git status` | Shows changed, staged, and untracked files |
| `git diff` | Shows edits you have not staged |
| `git diff --staged` | Shows edits staged for your next commit |
| `git restore --staged README.md` | Unstages the file, keeping your edits; use after a first commit exists |
| `git branch` | Lists local branches |
| `git checkout -b practice-change` | Creates and switches to a new branch |
| `git checkout main` | Switches back to main; commit your branch edits first |
| `git merge practice-change` | Brings the practice branch's commits into the current branch |
| `git fetch origin` | Downloads remote history without merging it |
| `git pull origin main` | Downloads and merges main; start with a clean working tree |
| `git push` | Uploads new commits after the first `push -u` |
| `git clone URL` | Copies an existing repository; replace URL with its real link |

The recording uses an earlier repository name. Your practice repository is
**git-practice**, and the default branch in these instructions is **main**.

[Next: Day 19](../day-19-html-and-css/) · [All lessons](../README.md)
