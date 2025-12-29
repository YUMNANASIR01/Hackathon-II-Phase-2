import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend import services
from backend.models import Task
from datetime import date

# Use an in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """
    Fixture to set up the database for each test function.
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_add_task(db_session):
    """
    Tests if a single task can be added correctly.
    """
    due_date = date(2025, 12, 31)
    new_task = services.add_task(db_session, "Test Task", "Test Description", due_date)
    
    assert new_task.id is not None
    assert new_task.title == "Test Task"
    assert new_task.status == "Pending"
    
    saved_task = services.get_task_by_id(db_session, new_task.id)
    assert saved_task is not None
    assert saved_task.title == "Test Task"

def test_delete_task(db_session):
    """
    Tests if a task can be deleted correctly.
    """
    due_date = date(2025, 1, 1)
    task_to_delete = services.add_task(db_session, "Task to Delete", "Delete me", due_date)
    
    all_tasks = services.get_all_tasks(db_session)
    assert len(all_tasks) == 1

    delete_successful = services.delete_task(db_session, task_to_delete.id)
    assert delete_successful is True

    final_tasks = services.get_all_tasks(db_session)
    assert len(final_tasks) == 0

def test_delete_non_existent_task(db_session):
    """
    Tests if delete_task handles a non-existent task ID gracefully.
    """
    due_date = date(2025, 1, 1)
    services.add_task(db_session, "Existing Task", "I exist", due_date)
    
    delete_successful = services.delete_task(db_session, 999) # 999 is a non-existent ID
    assert delete_successful is False

    final_tasks = services.get_all_tasks(db_session)
    assert len(final_tasks) == 1

def test_get_all_tasks(db_session):
    """
    Tests if all tasks can be retrieved.
    """
    services.add_task(db_session, "Task 1", "Desc 1", date(2025, 1, 1))
    services.add_task(db_session, "Task 2", "Desc 2", date(2025, 1, 2))

    all_tasks = services.get_all_tasks(db_session)
    assert len(all_tasks) == 2
    assert all_tasks[0].title == "Task 1"
    assert all_tasks[1].title == "Task 2"