from ..extensions import db, login_manager
from datetime import date
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(50))
    displayName = db.Column(db.String(50))
    password_hash = db.Column(db.String(50))
    bio = db.Column(db.String(300))
    avatar_path = db.Column(db.String(50))
    created_at = db.Column(db.Date, default=date.today)


    