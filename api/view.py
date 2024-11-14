#!./.venv/bin/python

from instagrapi import Client
import os
import json
from dotenv import load_dotenv
from instagrapi.types import Story, UserShort

load_dotenv()

IG_USERNAME = os.environ.get("IG_USERNAME")
IG_PASSWORD = os.environ.get("IG_PASSWORD")
IG_CREDENTIAL_PATH = "./ig_settings.json"
SLEEP_TIME = "600"  # in seconds

class Bot:
    _cl = None

    def __init__(self):
        self._cl = Client()
        if os.path.exists(IG_CREDENTIAL_PATH):
            self._cl.load_settings(IG_CREDENTIAL_PATH)  # type: ignore
            self._cl.login(IG_USERNAME, IG_PASSWORD)
        else:
            self._cl.login(IG_USERNAME, IG_PASSWORD)
            self._cl.dump_settings(IG_CREDENTIAL_PATH)  # type: ignore

    def get_self_stories(self):
        story_list: list[Story] = self._cl.user_stories(self._cl.account_info().pk)
        return story_list

    def get_story_viewers(self):
        story_list = self.get_self_stories()
        story_viewers_full_names = []  # Define the list here
        for story in story_list:
            viewers = self._cl.story_viewers(story.pk)
            # Collecting only full names of viewers
            story_viewers_full_names.extend([viewer.full_name for viewer in viewers])
        
        return story_viewers_full_names


def main():
    goodbot = Bot()
    # Convert the list of viewer names to JSON and print it
    viewers_full_names = goodbot.get_story_viewers()
    print(json.dumps(viewers_full_names))  # Output JSON for Node.js


if __name__ == "__main__":
    main()
