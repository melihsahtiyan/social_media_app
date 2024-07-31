export interface ICloudinaryService {
    handleUpload(file: Express.Multer.File, folder: string): Promise<string>;
    handleDelete(publicId: string): Promise<boolean>;
}
