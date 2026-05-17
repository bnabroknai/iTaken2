1. *Accessibility Overhaul in src/index.css and src/App.tsx*: Implement high-contrast colors (Navy/White) and boost base font sizes (min 20px). Ensure a bold, clear sans-serif font stack is used.
2. *Verify Accessibility Changes*: Use `read_file` to confirm the global styles and App layout updates.
3. *Refactor src/components/InputModal.tsx*: Increase interactive element heights (min 80px), enlarge input text, and simplify the "Log" buttons.
4. *Verify InputModal Changes*: Use `read_file` to confirm the modal's accessibility improvements.
5. *Replace src/components/JournalSlots.tsx with High-Visibility Mood Tracker*: Pivot from text-heavy reflections to a simple, large emoji-based mood/pain scale.
6. *Verify Mood Tracker Changes*: Use `read_file` to confirm the new tracker implementation.
7. *Add Persistent 'HELP' Button to src/App.tsx*: Add a large, unmistakably red button anchored at the bottom for emergency assistance.
8. *Verify HELP Button and Core App Logic*: Use `read_file` to confirm the persistent button and final layout integration in `src/App.tsx`.
9. *Run Tests and Build*: Run all relevant tests and the build command (e.g., `npm run lint` and `npm run build`) to ensure the changes are correct and have not introduced regressions.
10. *Complete pre-commit steps*: Ensure proper testing, verification, review, and reflection are done.
11. *Submit*: Finalize and submit the senior-optimized version of the tracker.
