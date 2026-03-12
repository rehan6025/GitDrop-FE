### next

- Add updation of deployment status in backend
- Deployment status should keep on updating , i'll use websockets, frontend subscribes to it , and update info
- I also need to display build logs in terminal style too.
- I first need to call real api , and then redirect user to deployments/:id . websocket to see deployment status and logs
- I need to add state management for auth , so that login with github disappears , when logged in and cookie is valid

### Major Task

- Show live logging of events happening in backend while deploying (websockets needed )
- Figure out how to add ai assistant (Gemini)
- each project must have only 1 active present deployment as of present time
