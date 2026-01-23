import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { uploadImage } from "../../utils/uploadImage";
import PhotoIcon from "../../assets/ic-photo.svg";
import "../../css/PostMedia.css";

export const EditComment = ({ comment, isOpen, onClose, onUpdate }: any) => {
  const [content, setContent] = useState(comment.content);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(comment.image_url);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = currentImageUrl;
      if (newImage) finalImageUrl = await uploadImage(newImage);

      const { error } = await supabase
        .from("comments")
        .update({ content, image_url: finalImageUrl })
        .eq("id", comment.id);

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
          <h1 className="h1-edit">Edit Comment</h1>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </header>

        <form className="edit-form" onSubmit={handleUpdate}>
          <label>Comment</label>
          <textarea
            className="edit-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="modal-actions">
            <div className="left-btn">
              {currentImageUrl ? (
                <div className="current-image-preview">
                  <img
                    src={currentImageUrl}
                    className="comment-img-small"
                    alt="Preview"
                  />
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
                    id="edit-img"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="edit-img" className="add-photo-btn">
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
