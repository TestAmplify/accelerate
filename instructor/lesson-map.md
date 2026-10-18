# Day 16–21 · Video review and example map

Reviewed against the current branded lesson videos on 18 October 2026.
Times below are approximate positions in those recordings. The videos contain
earlier spoken course numbers and filenames; the student folders use the
current Day 16–21 sequence.

| Current lesson / video | Sections used | Student material |
| --- | --- | --- |
| Day 16 · Foundations & Setup | Tool installation 01:00–11:30; Playwright setup and sample run 11:30–18:27 | Tool checks, project initialization, two generated-style browser tests |
| Day 17 · The Terminal | Navigation/files 01:00–04:00; Git/npm 04:50–11:20; runner and array fix 13:50–19:27 | OS-specific command blocks, working runner, intentional array failure |
| Day 18 · Git & GitHub | Local Git workflow about 05:00–11:30; remotes/branches about 11:30–15:00; save/push demonstration about 15:00–19:59 | Own-repository walkthrough, practice README, command reference |
| Day 19 · HTML & CSS | HTML construction 02:20–13:30; browser preview/inspection throughout; CSS 14:40–18:30; commit/push 19:20–21:30 | Profile HTML and matching CSS |
| Day 20 · Variables & Data Types | Test data 03:30–09:20; additional types 09:40–14:10; let/const 16:30–19:22 | Three independently runnable files |
| Day 21 · Operators & Conditionals | Arithmetic 06:30–09:45; comparisons 10:30–16:20; login branches 17:20–19:10; switch 19:40–21:10; logical operators 22:10–24:31 | Five independently runnable files |

## Deliberate adaptations for beginners

- Kept recorded example values and the recorded `btn-primary` CSS class.
  The supplied lesson HTML sometimes has different capitalization or shorter
  values; the repository uses the recorded code consistently.
- Split the large `day5-variables.js` and `day6-operators.js` recordings into
  separate files. Repeated the small declarations needed by each file so
  students can run any copied file without relying on another snippet.
- Used plain PASS/FAIL and decision messages instead of decorative emoji.
  The Day 17 runner also returns a failing exit status when a test fails.
- Retained the lesson's credential-first if/else order, with explicit steps
  that set both an incorrect password and the attempt count for the lock path.
- Used the recorded OR comparison against `username`; this avoids the
  undeclared `userRole` found in one lesson-reference snippet.
- Kept the const-reassignment error commented out by default, with instructions
  for trying it deliberately and restoring the working file.
- Kept HTML/CSS simple. Added language/encoding/viewport metadata and a local
  portfolio anchor/paragraph so the original `/portfolio` demonstration link
  has a working destination without a server. The form has no backend.
- Corrected setup wording: `npm init playwright@latest` creates a project
  installation. Linked current official requirements instead of preserving
  older environment/version assumptions from the setup recording.
- Added PowerShell equivalents for macOS/Git Bash file commands. Used a new
  student-owned Git repository for the version-control practice.

Source videos: `week4-day16-foundations-and-setup-branded.mp4`,
`week4-day17-the-terminal-branded.mp4`,
`week4-day18-git-and-github-branded.mp4`,
`week4-day19-html-and-css-branded.mp4`,
`week4-day20-variables-and-data-types-branded.mp4`, and
`week5-day21-operators-and-conditionals-branded.mp4`.
