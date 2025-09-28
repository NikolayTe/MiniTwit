from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.user import User, check_user_from_db
from ..models.post import Post
from werkzeug.security import generate_password_hash
from flask_login import login_user, logout_user, login_required, current_user


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
        return jsonify({'success': False, 'message': ex})

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