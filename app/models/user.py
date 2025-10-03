from ..extensions import db, login_manager
from datetime import date
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from .post import PostLike, Post

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(50))
    displayName = db.Column(db.String(50))
    password_hash = db.Column(db.String(255))
    bio = db.Column(db.String(300))
    avatar_path = db.Column(db.String(50))
    created_at = db.Column(db.Date, default=date.today)

    location = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(14), nullable=True)
    url = db.Column(db.String(255), default='')

    def set_password(self, password):
        """Устанавливает пароль (автоматически хеширует)"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Проверяет пароль БЕЗ получения хеша"""
        return check_password_hash(self.password_hash, password)
    
    def get_user_data(self):

        count_subscribers = len(self.subscribers)
        count_subscriptions = len(self.subscriptions)
        count_posts = len(self.posts)

        count_likes = 0
        user_posts = Post.query.filter_by(user_id=self.id)
        for post in user_posts:
            count_likes += PostLike.count_likes_post(post_id=post.id)

        return { 'id': self.id,
                'username': self.username,
                'email': self.email,
                'displayName': self.displayName,
                'bio': self.bio,
                'avatar_path': self.avatar_path,
                'created_at': self.created_at,
                'location': self.location,
                'phone': self.phone,
                'url': self.url,
                'count_subscribers': count_subscribers,
                'count_subscriptions': count_subscriptions,
                'count_posts': count_posts,
                'count_likes': count_likes

        }



def check_user_from_db(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User.query.filter_by(email=username).first()
    
    return user


class Subscriber(db.Model):
    __tablename__ = 'subscribers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_id_subscriber = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Тот кто подписан на user_id

    user = db.relationship('User', foreign_keys=[user_id], backref='subscribers') # Возвращает всех кто подписан на user_id
    subscriber = db.relationship('User', foreign_keys=[user_id_subscriber], backref='subscriptions') # Возвращает всех на кого подписан user_id

    # Constraints
    __table_args__ = (
        # Уникальная подписка - нельзя подписаться дважды
        db.UniqueConstraint('user_id', 'user_id_subscriber', name='unique_subscription'),
        
        # Нельзя подписаться на самого себя
        db.CheckConstraint('user_id != user_id_subscriber', name='no_self_subscription')
    )
 
    # Проверяю подписан ли subscriber_id на user_id
    @classmethod
    def is_subscribe(cls, subscriber_id, user_id):
        return cls.query.filter_by(user_id=user_id, user_id_subscriber=subscriber_id).first() is not None
    
    # Подписка/отписка
    @classmethod
    def subscribe(cls, subscriber_id, user_id):
        if subscriber_id == user_id:
            return {'success': False, 'error': 'Cannot subscribe to yourself'}
        
        try:
            # Если подписан то отписка, если нет то подписаться
            if cls.is_subscribe(subscriber_id, user_id):
                subscription = cls.query.filter_by(user_id_subscriber=subscriber_id, user_id=user_id).first()
                db.session.delete(subscription)
                db.session.commit()
                return {'success': True, 'subscribed': False,  'message': 'Successful unsubscribe!'}
            
            else:
                subscription = cls(user_id_subscriber=subscriber_id, user_id=user_id)
                db.session.add(subscription)
                db.session.commit()
                return {'success': True, 'subscribed': True,  'message': 'Successful subscribe!'}
            
        except Exception as ex:
            db.session.rollback()
            return {'success': False, 'error': ex}
    

        


    


    


