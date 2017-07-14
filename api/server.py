from gevent.pywsgi import WSGIServer
from app import app

http_server = WSGIServer(('0.0.0.0', 5000), app);
print('Starting server on port 5000')
http_server.serve_forever()
