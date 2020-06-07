import sys, random
from locust import HttpLocust, TaskSet

def writePost(locust):
    """ define a function in python whose name is previewPage and the argument is locust """
    postid = random.randint(1, 500) # generate a random number from 1 to 100 (include 1 and 100)
    url_prefix = '/api/cs144/'
    locust.client.put(url_prefix + str(postid), data={"title": "Loading Test", "body": "***Hello World!***" }, name='/api/cs144')

class MyTaskSet(TaskSet):
    """ the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = [writePost]
    def on_start(locust):
        """ on_start is called when a Locust start before any task is scheduled """
        response = locust.client.post("/login", data={"username":"cs144", "password": "password"})
        if response.status_code != 200:
            print(response.status_code)
            print("FAIL to start with posting data to server. Make sure that your server is running.")
            sys.exit()

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 10000
    max_wait = 20000