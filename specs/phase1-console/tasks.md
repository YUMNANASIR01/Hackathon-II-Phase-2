# Phase 1 Console Application - Tasks

This document lists the atomic tasks required for Phase 1 of the console-based To-Do application.

## High-Level Tasks
- **Refactoring:** Decompose the initial `main.py` into modular components (`models.py`, `services.py`, `cli.py`).
- **Feature Implementation:** Ensure all required To-Do functionalities are correctly implemented.
- **Testing:** Add unit tests for critical business logic.
- **Documentation:** Maintain up-to-date specifications and plans.

## Detailed Atomic Tasks

### Refactoring
- [ ] Create `src/models.py` with `Task` data structure.
- [ ] Create `src/services.py` with data loading/saving and task manipulation functions.
- [ ] Create `src/cli.py` with menu and user interaction logic.
- [ ] Update root `main.py` to import and run `src.cli.main_menu`.

### Core Features (covered by `spec.md`)
- [ ] Implement Add Task functionality.
- [ ] Implement View All Tasks functionality.
- [ ] Implement Update Task functionality.
- [ ] Implement Delete Task functionality.
- [ ] Implement Mark Task as Complete functionality.
- [ ] Implement View Pending Tasks functionality.
- [ ] Implement View Completed Tasks functionality.

### Persistence
- [ ] Ensure `tasks.json` is correctly handled for loading and saving.

### Testing
- [x] Add unit tests for `services.py`.

### Entry Point
- [ ] Verify `main.py` correctly starts the application.
