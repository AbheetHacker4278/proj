import { Video, Image as ImageIcon } from "lucide-react";

interface MediaMessageProps {
  type: 'image' | 'video';
  url: string;
  fileName: string;
}

export const MediaMessage = ({ type, url, fileName }: MediaMessageProps) => {
  if (type === 'image') {
    return (
      <div className="relative group">
        <img 
          src={url} 
          alt={fileName}
          className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(url, '_blank')}
        />
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ImageIcon className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <video 
        controls 
        className="max-w-full rounded-lg"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Video className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};