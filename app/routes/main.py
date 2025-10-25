from flask import Blueprint, render_template
from ..models.user import User, Subscriber
from ..models.post import Post, PostLike, PostComments
from datetime import datetime, timedelta
from ..extensions import db
from sqlalchemy import func # Для агрегатных функций
from flask_login import current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():

    last_posts = Post.query.order_by(Post.created_at.desc()).limit(10).all()
    active_page = 'main'
    return render_template("main/index.html", active_page=active_page, posts=last_posts)


@main.route('/popular', methods=['GET'])
def popular():
    active_page='popular'

    # Самые залайканые посты за последние 10 дней
    ten_days_ago = datetime.now() - timedelta(days=10)

    last_posts = (db.session.query(Post))\
    .join(PostLike, Post.id == PostLike.post_id)\
    .filter(Post.created_at >= ten_days_ago)\
    .group_by(Post.id)\
    .order_by(func.count(PostLike.id).desc(), Post.created_at.asc())\
    .all()

    return render_template("main/index.html", active_page=active_page, posts=last_posts)


@main.route('/discussed', methods=['GET'])
def discussed():
    
    # Самые обсуждаемы комментарии за последние 10 дней
    ten_days_ago = datetime.now() - timedelta(days=10)

    last_posts = (db.session.query(Post))\
    .join(PostComments, Post.id == PostComments.post_id)\
    .filter(Post.created_at >= ten_days_ago)\
    .group_by(Post.id)\
    .order_by(func.count(PostComments.id).desc(), Post.created_at.asc())\
    .all()


    active_page = 'discussed'

    return render_template('main/index.html', active_page=active_page, posts=last_posts)


@main.route('/people', methods=['GET'])
def people():
    users = (db.session.query(User))\
    .join(Subscriber, User.id == Subscriber.user_id)\
    .group_by(User.id)\
    .order_by(func.count(Subscriber.id).desc())\
    .all()

    users_data = []
    is_subscribe = False

    for user in users:
        user_data = user.get_user_data()
        
        # Проверяю подписку
        is_subscribe = Subscriber.is_subscribe(subscriber_id=current_user.id, user_id=user.id)
        user_data['is_subscribe'] = is_subscribe
        
        users_data.append(user_data)

        print(user_data, is_subscribe)


    active_page='people'
    only_profiles = True
    return render_template('main/index.html', only_profiles=only_profiles, active_page=active_page, users=users_data)