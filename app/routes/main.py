from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    active_page = 'main'
    return render_template("main/index.html", active_page=active_page)
