// utils/cloudinary.ts
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'myfoodie_dev');
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '527632442728468');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // This will return the URL like "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/filename.jpg"
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};