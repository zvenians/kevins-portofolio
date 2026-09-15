import { storage } from "@/lib/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { type MediaAsset } from "@/types/schema";

export interface UploadOptions {
  projectId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read image dimensions"));
    };
    img.src = url;
  });
}

function getVideoDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read video dimensions"));
    };
    video.src = url;
  });
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function uploadMediaAsset({ projectId, file, onProgress }: UploadOptions): Promise<MediaAsset> {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  
  if (!isImage && !isVideo) {
    throw new Error("Unsupported file type. Only images and videos are supported currently.");
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image is too large. Max size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    throw new Error(`Video is too large. Max size is ${MAX_VIDEO_SIZE / 1024 / 1024}MB`);
  }

  let width: number | undefined;
  let height: number | undefined;

  if (isImage) {
    const dims = await getImageDimensions(file);
    width = dims.width;
    height = dims.height;
  } else if (isVideo) {
    const dims = await getVideoDimensions(file);
    width = dims.width;
    height = dims.height;
  }

  const assetId = crypto.randomUUID();
  const ext = file.name.split(".").pop();
  const storagePath = `projects/${projectId}/${assetId}.${ext}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
        const mediaAsset: MediaAsset = {
          id: assetId,
          type: isImage ? "image" : "video",
          url: downloadUrl,
          storagePath,
          contentType: file.type,
          sizeBytes: file.size,
          width,
          height,
          createdAt: new Date(),
        };
        resolve(mediaAsset);
      }
    );
  });
}
