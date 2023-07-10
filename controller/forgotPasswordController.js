require('dotenv').config()

const crypto = require('crypto')
const User = require('../models').User
const Token = require('../models').Token
const nodemailer = require('nodemailer')

async function requestToken(req, res, next){
  const {email} = req.body

  const user = await User.findOne({where:{email:email}})

  if (!user){
    return res.status(400).json({
      success: false,
      message: 'Email not registered',
      data:null
    })
  }

  const checkToken = await Token.findOne({where:{email:email}})

  if (checkToken){
    checkToken.destroy()
  }

  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  })

  const token = crypto.randomBytes(31).toString('hex')
  
  let emailOptions = {
    from: 'ilhamkurnia.wi@gmail.com',
    to: 'kurilwi00@gmail.com',
    subject: 'Nodemailer Project',
    text: `http://localhost:8080/forgot-password/${token}`
  };

  transporter.sendMail(emailOptions)

  const tokenModel = await Token.create({
    email: user.email,
    token: token
  })

  return res.status(200).json({
    success: true,
    message: 'Success send email to generate new password',
    data: {
      email:tokenModel.email,
      token
    }
  })
}

async function changePassword(req, res, next){
  const {password, confirm_password:confirmPassword} = req.body
  const {idToken} = req.params

  const token = await Token.findOne({where:{token:idToken}})

  if (!token){
    return res.status(200).json({
      success: false,
      message: 'Token is not valid',
      data: null
    })
  }

  
  if (password !== confirmPassword){
    return res.status(200).json({
      success: false,
      message: 'Password and confirm password doesn\'t match',
      data: null
    })
  }

  // const user = await User.findOne({
  //   where:{email:token.email},
  //   attributes: ['name','email','password']
  // })
  // console.log(user);
  await User.update({ 
    password:password
  },
  {
    where:{
      email:token.email
    },
  })

  await token.destroy()

  return res.status(200).json({
    success: true,
    message: `Success change password for user:${token.email}`,
    data:{
      email:token.email,
      password:password
    }
  })
}


module.exports = {
  requestToken,
  changePassword
}