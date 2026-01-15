import { useState } from "react";
import { supabase } from "../../supabaseClient";

interface EditPostProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditPost = ({
  post,
  isOpen,
  onClose,
  onUpdate,
}: EditPostProps) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // This updates Supabase and calls onUpdate (which is onRefresh from App)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", post.id);

    setLoading(false);
    if (!error) {
      onUpdate(); // Triggers the list refresh in the background
      onClose(); // Closes the Edit Modal
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header-simple">
          <h1 className="h1-edit">Edit Post</h1>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
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
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
