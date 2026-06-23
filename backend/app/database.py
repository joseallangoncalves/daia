from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# We expect the URL in the format mysql+pymysql://user:password@db:3306/db_name
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to local config if not running in docker
    user = os.getenv("MYSQL_USER", "daia_user")
    password = os.getenv("MYSQL_PASSWORD", "daia_password")
    host = os.getenv("MYSQL_HOST", "localhost")
    port = os.getenv("MYSQL_PORT", "3306")
    db_name = os.getenv("MYSQL_DATABASE", "daia_db")
    DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
