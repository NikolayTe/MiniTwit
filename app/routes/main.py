from flask import Blueprint, render_template
from ..models.user import User
from ..models.post import Post, PostLike
main = Blueprint('main', __name__)

@main.route('/')
def index():

    last_posts = Post.query.order_by(Post.created_at.desc()).limit(10).all()

    active_page = 'main'
    return render_template("main/index.html", active_page=active_page, posts=last_posts)
