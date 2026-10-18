# Instructor notes

Students start at the root README, choose their day, and copy a single file.
Keep the root and day instructions short; put maintenance details here.

## Lesson mapping

[Reviewed video sections and adaptations](lesson-map.md) records how the
Day 16–21 files match the current branded recordings.

## Check the plain JavaScript examples

From the repository root, with Node.js installed:

```sh
node instructor/check-examples.mjs
```

This checks exact output, independent execution, the deliberate Day 17
failure and its fix, the const error exercise, and the Day 21 decision paths.
It does not install packages or change student files.

Day 16 requires the separate Playwright project described in its README.
Day 19 should also be opened in a browser and checked for its heading,
stylesheet, email format validation, and portfolio link.

## Add the next day

1. Review that day's actual lesson before extracting examples.
2. Add a folder named `day-22-topic`, then continue the numbering.
3. Give each example a number and descriptive filename, starting at `01-`.
4. Make each JavaScript file run on its own. Include the exact run command.
5. In the day README, give the goal, files to copy, expected output, and one
   small change students can try. Label deliberate errors as practice.
6. Test the copied files in a clean practice folder, then update the root
   lesson table and the check script before publishing.

Do not add future lesson code until it has been checked against the lesson.
