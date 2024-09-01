 
import * as z from "zod"


const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

export const registerSchema = z.object({
    email: z.string().email({
        message:"Please enter a valid email"
    }),
    username: z.string().min(4, {
        message:"Username must have at least 4 characters"
    }).max(20, {
        message:"Username can have maximum 20 characters"
    }),
    password: z.string().min(6, {
        message:"Password must have at least 6 characters"
    }),
    confirmPassword: z.string().min(6, {
        message:"Password must have at least 6 characters"
    })
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema =  z.object({
    username: z.string().min(4, {
        message:"Username must have at least 4 characters"
    }).max(20, {
        message:"Username can have maximum 20 characters"
    }),
    password: z.string().min(6, {
        message:"Password must have at least 6 characters"
    })
})

export const postSchema = z.object({
    body: z.string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .max(300, {
      message: "Description must not be longer than 300 characters.",
    })
})