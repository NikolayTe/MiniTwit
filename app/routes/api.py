from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.user import User, check_user_from_db
from ..models.post import Post
from werkzeug.security import generate_password_hash
from flask_login import login_user, logout_user, login_required


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

