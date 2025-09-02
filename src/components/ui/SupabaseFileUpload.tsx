import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseFileUploadProps {
  bucket?: string;
  folder?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export const SupabaseFileUpload = ({ bucket = 'images', folder = '', onUpload, label }: SupabaseFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const filePath = `${folder ? folder + '/' : ''}${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) {
      setUploading(false);
      alert('Upload failed: ' + error.message);
      return;
    }
    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    setUploading(false);
    setProgress(100);
    if (urlData?.publicUrl) {
      onUpload(urlData.publicUrl);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};
