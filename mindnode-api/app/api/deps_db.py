"""
数据库适配层 - 用于将 Mock DB 方法映射到真实数据库
"""
from app.db.database import db
from datetime import datetime


def get_db():
    """获取数据库实例（依赖注入）"""
    return db


def get_user_by_email(email: str):
    """从真实数据库获取用户"""
    return db.fetch_one("SELECT * FROM users WHERE email = %s", (email,))


def get_user_by_username(username: str):
    """从真实数据库获取用户 by username"""
    return db.fetch_one("SELECT * FROM users WHERE username = %s", (username,))


def get_user_by_id(user_id: int):
    """从真实数据库获取用户 by ID"""
    return db.fetch_one("SELECT * FROM users WHERE id = %s", (user_id,))


def create_user(user_data: dict):
    """创建用户"""
    db.execute("""
        INSERT INTO users (email, username, hashed_password, full_name, avatar_url, is_active, is_verified, is_superuser)
        VALUES (%(email)s, %(username)s, %(hashed_password)s, %(full_name)s, %(avatar_url)s, %(is_active)s, %(is_verified)s, %(is_superuser)s)
        RETURNING id, email, username, full_name, avatar_url, is_active, is_verified, is_superuser, created_at
    """, user_data)
    return get_user_by_email(user_data["email"])
