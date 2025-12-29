from backend.database import engine, Base
from backend.models import Task

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database has been reset successfully.")

if __name__ == "__main__":
    reset_database()

