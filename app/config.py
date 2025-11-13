import os


UPLOAD_FOLDER_AVATAR = os.path.join('app', 'static', 'uploads', 'avatar')
if not os.path.exists(UPLOAD_FOLDER_AVATAR):
    os.makedirs(UPLOAD_FOLDER_AVATAR)

AVATAR_PATH_DB = os.path.join('uploads', 'avatar')


class Config(object):
    USER = os.environ.get('POSTGRES_USER', 'edmin')
    PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'edmin')
    HOST = os.environ.get('POSTGRES_HOST', '127.0.0.1')
    # HOST = os.environ.get('POSTGRES_HOST', '192.168.0.4')

    PORT = os.environ.get('POSTGRES_PORT', 5532)
    DB = os.environ.get('POSTGRES_DB', 'dbtwit')

    SQLALCHEMY_DATABASE_URI = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}?client_encoding=utf8"
    SECRET_KEY = 'SDFfrf234vfM23fBfs234KD9fsdsef2'
    SQLALCHEMY_TRACK_MODIFICATIONS = True


# # Проброс порта из Windows в WSL
# netsh interface portproxy add v4tov4 listenport=5000 listenaddress=192.168.100.11 connectport=5000 connectaddress=127.0.0.1

# # Разрешить в фаерволе
# netsh advfirewall firewall add rule name="WSL Flask" dir=in action=allow protocol=TCP localport=5000

# 1. Удалить проброс порта: 
# netsh interface portproxy delete v4tov4 listenport=5000 listenaddress=192.168.0.4
# 2. Удалить правило фаервола:
# netsh advfirewall firewall delete rule name="WSL Flask"
# Проверка пробросов портов
# netsh interface portproxy show all