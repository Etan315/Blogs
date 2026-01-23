import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { uploadImage } from "../../utils/uploadImage";
import PhotoIcon from "../../assets/ic-photo.svg";
import "../../css/PostMedia.css";

interface EditPostProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditPost = ({ post, isOpen, onClose, onUpdate }: EditPostProps) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(post.image_url);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = currentImageUrl;

      if (newImage) {
        finalImageUrl = await uploadImage(newImage);
      }

      const { error } = await supabase
        .from("posts")
        .update({ 
          title, 
          content, 
          image_url: finalImageUrl,
          created_at: new Date().toISOString() 
        })
        .eq("id", post.id);

      if (!error) {
        onUpdate();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header-simple">
          <h1 className="h1-edit">Edit Post</h1>
          <button className="close-x" onClick={onClose}>&times;</button>
        </header>
        
        <form className="edit-form" onSubmit={handleUpdate}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            className="edit-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="modal-actions">
            <div className="left-btn">
              {currentImageUrl ? (
                <div className="current-image-preview">
                  <img src={currentImageUrl} className="comment-img-small" alt="Post" />
                  <button 
                    type="button" 
                    className="btn-remove-photo" 
                    onClick={() => setCurrentImageUrl(null)}
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div className="comment-upload-wrapper">
                  <input
                    type="file"
                    id="edit-post-img"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="edit-post-img" className="add-photo-btn">
                    <img src={PhotoIcon} className="icon-photo" alt="" />
                    <span>{newImage ? newImage.name : "Add/Change Photo"}</span>
                  </label>
                </div>
              )}
            </div>

            <div className="right-btn">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};