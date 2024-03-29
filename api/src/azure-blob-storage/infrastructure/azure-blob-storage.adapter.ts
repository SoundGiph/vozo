import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AZURE_BLOB_STORAGE_NO_CREDENTIALS } from "../../common/errors/errors-constants";
import { AzureBlobStoragePort } from "../core/application/ports/azure-blob-storage.port";

const TEST_ENVIRONMENT = "test";
@Injectable()
export class AzureBlobStorageAdapter implements AzureBlobStoragePort {
  constructor(private readonly configService: ConfigService) { }
  private readonly logger = new Logger();

  AZURE_STORAGE_URL = this.configService.get<string>("AZURE_STORAGE_URL", "");

  private connect(containerName: string): ContainerClient {
    if (!this.AZURE_STORAGE_URL) throw new Error(AZURE_BLOB_STORAGE_NO_CREDENTIALS);

    const ENV = this.configService.get<string>("ENV", "development");
    if (ENV === TEST_ENVIRONMENT) {
      containerName = `${containerName}-${TEST_ENVIRONMENT}`;
    }
    const soundGifAzureBlobStorage = BlobServiceClient.fromConnectionString(this.AZURE_STORAGE_URL);
    const containerClient = soundGifAzureBlobStorage.getContainerClient(containerName);
    return containerClient;
  }

  private removeAccents(str: string): string {
    const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    const unaccented = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    let result = str;
    for (let i = 0; i < accents.length; i++) {
      result = result.replace(new RegExp(accents[i], 'g'), unaccented[i]);
    }
    return result;
  }
  //TODO: pourquoi la fonction upload est dans l'adapter et pas dans application/commands


  public async upload(file: Express.Multer.File, containerName: string): Promise<string> {
    const fileName = this.removeAccents(file[0].originalname);
    this.logger.log(
      `AzureBlobStorageAdapter > upload > called with fileName: ${fileName} and containerName: ${containerName}`
    );
    const containerClient = this.connect(containerName);
    const blob = file[0].buffer;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(blob);
    return blockBlobClient.url;
  }
}

