from flask import Blueprint, render_template
from ..extensions import db
from ..models.user import User, Subscriber
from flask_login import login_user, logout_user, current_user, login_required
from functools import wraps
from ..models.post import Post


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

    is_subscribe = None
    
    if current_user.is_authenticated:

        if id == current_user.id:
            user_profile = False
            active_page = 'my_posts'
        else:
            user_profile = True
            active_page = 'posts'
            # Проверяю подписку
            is_subscribe = Subscriber.is_subscribe(subscriber_id=current_user.id, user_id=id)
            print(active_page)
    else:
        user_profile = True
        active_page = 'posts'
        # Проверяю подписку
        is_subscribe = False

    user_posts = user.posts
    return render_template('main/index.html', user_profile=user_profile, user=user_data, posts=user_posts, active_page=active_page, is_subscribe=is_subscribe)


@user.route('/user/<int:id>/likes', methods=['GET'])
@my_login_required
def user_likes(id):

    if current_user.id != id:
        return render_template('/main/custom_index.html', message='Можно посмотреть только свои лайки!')

    user = User.query.get(id)
    posts = [like.post for like in user.likes]

    user_profile = False
    active_page = 'likes'
    return render_template('main/index.html', user_profile=user_profile, posts=posts, active_page=active_page)


@user.route('/user/<int:id>/subscriptions', methods=['GET'])
@my_login_required
def user_subscriptions(id):

    if current_user.id != id:
        return render_template('/main/custom_index.html', message='Можно посмотреть только свои подписки!')

    user = User.query.get(id)
    subscriptions = user.subscriptions

    posts = []
    for subscription in subscriptions:
        # posts += User.query.get(subscription.user_id).posts
        posts += Post.query.join(User).filter(User.id == subscription.user_id).order_by(Post.created_at.desc()).limit(10)

    user_profile = False
    active_page = 'subscriptions'
    return render_template('main/index.html', user_profile=user_profile, posts=posts, active_page=active_page)


@user.route('/user/<int:id>/favourites', methods=['GET'])
@my_login_required
def user_favourites(id):

    if current_user.id != id:
        return render_template('/main/custom_index.html', message='Можно посмотреть только своё избранное!')

    user = User.query.get(id)
    posts = [favourite.post for favourite in user.favourites]

    user_profile = False
    active_page = 'favourites'
    return render_template('main/index.html', user_profile=user_profile, posts=posts, active_page=active_page)