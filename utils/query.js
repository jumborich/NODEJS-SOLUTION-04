const fs = require("fs");
const path = require("path");
const AppError = require("./appError");
const { wrapAsync } = require("./asyncWrapper");

const dbPath = path.join(__dirname, "../db/users.json");

const fetchUsers = () =>
  new Promise((resolve, reject) =>{
    fs.readFile(dbPath, "utf8", (err, data) => {
      if(err)
        reject(err);
      
      resolve(JSON.parse(data));
    })
  })

const createUser = (users) =>
  new Promise((resolve, reject) => {
    fs.writeFile(dbPath, users, (err, ) => {
      if(err)
        reject(err);

      resolve(201);
    })
  });

// get all users
module.exports.findAll = 
  wrapAsync( async () => {
    const users = await fetchUsers();
    return users.data;
  });

// get one user
module.exports.findById = 
  wrapAsync( async (id, next) => {
    const users = await exports.findAll(next);

    return users.length && 
    users.find(user => user.id == id);
  });

// creates new users
module.exports.create = 
  wrapAsync( async (postBody, next) => {
    const users = await exports.findAll(next);

    const newId = users.length + 1;
    postBody.id = newId;

    const userBucket = [...users, postBody];
    return await createUser(JSON.stringify({ data: userBucket }))
  });

module.exports.update = 
  wrapAsync( async (id, newBody, next) =>{
    let user = await exports.findById(id, next);

    if(!user)
      return next(new AppError("user does not exist", 400));
    
    const allUsers = await exports.findAll(next);
    user = { ...user, ...newBody};
    
    allUsers[ parseInt(id) - 1 ] = user;

    //update db
    await createUser(JSON.stringify({ data: allUsers }));
    return user;
  });