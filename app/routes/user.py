from flask import Blueprint, render_template
from ..extensions import db
from ..models.user import User
from flask_login import login_user, logout_user, current_user, login_required
from functools import wraps


user = Blueprint('user', __name__)

def my_login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('my_login_required')
        if not current_user.is_authenticated:
            return render_template('/main/custom_index.html', message='Пожалуйста авторизуйтесь!')
        return func(*args, **kwargs)

    return wrapper


@user.route('/user/<name>', methods=['GET'])
@my_login_required
def user_profil(name):
    print('name', name)

    return render_template("main/profil.html")