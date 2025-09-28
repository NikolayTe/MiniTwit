from flask import Blueprint, render_template
from ..extensions import db
from ..models.user import User
from ..models.post import Post
from flask_login import current_user
from .user import my_login_required

post = Blueprint('post', __name__)

@post.route('/post')
def create_post():
    return 'Posts here!'


@post.route('/user/<int:id>/posts')
@my_login_required
def user_posts(id):
    print('current_user.id', current_user.id)

    if current_user.id == id:
        active_page = 'my_posts'
    else:
        active_page = 'posts'

    user_posts = Post.query.filter_by(user_id=current_user.id).all()

    return render_template('main/user_posts.html', active_page=active_page, user_posts=user_posts)