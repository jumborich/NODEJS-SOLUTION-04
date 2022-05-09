const query = require("../utils/query");
const AppError = require("../utils/appError");
const { asyncMiddleware } = require("../utils/asyncWrapper");


const isComplete = (body) => 
  body.name && body.age && body.gender && body.email;

// add user
module.exports.addUser = 
  asyncMiddleware(async (req, res, next) => {
    const body = req.body;
    
    if(!isComplete(body))
      return next(new AppError("missing fields in post body", 422));

    const newUser = {
      name: body.name,
      age: body.age,
      gender: body.gender,
      email: body.email
    };

    const status = await query.create(newUser, next);

    res.status(status).json({ message: "User created successfully" });
  });


// get user(s) 
module.exports.view = 
  asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;

    if(id){
      const user = await query.findById(id, next);
      if(!user)
         return res.status(204).end();
         
      return res.status(200).json({message: "success", user});
    }
    
    // Fetch all users
    const users = await query.findAll(next);

    if(!users.length)
      return res.status(204).end();

    res.status(200).json({message: "success", users});
  });

  const filteredBody = (body) =>{
    const user = {};
    ["name", "email", "age"].forEach(field => 
      body.hasOwnProperty(field) ? user[field] = body[field] : null
    );
    return user;
  };

  // update user
  module.exports.update = 
    asyncMiddleware(async (req, res, next) =>{
      const id = req.params.id;
      const body = req.body;

      // check for empty body
      if(Object.keys(body).length === 0)
        return next(new AppError("can't add empty body as update", 400));

      const user = await query.update(id, filteredBody(body), next);

      if(user)
        res.status(200)
        .json({ message:"user successfully updated", user});
    });

