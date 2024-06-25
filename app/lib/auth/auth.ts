// import { NextRequest, NextResponse } from 'next/server`'
// import jwt from 'jsonwebtoken'

// export function authMiddleware(
//   handler: (req: NextRequest, res: NextResponse) => void
// ) {
//   return async (req: NextRequest, res: NextResponse) => {
//     const token = req.headers.authorization?.split(' ')[1]
//     if (!token) return res.status(401).json({ error: 'No token provided' })

//     try {
//       if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')
//       const decoded = jwt.verify(token, process.env.JWT_SECRET)
//       req.user = decoded
//       return handler(req, res)
//     } catch (error) {
//       return res.status(401).json({ error: 'Invalid token' })
//     }
//   }
// }
