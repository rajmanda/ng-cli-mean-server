# ng-cli-mean
MONGO
EXPRESS
ANGULAR
NODE 

**About** 

Both the express server and angular application run from the same code base.
In this example, I am using the mongodb from mlabs.com. you can have your own db instance

To build this applicaiton follow the steps below.
1. npm install
2. SET DB_CONN_STRING=mongodb://<<**user**>>:<<**password**>>@<<**mongohost**>>:<<**dbport**>>/<**dbname**>
3. ng build -  creates the dist folder used by express server .
4. node serve -o => opens application on the default browser.
