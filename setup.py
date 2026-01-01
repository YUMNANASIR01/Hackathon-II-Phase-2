from setuptools import setup, find_packages

setup(
    name="hackathon-todo",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.1",
        "uvicorn>=0.24.0",
        "sqlmodel>=0.0.16",
        "sqlalchemy>=2.0.23",
        "psycopg2-binary>=2.9.9",
        "python-dotenv>=1.0.0",
        "pyjwt>=2.8.0",
        "passlib[argon2]>=1.7.4,<2.0.0",
        "mangum>=0.17.0",
    ],
    python_requires=">=3.9",
)