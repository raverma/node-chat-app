const expect = require('expect');

const {Users} = require('./users');


describe('User', ()=>{
    var users;

    beforeEach(()=>{
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }];
    })

    it('should add new user', ()=> {
        var users = new Users();
        var user = {
            id: '1234',
            name: 'Rahul',
            room: 'The Moview fans'
        };

        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return users for react course', ()=> {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });

    it('should remove a user', () => {
        var user = users.removeUser('1');
        expect(user.id).toBe('1');
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        var user = users.removeUser(4);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);   
    });

    it('should return a user', () => {
        var user = users.getUser('2');
        expect(user.id).toBe('2');
    });

    it('should not return a user', () => {
        var user = users.getUser('4');
        expect(user).toNotExist();
    });
});