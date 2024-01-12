import * as yup from "yup";

export const userSchema: any = yup.object().shape({
  username: yup
    .string()
    .strict(true)
    .required("Name is a required field")
    .min(3, "Name should have at least 3 caracteres"),
  email: yup
    .string()
    .email()
    .strict(true)
    .required("Email is a required field"),
  password: yup.string().required("Password is a required Field"),
  isAdm: yup.boolean().strict(true).required("You must specify this field"),
});

export const loginSchema: any = yup.object().shape({
  email: yup.string().email().required("Email is a required field"),
  password: yup.string().required("Password is a required Field"),
});
