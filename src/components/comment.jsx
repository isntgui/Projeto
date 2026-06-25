import { useState, useRef, useEffect } from "react";

export default function Comment({
    comment,
    replyTo,
    setReplyTo,
    replyText,
    setReplyText,
    handleComment,
    loadingComment,
    likedComments,
    handleCommentLike,
    onEditComment,
    onDeleteComment,
    currentUserId,
}) {
    const isReplying = replyTo === comment.id;
    const isOwner = currentUserId === comment.user_id;

    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSaveEdit() {
        if (!editText.trim()) return;
        await onEditComment(comment.id, editText);
        setEditing(false);
    }

    return (
        <div
            className="comment"
            style={{
                marginLeft: comment.parent_id ? 20 : 0,
            }}
        >
            <div className="comment-user">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={comment.users?.avatar_url} alt="avatar" />
                    <strong>{comment.users?.user_name}</strong>
                </div>

                {isOwner && (
                    <div ref={menuRef} style={{ position: "relative" }}>
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="comment-menu-btn"
                        >
                            ⋯
                        </button>

                        {menuOpen && (
                            <div className="comment-menu">
                                <button
                                    onClick={() => {
                                        setEditing(true);
                                        setMenuOpen(false);
                                    }}
                                >
                                    ✏️ Editar
                                </button>

                                <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm(
                                            "Você realmente deseja remover este comentário?",
                                        );

                                        if (!confirmDelete) return;

                                        onDeleteComment(comment.id);
                                        setMenuOpen(false);
                                    }}
                                    className="danger"
                                >
                                    🗑️ Excluir
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {editing ? (
                <div className="comment-edit">
                    <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <button className="btn btn-save" onClick={handleSaveEdit}>
                        Salvar
                    </button>

                    <button
                        className="btn btn-cancel"
                        onClick={() => setEditing(false)}
                    >
                        Cancelar
                    </button>
                </div>
            ) : (
                <p className="comment-content">{comment.content}</p>
            )}

            <div className="comment-actions">
                <button onClick={() => handleCommentLike(comment.id)}>
                    {likedComments.has(comment.id) ? "❤️" : "🤍"}{" "}
                    {comment.likes_count ?? 0}
                </button>

                <button onClick={() => setReplyTo(comment.id)}>
                    Responder
                </button>
            </div>

            {isReplying && (
                <div className="comment-reply">
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escreva uma resposta..."
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleComment}
                        disabled={loadingComment}
                    >
                        Enviar
                    </button>
                    <button
                        className="btn btn-cancel"
                        onClick={() => setReplyTo(null)}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {comment.replies?.map((r) => (
                <Comment
                    key={r.id}
                    comment={r}
                    replyTo={replyTo}
                    setReplyTo={setReplyTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    handleComment={handleComment}
                    loadingComment={loadingComment}
                    likedComments={likedComments}
                    handleCommentLike={handleCommentLike}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
}
