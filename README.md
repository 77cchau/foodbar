# Petr's Class Search
Tired of navigating UCI's clunky Schedule of Classes website? So were we, so we harnessed the power of web scraping and API calls to do just that!
An excellent example of the applications of Graphs.

## Inspiration
This hackathon came around the enrollment periods of many UCI students, so frustrating memories of fiddling with UCI's Schedule of Classes website were fresh in our minds. While the website gives what classes are coming next quarter, it is often left to the student to see that a class they want is restricted by school or major, or that they need a certain prerequisite.

## What it does
We wanted to make the course planning process a little easier for students with our new website.

If students are looking for GEs, they want to search within that "GE" category, often for classes that don't have school or major restrictions, and usually without prerequisites. If a user selects the GE option on our website, they can select a GE category, every class in that GE category without restrictions and prerequisites will be presented to the user. This saves students time they would otherwise spend trying to check the restrictions on the Schedule of Classes website!

On the other hand, if a student is looking for major courses, they are interested in the ones they can enroll in given the classes they have already taken. As a result, if a student selects the "Major" category on the website, they will be asked their major, and then given that, will be asked what courses they have taken. When they submit what they already have done, they are given back which major-related courses they are now eligible to take.

## Images:

![image](https://user-images.githubusercontent.com/55062649/180662410-4f0273bc-c1a6-4c72-8042-ab30fc5ea3a8.png)

Landing Page

![image](https://user-images.githubusercontent.com/55062649/180662427-ae4540aa-44be-4ff1-981c-49807d42a243.png)

What happens when you click "Major Classes"

![image](https://user-images.githubusercontent.com/55062649/180662439-ef72e84b-d52f-4b99-ae7d-f9290a17413c.png)

A checklist pop up upon major selection for you to select your already taken classes.

![image](https://user-images.githubusercontent.com/55062649/180662457-5efa13c3-c0d5-43bc-8987-31e84841aef7.png)

All of the postrequisites available to take. (Currently we have a frontend bug preventing proper display of the postrequisites)

## How we built it
Web scraper, PeterPortal, React, Flask, GraphQL, ngrock The frontend was originally coded using pure html and js, however, once we set up the basic format we decided to switch to react to facilitate the creation of lists where we don't know the exact size. Because the person who knew html/swift was gone, a mentor helped guide the initial process and a member tried to recreate what was on the old page but with React. To select a major from a list of majors, we delved into the degree works page to extract a Json file with data that we had to parse to populate a list. This list is hardcoded on the website. Then once a user chooses a major we made a web scraper that we made (following a tutorial) to extract the list of courses that fulfill degree requirements. Using the chosen major, we created a URL to search for the major with the UCI Catalogue Search. From there, we navigated to the major requirements page and scraped all classes that students in this major may take to fulfill their degree. This web scraper is hosted on a server on one of our computers and we had to use ngrock to connect it to the open web so our website could access the data. Once we receive this data, we make a list with checkboxes to let the user choose what classes they have already taken so we can offer the classes they met the prerequisites for. This data is sent to another server that hosts python code that makes a request to an API to gather the prereqs for classes and then process them to create a list of classes that the user is eligible to take. Because we were unsure if we would be able to connect it to the website, a member attempted to convert python code (that included recursion) to js as a backup. This information is then sent back to the website to be displayed. The website also includes a custom petr art that is displayed on the main page. We originally intended for the website to display potential GE's but we ran out of time to implement the backend for it. The website has a page for it that reflects our initial ambitions.

## Challenges we ran into
Getting the courses, Getting queries and formatting to run, Connecting front and back end One of the many challenges we faced throughout the project is that we were unfamiliar with the languages and tools we used. Javascript was a language most of us had never used, we only had one member familiar with React/Html, thus one of us learned on the fly to be able to aid her. A large portion was spent googling and fighting the languages that we were using. Our initial project plan had to be scrapped because we were unable to find a good and free API to find recipes, so time was wasted on that.

## Accomplishments that we're proud of
Athena: I went from knowing almost nothing about react/html to be able to being able to manipulate basic elements. Pranav: I did a lot of thinking of the process of gathering the information we need, in the format we need, learning to use graphQL and flask as tools to facilitate this. Enjoyed learning. Carlos: This was my first time dealing with a lot of the direction aspect of a software project, ensuring my teammates knew what to do with our ideas through plenty of communication and diagrams along the way. It was also my first time focusing on the design aspect of our project to provide a better user experience. Learning some Javascript and a few things about Flask was great.

## What's next for Petr's Class Search if we were to continue.
We plan on implementing GE functionality in the future, and fixing some display errors we have had toward the end of the project. We also want to add more complete course information.

## Team Photos
To Be Added
