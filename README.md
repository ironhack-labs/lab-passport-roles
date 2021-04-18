![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# LAB | Ironhack Bureau Investigation

![Gadget Inspector](http://i.giphy.com/usZXhnivnVpEA.gif)

## Introduction

Let's imagine the following scenario: you just graduated from your Ironhack as a top student in the class. Ironhack General Manager decides to offer you to join the I.B.I., AKA Ironhack Bureau Investigation. And you accepted it.

There you are, doing a lot of cool stuff, hacking the bad guys, and making this planet a safer place to live. One day, your manager comes to see you with bad news:

```
Hey, Ironhacker!

Last night we were hacked, and all our system is down. There's a lot of stuff
to fix, but I know I can trust you to revert this situation.

First things first, I have lost my super-admin access to the platform, and I need
to retake control to give access to all our content to our employees.

Let's push and solve this problem,

General Manager
```

You will be a hero and save the case by building an app where you will implement a full auth system **authenticate users** and handle **user roles** so you can restrict access depending on the assigned role.

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

As the Ironhack Student Portal is, **all the routes from this platform will also be protected** - except the login and signup ones to allow users to authenticate. 

Any other route should be private, and any attempt to access without being logged must be rejected. 

## Iteration #1: Allow users to acess the platform

Create the full auth system to allow users to signup, login and logout on our platform. 

You will need to install all related dependences, as well as to develop both the routes and views, but we already provided 90% of the user schema in the `models/user.model.js` file. Extend it to add these potential roles: **'BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'**, and set 'GUEST' as the default one.




## Iteration #2: Allow logged users to see other user's profiles

Our users want to check other user's profiles.

**Tasks:**

- Create a `/users` endpoint listing all current users from the plaform.
- Include one `/users/:id` link per user on the list, to render a nice profile page with the info from the `id` matching user.
- Prevent access to these routes for any non logged visitor.



## Iteration #3: Grant specific privileges to the General Manager

There will be only one user that will have the **BOSS** role. That user should be able not only to access the platform, but to edit or remove any of the current users.


**Tasks:**

- Use Mongo Compass to give a user the **BOSS** role.
- This user will be able to see a _Delete user_ and _Edit user_ buttons on each user profile. 
- Develop the needed routing system and views to archive this two goals.
- Avoid any other user to see these extra buttons, access the routes or perform any of the related actions.


## Iteration #4: General Manager role handling 

The General Manager, as a boss, can appoint any user as a Developer or a TA. 


**Tasks:**

- Allow the General Manager to update through the application any user role to 'DEV' or 'TA'.
- Avoid any other user to archive this.


## Iteration #5: User profile editing

At this point only our General Manager is allowed to edit user's profiles. Develop the system to allow each user to edit their own profile.


**Tasks:**

- Create the system that would allow each user to edit _their own profile_.
- Avoid any user to edit other user's profile (except our General Manager, of course!)




## Bonus: Course creation

We have users already defined, so our next step is to be able to create our courses. An Ironhack platform without courses is nothing.

The TAs will have the responsibility to create courses, so we will have to create the routes and views to let them create courses. **The courses can be created just by TAs**. The course model is already created for you.

**Tasks:**

- Create a CRUD to let the TAs add/list/update/remove courses from the platform.
- The routes need to be protected, and the TA role will be the only one with this permission being granted.

## Bonus: Plaform extras

There are some details to accomplish on your application in order to archive a super proffessional platform:

- Integrate form validation in order to:
  - Ensure all fields from all forms are filled before submitting to the database.
  - Signup: avoid weak passwords. 8 characters as minimum length, one number required.
  - Signup: ensure the user is properly informed when truing to signup with an already taken username.
  - URL's containing an id: ensure every URL containing an ID matched MongoDB id format to avoid an application crash.


Happy coding! :heart:
