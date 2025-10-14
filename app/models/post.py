from ..extensions import db
from datetime import datetime

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), default='')
    parent_post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    likes_count = db.Column(db.Integer, default=0)
    replies_count = db.Column(db.Integer, default=0)
    retweets_count = db.Column(db.Integer, default=0)
    is_edited = db.Column(db.Boolean, default=False)
    
    # Связи
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
    parent_post = db.relationship('Post', remote_side=[id], backref='replies')
    
    def __repr__(self):
        return f'<Post {self.id} by User {self.user_id}>'
    


class PostLike(db.Model):
    __tablename__ = 'post_likes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Связи
    user = db.relationship('User', backref=db.backref('likes', lazy=True))
    post = db.relationship('Post', backref=db.backref('likes', lazy=True))
    
    # Уникальный constraint
    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),
    )

    @classmethod
    def count_likes_post(cls, post_id):
        return len(cls.query.filter_by(post_id=post_id).all())
    
    def __repr__(self):
        return f'<Like user:{self.user_id} post:{self.post_id}>'


class PostFavour(db.Model):
    __tablename__ = 'post_favourites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('User', backref=db.backref('favourites', lazy=True))
    post = db.relationship('Post', backref=db.backref('favourites', lazy=True))

    @classmethod
    def is_favourite(cls, post_id, user_id):
        return cls.query.filter_by(post_id=post_id, user_id=user_id).first() is not None

    def __repr__(self):
        return f'<User favourites:{self.user_id} post:{self.post_id}>'