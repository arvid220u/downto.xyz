import datetime


class RateLimiter:
    def __init__(self, db, limit: int, identifier: str):
        self.db = db
        self.limit = limit
        self.identifier = identifier

    def key(self):
        return "ratelimit:" + datetime.datetime.now().strftime("%Y%m%d") + ":" + self.identifier

    def ok(self, user = None, limit = None) -> bool:
        # note that we may have race conditions here but issok
        # this does not need to be exact
        key = self.key()
        if user is not None:
            key += user
        count = self.db.get(key)
        if count is None:
            count = 0
        limit = self.limit if limit is None else limit
        if count >= limit:
            return False
        self.db.put(count + 1, key)
        return True
