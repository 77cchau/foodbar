import requests
import json


def getClassInfo(classId):
    query = '''
    {
        course({classId}){
            title
        }
    }
    '''.format(classId=classId)

    url = 'https://api.peterportal.org/graphql/'

    r = requests.post(url, json={'query': query})
    print(r.status_code)
    print(r.text)

    json_data = json.loads(r.text)


def manager():
    askForGE()


def askForGE():
    # GE type. ['ANY'|'GE-1A'|'GE-1B'|'GE-2'|'GE-3'|'GE-4'|'GE-5A'|'GE-5B'|'GE-6'|'GE-7'|'GE-8'].
    print(['ANY' | 'GE-1A' | 'GE-1B' | 'GE-2' | 'GE-3' |
          'GE-4' | 'GE-5A' | 'GE-5B' | 'GE-6' | 'GE-7' | 'GE-8'])
    ge = input("What GE category are you interested in?")
    query = """
    {
        schedule(ge:"{ge}" year:2021 quarter:"Fall")
        {
            id
            title
        }
    }   
    """.format(ge=ge)


if __name__ == '__main__':
    getClassInfo()
