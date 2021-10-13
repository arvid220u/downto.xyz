DATA_FILE = "data.json"
import json


class FakeDB:
    def __init__(self):
        self.update()

    def update(self):
        with open(DATA_FILE, "r") as f:
            self.d = json.load(f)

    def put(self, v, k):
        self.update()
        self.d[k] = v
        with open(DATA_FILE, "w") as f:
            json.dump(self.d, f)

    def get(self, k):
        self.update()
        return self.d[k] if k in self.d else None
