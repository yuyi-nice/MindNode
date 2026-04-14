"""
PostgreSQL 数据库连接模块
"""
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from contextlib import contextmanager
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class Database:
    """数据库连接管理类"""

    def __init__(self):
        self.pool = None
        self.initialized = False

    def init_pool(self, minconn: int = 1, maxconn: int = 10):
        """初始化连接池"""
        if self.initialized:
            return

        try:
            self.pool = SimpleConnectionPool(
                minconn=minconn,
                maxconn=maxconn,
                host=settings.DATABASE_HOST,
                port=settings.DATABASE_PORT,
                database=settings.DATABASE_NAME,
                user=settings.DATABASE_USER,
                password=settings.DATABASE_PASSWORD,
                cursor_factory=RealDictCursor
            )
            self.initialized = True
            logger.info(f"数据库连接池初始化成功：{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}")
        except Exception as e:
            logger.error(f"数据库连接池初始化失败：{e}")
            raise

    @contextmanager
    def get_connection(self):
        """获取数据库连接（上下文管理器）"""
        if not self.initialized:
            self.init_pool()

        conn = self.pool.getconn()
        try:
            yield conn
        finally:
            self.pool.putconn(conn)

    @contextmanager
    def get_cursor(self):
        """获取数据库游标（上下文管理器）"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                yield cursor
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                cursor.close()

    def execute(self, query: str, params: tuple = None):
        """执行 SQL 查询"""
        with self.get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor

    def fetch_one(self, query: str, params: tuple = None):
        """查询单条记录"""
        with self.get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()

    def fetch_all(self, query: str, params: tuple = None):
        """查询多条记录"""
        with self.get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def close(self):
        """关闭连接池"""
        if self.pool:
            self.pool.closeall()
            self.initialized = False
            logger.info("数据库连接池已关闭")


# 全局数据库实例
db = Database()


def get_db():
    """获取数据库实例"""
    return db
