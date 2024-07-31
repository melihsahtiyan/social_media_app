export interface ICloudinaryService {
    handleUpload(file: string, folder: string): Promise<string>;
    handleDelete(publicId: string): Promise<boolean>;
}
