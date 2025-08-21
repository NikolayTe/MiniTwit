from ..extensions import db, login_manager
from datetime import date
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(50))
    displayName = db.Column(db.String(50))
    password_hash = db.Column(db.String(255))
    bio = db.Column(db.String(300))
    avatar_path = db.Column(db.String(50))
    created_at = db.Column(db.Date, default=date.today)

    def set_password(self, password):
        """Устанавливает пароль (автоматически хеширует)"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Проверяет пароль БЕЗ получения хеша"""
        return check_password_hash(self.password_hash, password)



def check_user_from_db(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User.query.filter_by(email=username).first()
    
    return user