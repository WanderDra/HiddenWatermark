const fs = require('fs');

const userdbpath = './src/userdata.json';

export interface User {
    id: string,
    username: string,
    password: string,
    type: string
}

export interface UserDB {
    id: string, 
    users: User[]
}

export const getUser = (username: string): Object | null => {
    try{
        let userdb = JSON.parse(fs.readFileSync(userdbpath, 'utf8'));
        if (userdb.users[username]){
            return userdb.users[username];
        }
        console.log(`User ${username} is not found.`);
        return null;
    }catch(err){
        console.log(err);
        return null;
    }
}

export const addUser = (username: string, password: string, type: string) => {
    let userdb = JSON.parse(fs.readFileSync(userdbpath, 'utf8')) as UserDB;
    let id = (Number.parseInt(userdb.id) + 1).toString();
    userdb.id = id;
    userdb.users.push(
        { id, username, password, type } as User
    );
    try{
        fs.writeFileSync(userdbpath, JSON.stringify(userdb), 'utf8');
    }catch(err){
        console.log(err);
        return false;
    }
    return true;
}