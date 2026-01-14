import { useState } from "react";
import { supabase } from "../../supabaseClient";

interface DeletePostProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeletePost = ({
  postId,
  isOpen,
  onClose,
  onDeleted,
}: DeletePostProps) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // This deletes from Supabase and calls onDeleted
  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    setLoading(false);

    if (!error) {
      onDeleted(); // Triggers the list refresh in the background
      onClose(); // Closes the Delete Confirmation Modal
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm">
        <h2>Delete Post?</h2>
        <p>
          This action cannot be undone. Are you sure you want to delete this
          story?
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-delete-confirm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
