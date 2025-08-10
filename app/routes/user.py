from flask import Blueprint
from ..extensions import db
from ..models.user import User
from flask_login import login_user, logout_user, current_user


user = Blueprint('user', __name__)

@user.route('/user/<name>')
def create_user(name):
    user = User(name=name)
    db.session.add(user)
    db.session.commit()

    return 'User created succesfully!'