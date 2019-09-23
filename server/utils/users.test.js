const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [
            {id:"123abc", name:"be_tester1", room:"node tests"},
            {id:"124abc", name:"be_tester2", room:"node dev"},
            {id:"125abc", name:"be_tester3", room:"node libs"},
            {id:"126abc", name:"be_tester4", room:"node dev"}
        ];
    });
    it('should add new user', () => {
        var testUser = {id:"jwhfb4jbe56", name:"tester", room:"node tests"};
        var length = users.users.length;
        users.addUser(testUser.id, testUser.name, testUser.room);
        expect(users.users).toContainEqual(testUser);
        expect(users.users.length).toEqual(length + 1);
    });

    it('should remove user', () => {
        var user = {
            id : users.users[0].id, 
            name : users.users[0].name, 
            room : users.users[0].room
        };        
        var length = users.users.length;
        expect(users.removeUser(user.id)).toEqual(user);
        expect(users.users).not.toContainEqual(user);
        expect(users.users.length).toBe(length - 1);
    });

    it('should not remove user', () => {
        var user = users.users[0];
        var length = users.users.length;
        expect(users.removeUser(user.id+"1")).toBeFalsy();
        expect(users.users).toContainEqual(user);
        expect(users.users.length).toBe(length);
    });

    it('should find user', () => {
        var index = 1;
        expect(users.getUser(users.users[index].id)).toEqual(users.users[index]);
    });

    
    it('should not find user', () => {
        var index = 1;
        expect(users.getUser(
            users.users[index].id +"t" //here we modify the id
        )).not.toEqual(users.users[index]);//the user should not be found since the id was modified
        
    });
    
    it('should return all user names inside a room', () => {
        var index = 1;
        var names = users.users
            .filter((user)=> user.room === users.users[index].room)//get users of a specific room
            .map((item => item.name)//map the array toan array of names
        );
        expect(users.getUsersList(users.users[index].room)).toEqual(names);
    });
});