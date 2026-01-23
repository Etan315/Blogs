import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import "./../css/Post.css";
import { uploadImage } from "../utils/uploadImage";
import PhotoIcon from "../assets/ic-photo.svg";

interface AddPostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const AddPost = ({ isOpen, onClose, onPostCreated }: AddPostProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  if (!isOpen) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let publicImageUrl = null;

      if (commentImage) {
        publicImageUrl = await uploadImage(commentImage);
      }

      const displayName = user?.user_metadata?.display_name || user?.email;

      const { error } = await supabase.from("posts").insert([
        {
          title,
          content,
          user_id: user?.id,
          author_name: displayName,
          image_url: publicImageUrl,
        },
      ]);

      if (!error) {
        setTitle("");
        setContent("");
        setCommentImage(null);
        onPostCreated();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header-simple">
          <h1 className="h1-edit">Create a New Story</h1>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </header>

        <form className="edit-form" onSubmit={handlePublish}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="edit-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            className="edit-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story..."
            required
          />

          <div className="modal-actions">
            <div className="left-btn">
              <div className="comment-upload-wrapper">
                <input
                  type="file"
                  id="post-image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
                />
                <label htmlFor="post-image-upload" className="add-photo-btn">
                  <img src={PhotoIcon} alt="Add Photo" className="icon-photo" />
                  <span>{commentImage ? commentImage.name : "Add Photo"}</span>
                </label>
                
                {commentImage && (
                  <button
                    type="button"
                    className="btn-remove-photo"
                    onClick={() => setCommentImage(null)}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="right-btn">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-save">
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};