# TeamLunaNoteNest

# Project Overview
This is a notes-sharing web application created using MERN stack, and 
targeted towards all enrolled and former students. Users 
have the ability to upload, view, bookmark, and download notes. An account type for Professors 
will also be available to manage and delete notes if they deem it in violation of 
any Academic Integrity rules.

## How to get started
- Move into the folder you want to download the NoteNest repository into
    - Open terminal and enter: `git clone https://github.com/ACastillo5/TeamLunaNoteNest.git`
        - This will clone all the files to your local computer. You should be able to see the same files in GitHub.
- Install Node modules
    - In terminal, run: `npm install`
        - This will download a folder labeled `node_modules`. Once you see this file, you don't necessarily need to run 'npm install' again.
- Run project
    - In terminal, run: `npx nodemon app`
- Open your browser and enter `localhost:3000` 
    - You should be able to view the website.
- To run database
    - Install MongoDB: https://www.mongodb.com/try/download/community
    - Open MongoDB Compass and start a new connection and at the end of the url connection add: "NoteNest"
        - Once running, to see new database items, press 'Refresh' at top right of window
- To populate database
    - In the terminal, run: `npx nodemon populateDatabase.js`