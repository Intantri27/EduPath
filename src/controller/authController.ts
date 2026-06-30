import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// fungsi untuk register
export const register = async (req: Request, res: Response) => {
    try {
        const { nama, email, password } = req.body;

        if (!nama || !email || !password) {
            return res.status(400).json({
                message: "Nama, email, dan password harus diisi"
            });
        }

        const existingUser = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email sudah terdaftar"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                nama,
                email,
                password: hashedPassword
            } as any
        });

        return res.status(201).json({
            message: "Register berhasil",
            data: newUser
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// fungsi untuk login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password harus diisi"
            });
        }

        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Email tidak ditemukan"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Password salah"
            });
        }

        const token = jwt.sign(
            {
                id_user: user.id_user,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
                id_user: user.id_user,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};