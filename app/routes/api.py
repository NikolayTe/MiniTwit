from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.user import User, check_user_from_db, Subscriber
from ..models.post import Post, PostLike
from werkzeug.security import generate_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from time import sleep

api = Blueprint('api', __name__)


@api.route('/api/register', methods=['POST'])
def register():
    print("api.route('/api/register'")
    
    if request.method == "POST":
        print(request.json)
        name = request.json.get('name')
        email = request.json.get('email').lower()
        username = request.json.get('username')
        password = request.json.get('password')

        if User.query.filter_by(username=username).first():
            return jsonify({
                    'success': False, 'message': 'The user with this username already exists!'
                    })
        if User.query.filter_by(email=email).first():
            return jsonify({
                    'success': False, 'message': 'The user with this email already exists!'
                    })

        new_user = User(displayName=name, email=email, username=username)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        
    return jsonify({
                    'success': True, 'message': 'The new user has been successfully registered!'
                    })




@api.route('/api/login', methods=['POST'])
def login():

    if request.method == 'POST':
        username_email = request.json.get('login')
        password = request.json.get('password')

        user = check_user_from_db(username_email)
        if not user:
            return jsonify({
                    'success': False, 'message': 'The user not found!'
                    })
        
        if user.check_password(password):
            print(user.username, 'Успешно вошел')
            login_user(user)
            return jsonify({
                'success': True, 'message': 'Login is successfuly!'
            })
        else:
            print(user.username, 'НЕУСПЕШНЫЙЙ ВХОДД')
            return jsonify({
                'success': False, 'message': 'Login is not successfuly!'
            })

    return jsonify({'success': False, 'message': 'Unknown Error!'})


@api.route('/api/logout', methods=['POST'])
@login_required
def logout():
    print('LLLLLLLLLLLLLLLLLLLLLLll')
    logout_user()

    return jsonify({'success': True, 'message': 'User logout!'})


@api.route('/api/<int:id>/edit_profile', methods=['POST'])
@login_required
def edit_profile(id):
    try:
        if int(request.json.get('id')) != id:
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403

        data = request.get_json()

        user = User.query.get(id)

        user.displayName = data.get('displayName')
        user.username = data.get('username')
        user.email = data.get('email')
        user.bio = data.get('bio')
        user.location = data.get('location')
        user.phone = data.get('phone')
        user.url = data.get('url')

        db.session.commit()


    except Exception as ex:
        return jsonify({'success': False, 'message': str(ex)})

    return jsonify({'success': True, 'message': 'The profile has been edited!'})


@api.route('/api/new_post', methods=['POST'])
@login_required
def new_post():
    content = request.json.get('text')
    if content == '':
        return jsonify({'success': False, 'message': 'The post can"t been empty!'})
    
    try:
        
        new_post = Post(user_id=current_user.id, content=request.json.get('text'))
        db.session.add(new_post)
        db.session.commit()

    except Exception as ex:
        return jsonify({'success': False, 'message': f'Unknown error!\n{ex}'})

    print("OK new post", request.json)

    return jsonify({'success': True, 'message': 'The post has been published!'})


# Проверяю ставил ли пользователь лайк
def is_post_liked_by_user(post_id, user_id):
    like = PostLike.query.filter_by(
        post_id=post_id, 
        user_id=user_id
    ).first()
    
    return like is not None

# Считаю количество лайков у поста
def count_post_likes(post_id):
    count = PostLike.query.filter_by(post_id=post_id).count()

    return count

@api.route('/api/post/<int:post_id>/like', methods=['POST'])
def like_action(post_id):

    if not current_user.is_authenticated:
        return jsonify({'success': False, 'message': "Пожалуйста авторизуйтесь!"})
    
    try:
        # Проверяю стоит ли лайк
        is_like = is_post_liked_by_user(post_id, current_user.id)
        if is_like:
            like = PostLike.query.filter_by(post_id=post_id, user_id=current_user.id).first()
            db.session.delete(like)
            db.session.commit()
            is_like = False
        else:
            like = PostLike(user_id=current_user.id, post_id=post_id)

            db.session.add(like)
            db.session.commit()
            is_like = True

        count_likes = count_post_likes(post_id)

        print({'success': True, 'count_likes': count_likes, 'is_like': is_like})

    except Exception as ex:
        print('Error', ex)
        return jsonify({'success': False, 'message': "Unknown error!", 'error': str(ex)})
                       
    return jsonify({'success': True, 'count_likes': count_likes, 'is_like': is_like})


@api.route('/api/subscribe/<int:user_id>', methods=['POST'])
def subscribe(user_id):
    if not current_user.is_authenticated:
        return jsonify({'success': False, 'message': "Пожалуйста авторизуйтесь!"})
    
    try:
        result = Subscriber.subscribe(current_user.id, user_id=user_id)

        if result.get('success'):
            user = User.query.get(user_id)
            count_subscribers = user.get_user_data().get('count_subscribers')
            result['count_subscribers'] = count_subscribers

        return jsonify(result)
    
    except Exception as ex:
        return jsonify({'success': False, 'message': str(ex), 'error': str(ex)}) 



@api.route('/api/get_subsribers_list/<int:id>', methods=['GET'])
def get_subsribers_list(id):

    #   [{ id: 1, username: "Алексей Иванов", handle: "@alexey", avatar: null, isSubscribed: true }]
    
    try:
        subscribers_list = []
        user = User.query.get(id)
        subscribers = user.subscribers

        for item in subscribers:
            subscriber_dct = dict()

            subscriber_id = item.user_id_subscriber
            subscriber_user = User.query.get(subscriber_id).get_user_data()

            username = subscriber_user.get('displayName')
            handle = subscriber_user.get('username')
            avatar = subscriber_user.get('avatar_path')
            
            if current_user.is_authenticated:
                isSubscribed = Subscriber.is_subscribe(current_user.id, subscriber_id)
            else:
                isSubscribed = False

            subscriber_dct = dict(id=subscriber_id, username=username, handle=handle, avatar=avatar, isSubscribed=isSubscribed)
            print(subscriber_dct)
            subscribers_list.append(subscriber_dct)
        sleep(1)
        return jsonify({'success': True, 'subscribers_list': subscribers_list})

    except Exception as ex:
        print(ex)
        return jsonify({'success': False, 'message': str(ex), 'error': str(ex)}) 
    

@api.route('/api/get_subscriptions_list/<int:user_id>', methods=['GET'])
def get_subscriptions_list(user_id):

    try:
        subscriptions_list = []

        user = User.query.get(user_id)
        subscriptions = user.subscriptions

        for subscription in subscriptions:
            subscription_id = subscription.user_id
            subscription_data = User.query.get(subscription_id).get_user_data()

            username = subscription_data.get('displayName')
            handle = subscription_data.get('username')
            avatar = subscription_data.get('avatar_path')

            if current_user.is_authenticated:
                isSubscribed = Subscriber.is_subscribe(current_user.id, subscription_id)
            else:
                isSubscribed = False
            
            subscriptions_dct = dict(id=subscription_id, username=username, handle=handle, avatar=avatar, isSubscribed=isSubscribed)
            subscriptions_list.append(subscriptions_dct)

        return jsonify({'success': True, 'subscribers_list': subscriptions_list})


        
    except Exception as ex:
        return jsonify({'success': False, 'message': str(ex), 'error': str(ex)}) 