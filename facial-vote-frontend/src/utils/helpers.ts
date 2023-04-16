import { Storage } from "aws-amplify";

export async function s3Upload(file: any, user: any) {
  const filename = `${Date.now()}-${user.username}-${file.name}`;
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });
  return stored.key;
}

export async function s3UploadUnAuth(file: any) {
  Storage.configure({ level: 'public' });

  const filename = `${Date.now()}-${file.name}`;
  const stored = await Storage.put(filename, file, {
    contentType: file.type
  });
  return stored.key;
}