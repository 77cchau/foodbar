# Petr
HackUCI 2022: Petr


PLAN:

Step 1: Ask them for their major
    -Do this using a drop-down menu
        +Implement a dropdown menu in the front end with all majors in UCI
            ++
        +Pass their selection to the backend
            ++
Step 2: Be able to return all available GEs
    -Ask them which GE category they are interested in
        +Implement dropdown menu in the front end
        +Pass selection from front end to to back end
    -Based on this category, return all not full classes with no prereqs
     and major requirements
        +Use the selection. With this, look through all items with this category.
        For each one offered next quarter, check if they have any prereqs or major
        reqs. If any of these exist, don't consider them, otherwise, add them to a
        list of classes
        +Build this list of classes, and return it to the user

Information to implement:
    -How to present each class
        +Course Name
        +Meeting time
        +Course code
        +Professor
        +Unit Count
        +Description?

    -We need to store their major and later their desired GE categories and
    prereqs