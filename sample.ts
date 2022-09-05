
// class AuthenticateUser {
//     async userRegister (req: Request, res: Response, next: NextFunction) {
//       passport.authenticate("register", { session: false }, (err, user, info) => {
//           if (err || !user) {
//             console.log('error', err);
//             return handler.send(res, 'This email or username already exists', err.status || 400, 'error');
//           }
//           user.password = undefined;
//           console.log('user', user)
//           return handler.send(res, 'User successfully created!', 200, 'success', user);
//         })(req, res, next);
//       };
    
//       async userLogin (req: Request, res: Response, next: NextFunction) {
//         passport.authenticate("login", {session: false}, async (err, user, info) => {
//           console.log('err', err)
//           console.log('info', info)
    
//           if (err || !user) {
//             console.log('login', info.message)
//             return handler.send(res, info.message, 401, 'error')
//           }
//           user.password = undefined; 
//           console.log('password', user.password);
//           const token = jwt.sign({ email: user.email, role: user.role, username: user.username }, <string>config.jwt_secret, { expiresIn: "10d" });
//           console.log('token', token);
//           const decoded: any = jwt.verify(token, <string>config.jwt_secret);
//           // const iat = decoded.email;
//           console.log('decoded', decoded.role)
//           console.log('user', user.email)
    
//           await UserModel.findOneAndUpdate({email: user.email}, {iat: (decoded.iat).toString()});
//           return handler.send(res, 'user successfully logged in', 200, 'success', token)
//         })(req, res, next)
//       };
  
  
//       async  forgotPassword (req: Request, res: Response, next: NextFunction) {
//         try{
//           const { email } = req.body;
        
//           if (!email) {
//             return handler.send(res, 'Your Email is required!', 400, 'error');
//           }
//           // CHECK IF USER EXISTS IN THE DB
//           const user = await UserModel.findOne({email});
//           if (!user) {
//             return handler.send(res, 'User does not Exist!', 403, 'error');
//           }
          
      
//           let reset_token: string;
//           do{
//             reset_token = nanoid();
//           }while (user?.reset_token === reset_token)
//           // encode a generated random token, the iat, and the user email address and send to the users email.
          
//           await UserModel.findOneAndUpdate({email}, {reset_token, })
      
//           const items = [...user.email, ...user.iat ?? []].join(',');
//           const hashItems = bcrypt.hashSync(items, 10);
      
      
      
//           // SEND EMAIL TO THE USER
      
          
      
//         }catch(error) {
//           console.log(error)
//         }
      
//       }
      
//   }
  