import { Storage } from "aws-amplify";

export async function s3Upload(file: any, user: any) {
  const filename = `${Date.now()}-${user.username}-${file.name}`;
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });
  return stored.key;
}

export async function s3UploadUnAuth(file: any, fileName: string) {
  Storage.configure({ level: 'public' });

  const stored = await Storage.put(fileName, file, {
    contentType: file.type
  });
  return stored.key;
}