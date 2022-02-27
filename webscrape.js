const PORT = 1234;
const fetch = require('node-fetch');
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const res = require('express/lib/response')
const app = express()

app.get('/', function (req, res) {
    res.json("Why are you here? Hrm.");
});

app.get('/prereqs', function (req, res) {
    const boo = async function getAllClassInfo() {
        const requiredClasses = await getMajorRequirements("BUSINESS ADMINISTRATION")["classes"];
        res.json(requiredClasses);
    }
    boo();
});

app.get('/ge-classes', function (req, res) {
    const boo = async function getGEInfo(ge) {
        const geClasses = await getGEClasses(ge);
        res.json(geClasses);
    }
    boo("GE-2");
});

function removeExtendedChars(str) {
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            return str.slice(0, i) + str.slice(i+1);
        }
    }
    return -1;
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

async function getPrereqTree(classID){
    const petrURL = "https://api.peterportal.org/graphql";
    const query = `
        query{
            course("${classID}) {
                prerequisite_tree
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
    const prereqTree = data['data'];

    return prereqTree;
}

function getAllPrereqTrees(major){
    const requiredClasses = await getMajorRequirements(major)["classes"];

}


app.listen(PORT);