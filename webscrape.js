const PORT = 1234;
const fetch = require('node-fetch');
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const res = require('express/lib/response');
const { data } = require('cheerio/lib/api/attributes');
const app = express()

app.get('/', function (req, res) {
    res.json("Why are you here? Hrm.");
});

app.get('/prereqs', async function (req, res) {
    const classesTaken = ['I&CSCI46', 'I&CSCI6B', 'I&CSCI6D', 'MATH2B'];
    const majorClasses = await getMajorRequirements("COMPUTER SCIENCE");
    const trees = await getAllPrereqTrees(majorClasses["classes"]);
    
    res.json( majorClasses);
});

app.get('/ge-classes', function (req, res) {
    const boo = async function getGEInfo(ge) {
        const geClasses = await getGEClasses(ge);
        res.json(geClasses);
    }
    boo("GE-2");
});

function removeExtendedChars(str) {
    let badChars = []
    let weirdChar = " ";
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            weirdChar = str.charAt(i);
            break;
        }
    }
    let s = str.split(weirdChar).join('');

    return s;
}

function constructSearchURL(search) {
    const searchURL = new URL("https://catalogue.uci.edu/search/?");
    searchURL.searchParams.append("search", search + ", B.")

    return searchURL.href;
}

async function getMajorURL(googleSearch) {
    try {
        const response = await axios(googleSearch);
        const uciURL = "https://catalogue.uci.edu";
        const html = response.data;
        const $ = cheerio.load(html);

        const majorURL = $('.searchresult .search-url a', html).attr('href');
        const requirementsURL =  uciURL + majorURL + '#requirementstext';

        return requirementsURL;
    } catch(err) {
        console.log(err);
    }
}


async function getMajorRequirements(major){
    try {
        const searchURL = constructSearchURL(major);
        const majorURL = await getMajorURL(searchURL);

        const response = await axios(majorURL);
        const html = response.data;
        const $ = cheerio.load(html);
        const classIDs = new Set();

        $('#requirementstextcontainer .codecol a', html).each( function() {
            let title = $(this).attr('title');
            title = removeExtendedChars(title);
            classIDs.add( title );
            
        });

        return {classes: Array.from(classIDs) };

    } catch(err) {
        console.log(err);
    }
}

async function getGEClasses(ge){
    const petrURL = "https://api.peterportal.org/graphql";
    const query = `
        query{
            schedule(year:2022, quarter:"Spring", ge:"${ge}") {
                id
                prerequisite_list{
                        id
                }
            }
        }
        `
    
    const options = {
        body: JSON.stringify({query}),
        method: "POST",
        headers: {"Content-Type": "application/json"}
    }
    
    const response = await fetch(petrURL, options);
    const data = await response.json();
    const schedule = data['data']['schedule'];

    return schedule;
}

async function getPostAndPrereqTree(classID){
    const petrURL = "https://api.peterportal.org/graphql";
    const query = `
        query{
            course(id:"${classID}") {
                id
                prerequisite_tree
                prerequisite_for{
                    id
                }
            }
        }
        `
    
    const options = {
        body: JSON.stringify({query}),
        method: "POST",
        headers: {"Content-Type": "application/json"}
    }
    
    const response = await fetch(petrURL, options);
    const data = await response.json();
    const prereqInfo = data['data'];

    return prereqInfo;
}

function listOr(courses, classesTaken) {
    console.log(courses);
    /* if ( !courses ){
        return false;
    } */
    courses.forEach( (course) => {
        let flag = false;
        if ( typeof(course) != "string") {
            if (Object.keys(courses)[0] == 'AND') {
                flag = listAnd(course['AND'], classesTaken);
            } else {
                flag = listOr(course['OR'], classesTaken);
            }

            if (flag) {
                return true;
            }
        } else if (classesTaken.indexOf(course) > 0){
                return true;
        }
    });

    return false;
}

function listAnd(courses, classesTaken) {
    console.log(courses);
    /* if ( !courses ){
        return false;
    } */
    courses.forEach( (course) => {
        let flag = false;
        if ( typeof(course) != "string") {
            if (Object.keys(courses)[0] == 'AND') {
                flag = listAnd(course['AND'], classesTaken);
            } else {
                flag = listOr(course['OR'], classesTaken);
            }

            if (!flag) {
                return false;
            }
        } else if (classesTaken.indexOf(course) > 0){
            return true;
        }
    });

    return true;
}

function canTake(prereqTree, classesTaken) {
    prereqTree = JSON.parse(prereqTree);
    if ( Object.keys(prereqTree)[0] == 'AND' ){
        return listAnd(prereqTree['AND'], classesTaken);
    }else {
        return listOr(prereqTree["OR"], classesTaken);
    }
}

async function classesCanTake(majorReqs, classesTaken) {
    try{
        possibleNextClasses = new Set();
        const trees = await getAllPrereqTrees(classesTaken);

        trees.forEach( (nextClasses) => {
            nextClasses["course"]["prerequisite_for"].forEach( (id) => {
                possibleNextClasses.add(id['id']);
            });
        });

        possibleNextClasses = Array.from(possibleNextClasses);
        
        const classesCanTake = new Set();
        const dataPromises = possibleNextClasses.map( async (classID) => {
            const data = await getPostAndPrereqTree(classID);
            
            return data;
        });

        const data = await Promise.all(dataPromises);

        data.forEach( (course) => {
            console.log(course['course']['id']);
            if (canTake(course['course']['prerequisite_tree'], classesTaken)) {
                classesCanTake.add(course['course']['id']);
            }
        });

    } catch(err) {
        console.log(err);
    }

}

async function getAllPrereqTrees(classes){
    try{
        const prereqs = [];

        const dataPromises = classes.map( async (classID) => {
            const data = await getPostAndPrereqTree(classID);
            return data;
        });
        const data = await Promise.all(dataPromises);

        return data;

    } catch(err) {
        console.log(err);
    }
}



app.listen(PORT);