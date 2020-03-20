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

You will be a hero and save the case by building an app where you will implement `passport.js` to **authenticate users** and create **user roles** so you can restrict access depending on the assigned role.

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

## Iteration #1: Give access to General Manager

In the first iteration, you have to give back control of the company to the General Manager. The platform routes must be protected, so only the logged in users can access them.

In this first iteration, the only user that will be able to access to the platform will be the General Manager, which role will be the **BOSS**.

**Tasks:**

- We already provided 90% of the user schema in the `models/User.model.js` file. Your part is to add these potential roles: **'BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'**. The default should be the 'GUEST'.
- Create a **BOSS** user and give them access to the platform.
- Allow only the **BOSS** user to add and remove employees to/from the platform.

## Iteration #2: Employees

The General Manager can add and remove users, and also, as a boss, they can assign them a role: 'DEV' or 'TA'. Now we need to let them start a session on the platform.

Once they are logged in, they have to be able to edit their profile and view other users' profiles.

**Tasks:**

- Allow users to log in to the platform.
- Allow logged in users to see other users' profiles.
- Allow a user to edit their own profile.

## Bonus: Course creation

We have employees already defined, so our next step is to be able to create our courses. An Ironhack platform without courses is nothing.

The TAs will have the responsibility to create courses, so we will have to create the routes and views to let them create courses. **The courses can be created just by TAs**. The course model is already created for you.

**Tasks:**

- Create a CRUD to let the TAs add/list/update/remove courses from the platform.
- The routes need to be protected, and the TA role will be the only one with this permission being granted.

## Bonus: Alumni

Now that our platform is 100% restored, it's time to let other people come in. We are going to allow the alumni to access our platform by using their Facebook login.

When alumni access the platform with their Facebook profile, we should store their data in the database with the "student" role.

Alumni can see their profile and operative courses. However, they should not be able to see any of the following roles: Boss, Developer, TA.

**Tasks:**

- Allow alumni to log in to the application by using their Facebook profile. We have to use `passport.js` Facebook strategy to let them do that.
- Alumni can see other alumni profiles.
- Alumni can't view different roles profiles: boss, developer, nor TA.
- TAs will be able to add alumni to the courses, creating a nested document in the `Course` model.

Happy coding! :heart:
