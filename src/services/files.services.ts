import { FileRepo } from "../repository/file.repositoru";

export class FilesSevice {
  async download(fileId: number) {
    const fileRepo = FileRepo();
    const file = await fileRepo.findOneOrFail({ where: { id: fileId } });
    return file;
  }
}
