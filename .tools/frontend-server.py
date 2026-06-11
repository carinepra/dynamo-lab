import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

root_dir = sys.argv[1]
quiz_dir = os.path.join(root_dir, 'quiz-web')
labs_dir = os.path.join(root_dir, 'labs')

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        path = unquote(path)

        if path == '/':
            return os.path.join(quiz_dir, 'index.html')

        if path.startswith('/labs/'):
            relative = path[len('/labs/'):]
            return os.path.join(labs_dir, *[part for part in relative.split('/') if part])

        relative = path.lstrip('/')
        return os.path.join(quiz_dir, *[part for part in relative.split('/') if part])

    def log_message(self, format, *args):
        return

ThreadingHTTPServer(('0.0.0.0', 17080), Handler).serve_forever()
