from ..extensions import db

class Post(object):
    id = db.Column(db.Integer, primary_key=True)