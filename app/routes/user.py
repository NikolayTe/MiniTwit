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


@user.route('/user/<int:id>', methods=['GET'])
@my_login_required
def user_profil(id):
    print('id', id)

    user = User.query.get(id)
    user_data = user.get_user_data()
    active_page = 'profile'
    return render_template("main/profil.html", user=user_data, active_page=active_page)


@user.route('/user/<int:id>/profile_posts')
def user_profile_posts(id):

    user = User.query.get(id)
    user_data = user.get_user_data()

    if id == current_user.id:
        user_profile = False
        active_page = 'my_posts'
    else:
        user_profile = True
        active_page = 'posts'

    user_posts = user.posts
    return render_template('main/index.html', user_profile=user_profile, user=user_data, posts=user_posts, active_page=active_page)


