from flask import Blueprint
from ..extensions import db
from ..models.user import User
from ..models.post import Post

post = Blueprint('post', __name__)

@post.route('/post')
def create_post():
    return 'Posts here!'