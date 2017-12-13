
var _ = require('lodash');
/**
 * addUser(id, name, romName)
 * removeUser(id)
 * getUser(id)
 * getUserList(room)
 */

 class Users {
     constructor(){
         this.users = [];
     }

     addUser(id, name, room){
        var user = {id, name, room}; 
        this.users.push(user);
        return user;
     }

     removeUser(id){
         if (this.getUser(id) === undefined) {
             return undefined;
         }
         var removedUser;
         var newUsersArray = this.users.filter((item)=>{
             if (item.id === id) {
                removedUser = item;
                 return false;
             } else {
                 return true;                
             }
         });

         this.users = newUsersArray;
         return removedUser;
     }

     getUser(id){
        return this.users.filter((element) => {
            return element.id === id;
        })[0];
     }

     getUsersList(room){
        var filteredList =  this.users.filter((item)=>{
            return item.room === room;    
        });
        return filteredList.map((item)=>{
            return item.name;
        });
     }

     isUserNameTaken(name){
         return this.users.filter((item) => {
             return item.name === name;
         });
     }

     getRooms(){
         if(this.users.length === 0 ){
             return [];
         }
         var list =  this.users.map( (item)=>{
            return {room: item.room};
         });

         return _.uniqBy(list,(item) => item.room);
     }
 }

 module.exports = {
     Users
 }