import sys, random
from locust import HttpLocust, TaskSet

def readPost(locust):
    """ define a function in python whose name is previewPage and the argument is locust """
    postid = random.randint(1, 500) # generate a random number from 1 to 100 (include 1 and 100)
    url_prefix = '/editor/post?action=open&username=cs144&postid='
    locust.client.get(url_prefix + str(postid), name='/editor/post?action=open')

class MyTaskSet(TaskSet):
    """ the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = [readPost]
    def on_start(locust):
        print("hi")

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 3000
    max_wait = 5000