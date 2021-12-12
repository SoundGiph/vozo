import { ICommand, IQueryResult } from '@nestjs/cqrs';

export type UploadFileToAzureStoragePayload = {
  file: File;
  fileName: string;
  containerName: string;
};

export class UploadFileToAzureStorageCommand implements ICommand {
  constructor(public readonly payload: UploadFileToAzureStoragePayload) {}
}

export class UploadFileToAzureStorageCommandResult implements IQueryResult {
  constructor(public readonly fileUrl: string) {}
}
