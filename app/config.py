import os


class Config(object):
    USER = os.environ.get('POSTGRES_USER', 'edmin')
    PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'edmin')
    HOST = os.environ.get('POSTGRES_HOST', '127.0.0.1')
    PORT = os.environ.get('POSTGRES_PORT', 5532)
    DB = os.environ.get('POSTGRES_DB', 'dbtwit')

    SQLALCHEMY_DATABASE_URI = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}"
    SECRET_KEY = 'SDFfrf234vfM23fBfs234KD9fsdsef2'
    SQLALCHEMY_TRACK_MODIFICATIONS = True