# To-Do Application - Phase I: Add Task Feature Specification

## 1. Feature Name: Add New Task

## 2. Objective
To allow users to create a new To-Do task by providing a title, description, and due date. The system should assign a unique ID and set the initial status to "Pending".

## 3. User Story
As a user, I want to add new tasks to my To-Do list so that I can keep track of my responsibilities.

## 4. Pre-conditions
- The To-Do application main menu is displayed.
- The user has access to a terminal or command-line interface.

## 5. Input
The user will be prompted to enter the following information:
- **Task Title:** A string representing the name of the task (e.g., "Buy Groceries", "Finish Report").
- **Task Description:** A string providing more details about the task (e.g., "Milk, eggs, bread", "Prepare slides for meeting").
- **Due Date:** A string in `YYYY-MM-DD` format (e.g., "2025-12-31").

## 6. Process Flow
1. User selects option `1` ("Add a new task") from the main menu.
2. The system prompts the user for the "Task Title".
3. The system prompts the user for the "Task Description".
4. The system prompts the user for the "Due Date" in `YYYY-MM-DD` format.
    - If the date format is invalid, the system should re-prompt the user until a valid format is provided.
5. The system generates a unique integer `ID` for the new task (incrementing from the last assigned ID, or starting at 1 if no tasks exist).
6. The system sets the `Status` of the new task to "Pending".
7. The new task data (ID, Title, Description, Due Date, Status) is stored.
8. The system displays a success message including the task title and its assigned ID.
9. The system pauses, waiting for user input to continue before returning to the main menu.

## 7. Output
- **Success Message:** `Success: Task '<Task Title>' (ID: <Task ID>) was created.`
- The newly created task is persisted (e.g., in `tasks.json`).
- The application returns to the main menu after user confirmation.

## 8. Error Handling
- **Invalid Due Date Format:** The system will repeatedly prompt the user until a valid `YYYY-MM-DD` format is entered for the due date.

## 9. Example Interaction

```
--- To-Do List Menu ---
1. Add a new task
2. View all tasks
3. Update a task
4. Delete a task
5. Mark a task as complete
6. View pending tasks
7. View completed tasks
8. Exit
-----------------------
Enter your choice (1-8): 1

--- Add a New Task ---
Enter task title: Do Laundry
Enter task description: Wash, dry, and fold all clothes.
Enter due date (YYYY-MM-DD): 2025-12-26

✅ Success: Task 'Do Laundry' (ID: 1) was created.
Press Enter to continue...
```
