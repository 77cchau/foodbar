import requests
import json
import pandas as pd
import pprint
# from app import websiteCall

URL = 'https://api.peterportal.org/graphql/'


# Get a list of all postrequisites, regardless of whether they are offered
def getPostreqs(course):
    query = '''
        query ID($id: String!){
            course(id:$id) {
                prerequisite_for{
                        id
                }
            }
        }
    '''

    r = requests.post(URL, json={'query': query, 'variables': {'id': course}})
    json_data = json.loads(r.text)
    # pprint.pprint(json_data['data']['course']['prerequisite_for'])

    # Iterate through json data, returning a list of just the values

    # print(json_data['data']['course']['prerequisite_for'])
    if (json_data['data']['course'] == None):
        print('No course found')
        return set()
    return set(x['id'] for x in json_data['data']['course']['prerequisite_for'])


def getPrereqs(course):
    query = '''
        query ID($id: String!){
            course(id:$id) {
                prerequisite_tree

            }
        }
    '''

    r = requests.post(URL, json={'query': query, 'variables': {'id': course}})

    json_data = json.loads(r.text)
    # print(json_data)
    # pprint.pprint(json_data['data']['course']['prerequisite_list'])

    # Iterate through json data, returning a list of just the values
    # print(json_data['data']['course']['prerequisite_tree'])
    json_data = json_data['data']['course']['prerequisite_tree']
    json_data = json.loads(json_data)

    return json_data


# Given the classes I've taken, tell me all of the classes I am SET to take


def doIHaveWhatINeed(prereq_tree: dict, classesTaken: list):
    if(list(prereq_tree.keys())[0] == "AND"):
        return listAnd(prereq_tree["AND"], classesTaken)
    else:
        return listOr(prereq_tree["OR"], classesTaken)


def listOr(courses: list, classesTaken: list):
    for course in courses:
        if(type(course) == dict):
            if(list(course.keys())[0] == "AND"):
                rbool = listAnd(course["AND"], classesTaken)
            else:
                rbool = listOr(course['OR'], classesTaken)

            if(rbool == True):
                return True
        else:
            if course.replace(" ", "") in classesTaken:
                return True
    return False


def listAnd(courses: list, classesTaken: list):
    for course in courses:
        if(type(course) == dict):
            if(list(course.keys())[0] == "AND"):
                rbool = listAnd(course["AND"], classesTaken)
            else:
                rbool = listOr(course["OR"], classesTaken)

            if(rbool == False):
                return False
        else:
            if not course.replace(" ", "") in classesTaken:
                return False

    return True


def classesICanTake(classesTaken: list):
    # need to call get prereqs

    # popoulates the list of potential courses to take
    # limitation - there must be a prereq attached to it

    # Iterate through all the classes the user has taken,
    # and add their postrequisites to possible_postreqs
    possible_postreqs: set = set()
    for course in classesTaken:
        possible_postreqs.update(getPostreqs(course))

    rCourses: set = set()
    # prune list
    for course in possible_postreqs:
        course_prereqs = getPrereqs(course)
        if(doIHaveWhatINeed(course_prereqs, classesTaken)):
            rCourses.add(course)

    return rCourses


def courseInfo(course):
    # Take in a course and make an graphQL call to return the course id, description, and teacher
    query = '''
        query ID($id: String!){
            course(id:$id) {
                id
                title
                description
            }
        }
    '''

    r = requests.post(URL, json={'query': query, 'variables': {'id': course}})

    json_data = json.loads(r.text)

    return json_data['data']['course']


def listParser(course_list: str):
    ''' convert string of format [A,B,C] to list ['A', 'B', 'C'] '''
    # print(course_list)
    output = course_list[1:-1].split(',')
    return output


def removeDuplicates(classes, classesTaken):
    # classes is a set
    for course in classes.copy():
        classes.remove(course)


def manager(classesTaken):
    classes = classesICanTake(classesTaken)
    # removeDuplicates(classes, classesTaken)

    courses = {"courses": [courseInfo(course) for course in classes]}
    return courses


if __name__ == '__main__':
    # classesTaken = "[I&CSCI46,I&CSCI6B,I&CSCI6D,MATH2B]"
    classesTaken = ['I&CSCI33']
    manager(classesTaken)
