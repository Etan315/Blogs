import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import './../css/Post.css';

interface AddPostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const AddPost = ({ isOpen, onClose, onPostCreated }: AddPostProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  if (!isOpen) return null; // Don't render anything if not open

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const displayName = user?.user_metadata?.display_name || user?.email;
    const { error } = await supabase.from("posts").insert([
    {
      title,
      content,
      user_id: user?.id,
      author_name: displayName, // Save the name here
    },
  ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setTitle("");
      setContent("");
      onPostCreated(); // Refresh the list
      onClose();       // Close the modal
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>Create New Post</h1>
        <form className="add-post" onSubmit={handlePublish}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />

          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story..."
            className="text-content"
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-publish">
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};