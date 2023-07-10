const User = require('../models').User

async function register(req,res,next){
  const body = req.body
  
  const user = await User.findOne({where:{email:body.email}})
  if (user) {
    return res.status(400).json({
      success: false,
      message: 'User already registered',
      data:null
    })
  }

  const newUser = await User.create(body)

  res.status(200).json({
    success:true,
    message:'Success create new user',
    data: newUser
  })
}

async function login(req, res, next){
  const body = req.body

  const user = await User.findOne({
    where:{email:body.email},
    attributes:['name','email','password']
  })

  if (!user){
    return res.status(400).json({
      success: false,
      message: 'Email not registered',
      data:null
    })
  }
  
  if (body.password !== user.password){
    return res.status(400).json({
      success: false,
      message: 'Please input correct password.',
      data:null
    })
  }
  else{
    delete user.dataValues.password
    return res.status(400).json({
      success: true,
      message: 'Successfully login',
      data:user
    })
  }
}

module.exports = {
  register,
  login,
}