import { Storage } from "aws-amplify";

export async function s3Upload(file: any, user: any) {
  const filename = `${Date.now()}-${user.username}`;
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });
  return stored.key;
}