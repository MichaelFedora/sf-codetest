from flask import Flask, request, jsonify
from flask_cors import CORS
import rethinkdb as r
from schema import ContactSchema

app = Flask(__name__)
CORS(app)

schema = ContactSchema()

r.connect("localhost", 28015).repl()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    print(request.method, ': %s' % path)

@app.route('/')
def hello():
    '''Returns "Hello World!"'''
    return jsonify({'message': 'Hello World!'})

@app.route('/contacts', methods=['GET', 'PUT', 'POST'])
@app.route('/contacts/<uid>', methods=['GET', 'DELETE'])
def contact(uid=None):
    '''The contact interface to the DB'''

    data = None
    if request.json is not None:
        data = schema.load(request.json).data
        if 'dob' in data:
            data['dob'] = r.iso8601(request.json['dob'])

        print('Data:', data)

    if request.method == 'GET':
        return jsonify(get(uid=uid))
    elif request.method == 'PUT' and data != None and 'dob' in data:
        return jsonify(update(data))
    elif request.method == 'POST' and data != None:
        return jsonify(add(data))
    elif request.method == 'DELETE' and uid != None:
        return jsonify(delete(uid))
    else: return "I can't do that..."

def get(uid=None):
    '''Get an object from the DB'''
    if uid is None:
        return list(r.table('contacts').run())
    else:
        return r.table('contacts').get(uid).run()

def update(obj):
    '''Update an object in the DB'''
    result = r.table('contacts').get(obj['id']).update(obj).run()
    return result

def add(obj):
    '''Add an object to the DB'''
    if hasattr(obj, 'id'):
        del obj.id
    result = r.table('contacts').insert(obj).run()
    return r.table('contacts').get(result['generated_keys'][0]).run()

def delete(uid):
    '''Delete an object from the DB'''
    result = r.table('contacts').get(uid).delete().run()
    return result
