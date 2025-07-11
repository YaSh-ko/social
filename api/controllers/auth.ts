import { db } from "../connect"
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export const register = (req: Request, res: Response) => {
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("User already exist")
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";

        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
        ];

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
        })
    
    })


}

export const login = (req: Request, res: Response) => {
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data)=> {
        if(err) return res.status(500).json(err)
        if(data.length === 0) return res.status(404).json("User not found!")

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
    
        if(!checkPassword) return res.status(400).json("Wrong password or username")

        const token = jwt.sign({id:data[0].id}, "secretkey", { expiresIn: '7d' });

        const { password, ...others } = data[0]

        res.cookie("accessToken", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).status(200).json(others);
    
    })
}

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken",{
    secure:false,
    sameSite:"lax"
}).status(200).json("User has been logged out.")
};