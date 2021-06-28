![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# LAB | Express roles


## Introduction

You are asked to create **a full learning platform** covering not only the related CRUDS but adding an extra security layer through sessiones and roles.

As the Ironhack Student Portal is, **all the routes from this platform will also be protected** - except the login and signup ones to allow users to authenticate. 

Any other route should be private, and any attempt to access without being logged must be rejected. 

Fuegote! 🔥


## Requirements

- Fork this repo
- Clone this repo

## Submission

- Upon completion, run the following commands:

  ```
  git add .
  git commit -m "done"
  git push origin master
  ```

- Create Pull Request so your TAs can check up your work.

## Instructions

## Iteration #1: Allow users to acess the platform

Create the full auth system to allow users to signup, login and logout on our platform. 

You will need to install all related dependences, as well as to develop both the routes and views, but we already provided 90% of the user schema in the `models/user.model.js` file. Extend it to add these potential roles: **'PM', 'DEV', 'TA', 'STUDENT'**, and set 'STUDENT' as the default one.




## Iteration #2: Allow logged students to see other students's profiles

Our students want to check other students's profiles.

**Tasks:**

- Create a `/students` endpoint listing all current students from the plaform.
- Include a _View student profile_ button for each student on the list. That button should take the user to a `/students/:id` URL, where you should render a nice profile page with the info from the student that matched with the ID on the URL.
- Prevent access to these routes for any non logged visitor.

:bulb: __tip__: create some random students so you can test your development in the best conditions!



## Iteration #3: Grant specific privileges to the Program Manager

There will be only one user that will have the **PM** role. That user should be able not only to access the platform, but to edit or remove any of the current students.


**Tasks:**

- Use Mongo Compass to give a user the **PM** role.
- This user will be able to see a _Delete student_ and _Edit student_ buttons on each student profile. 
- Develop the needed routing system and views to archive this two goals.
- Avoid any other user except **PM** to see these extra buttons, access the routes or perform any of delete nor edit actions.


## Iteration #4: PM role handling 

The Program Manager can appoint any user as a Developer or a TA. 


**Tasks:**

- Allow the Boss to update through the application any student role to 'DEV' or 'TA'.
- Avoid any other user except **PM** to archive this.

:bulb: __tip__: a couple of buttons on each student profile would do the thing! _Mark as Developer_ and _Mark as TA_. Remember: only our PM would be abe to see those!


## Iteration #5: User profile editing

At this point only our PM is allowed to edit student's profiles. Develop the system to allow each student to edit their own profile.


**Tasks:**

- Create the system that would allow each student to edit _their own profile_.
- Avoid any student to edit other student's profile (except our Program Manager, of course!)




## Bonus: Course creation

We have student already defined, so our next step is to be able to create our courses. An Ironhack platform without courses is nothing.

The TAs will have the responsibility to create courses, so we will have to create the routes and views to let them create courses. **The courses can be created just by TAs**. The course model is already created for you.

**Tasks:**

- Create a CRUD to let the TAs add/list/update/remove courses from the platform.
- The routes need to be protected, and the TA role will be the only one with this permission being granted.

## Bonus: Plaform extras

There are some details to accomplish on your application in order to archive a super proffessional platform:

- Develop a nice menu to easily access courses list and students list.
- Integrate form validation in order to:
  - Ensure all fields from all forms are filled before submitting to the database.
  - Signup: avoid weak passwords. 8 characters as minimum length, one number required.
  - Signup: ensure the student is properly informed when trying to signup with an already taken username.
- Add a security layer on the student profile and course details routes, both containing an ID on the URL:
  - Avoid your application to crash when requested ID does not retrieve any results from the database.
- Allow student assist to any course they want:
  - Include a "Join course" button on every course to add that student to the `students` field from the course model.
  - Render the list of student assistants on every the course view.

Happy coding! :heart:
