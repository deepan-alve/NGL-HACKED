from http.server import BaseHTTPRequestHandler
import json
from instagrapi import Client
import os
from dotenv import load_dotenv

load_dotenv()

IG_USERNAME = os.environ.get("IG_USERNAME")
IG_PASSWORD = os.environ.get("IG_PASSWORD")
IG_CREDENTIAL_PATH = "./ig_settings.json"

class Bot:
    _cl = None

    def __init__(self):
        self._cl = Client()
        if os.path.exists(IG_CREDENTIAL_PATH):
            self._cl.load_settings(IG_CREDENTIAL_PATH)
            self._cl.login(IG_USERNAME, IG_PASSWORD)
        else:
            self._cl.login(IG_USERNAME, IG_PASSWORD)
            self._cl.dump_settings(IG_CREDENTIAL_PATH)

    def get_self_stories(self):
        story_list = self._cl.user_stories(self._cl.account_info().pk)
        return story_list

    def get_story_viewers(self):
        story_list = self.get_self_stories()
        story_viewers_full_names = []
        for story in story_list:
            viewers = self._cl.story_viewers(story.pk)
            story_viewers_full_names.extend([viewer.full_name for viewer in viewers])
        return story_viewers_full_names

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            goodbot = Bot()
            viewers_full_names = goodbot.get_story_viewers()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(viewers_full_names).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
