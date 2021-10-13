class Email:
    def __init__(self, path: str):
        with open(path, "r") as f:
            self.template = f.read()

    def get(self, p1: str, p2: str, t: str) -> str:
        s = self.template
        s = s.replace("/*PERSON1*/", p1)
        s = s.replace("/*PERSON2*/", p2)
        s = s.replace("/*MATCHTYPE*/", t)
        return s
