import React, { useEffect } from "react";
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";
import DOMPurify from "dompurify";

const TrixEditorWithUpload: React.FC = () => {
  useEffect(() => {
    document.addEventListener("trix-file-accept", (event: Event) => {
      event.preventDefault(); // Mencegah unggahan default
    });

    document.addEventListener("trix-attachment-add", (event: any) => {
      const file = event.attachment.file;
      if (file) {
        uploadImage(file, event.attachment);
      }
    });
  }, []);

  const uploadImage = async (file: File, attachment: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://your-server.com/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      attachment.setAttributes({ url: data.imageUrl });
    } catch (error) {
      console.error("Upload gagal:", error);
    }
  };

  return (
    <TrixEditor uploadURL="https://your-server.com/upload" mergeTags={[]} onChange={(text) => console.log(text)}/>
  );
};

export default TrixEditorWithUpload;