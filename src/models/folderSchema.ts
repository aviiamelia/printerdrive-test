import * as yup from "yup";

export const folderSchema: any = yup.object().shape({
  folderName: yup.string().required("Name is a required field"),
  ownerId: yup.number(),
  parentFolderId: yup.number(),
});
