import * as yup from "yup";

export const userSchema: any = yup.object().shape({
  username: yup
    .string()
    .required("Name is a required field")
    .min(3, "Name should have at least 3 caracteres"),
  email: yup.string().email().required("Email is a required field"),
  password: yup.string().required("Password is a required Field"),
  isAdmin: yup.boolean(),
});
