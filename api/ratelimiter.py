import datetime


class RateLimiter:
    def __init__(self, db, limit: int, identifier: str):
        self.db = db
        self.limit = limit
        self.identifier = identifier

    def key(self):
        return "ratelimit:" + datetime.datetime.now().strftime("%Y%m%d") + ":" + self.identifier

    def ok(self) -> bool:
        # note that we may have race conditions here but issok
        # this does not need to be exact
        count = self.db.get(self.key())
        if count is None:
            count = 0
        if count >= self.limit:
            return False
        self.db.put(count + 1, self.key())
        return True
