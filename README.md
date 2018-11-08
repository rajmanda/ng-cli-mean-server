# ng-cli-mean-server
MONGO
EXPRESS
ANGULAR
NODE 

**About** 
Same as ng-cli-mean project except this is limiting to just express server. No UI in this project. 

In this example, I am using the mongodb from mlabs.com. you can have your own db instance

To build this applicaiton follow the steps below.
1. npm install
2. SET Environment Variables 
  DB_CONN_STRING=mongodb://<<**user**>>:<<**password**>>@<<**mongohost**>>:<<**dbport**>>/<**dbname**>
  LOCALHOST="34.222.137.103" --> IP Address of the host runnin this server.
  
  **Example in ~/.bashrc**
   export DB_CONN_STRING="mongodb://sritechllc:xxxxxx123@ds149353.mlab.com:49353/db4videoplayer"
   export LOCALHOST="34.222.137.103"

3. node server.js will start the express server on port 3000.
4. In your browser, navigate to http://localhost:3000/api/videos to see the response . It should look something like this.
[{"_id":"599999e1bfc47447805cae6b","description":"","url":"","title":"","__v":0},{"_id":"5b131a2e9ccffb0918ba1151","description":"w","url":"https://www.youtube.com/embed/oUXyL7hYiNY","title":"one","__v":0},{"_id":"5b1325f475cde208c0a14a70","description":"save","url":"https://www.youtube.com/embed/oLtwPzr_8uA","title":"testing","__v":0}]

