import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/navbar";
import Comment from "../../components/comment";
import Back from "../../assets/arrow_back2.svg";
import "../../css/home/ShowPost.css";

export default function PostPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentUserId, setCurrentUserId] = useState(null);

    const [post, setPost] = useState(null);
    const [images, setImages] = useState([]);
    const [author, setAuthor] = useState(null);

    const [liked, setLiked] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);

    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [loadingComment, setLoadingComment] = useState(false);

    const [likedComments, setLikedComments] = useState(new Set());

    const [rootComment, setRootComment] = useState("");
    const [replyText, setReplyText] = useState("");

    const commentTree = useMemo(() => buildTree(comments ?? []), [comments]);

    useEffect(() => {
        async function loadPost() {
            const { data: postData, error: postError } = await supabase
                .from("post")
                .select("*")
                .eq("id", id)
                .single();

            if (postError) {
                console.error(postError);
                return;
            }

            setPost(postData);

            const { data: commentsData, error: commentsError } = await supabase
                .from("comments")
                .select(
                    `
                    id,
                    content,
                    created_at,
                    parent_id,
                    user_id,
                    likes_count,
                    users:user_id (
                        user_name,
                        avatar_url
                    )
                `,
                )
                .eq("post_id", id)
                .order("created_at", { ascending: true });

            if (commentsError) {
                console.error(commentsError);
            } else {
                setComments(commentsData);
            }

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setCurrentUserId(user.id);
                const { data: likeData } = await supabase
                    .from("post_likes")
                    .select("id")
                    .eq("post_id", postData.id)
                    .eq("user_id", user.id)
                    .maybeSingle();

                setLiked(!!likeData);

                const commentsIds = commentsData?.map((c) => c.id) ?? [];

                if (commentsIds.length > 0) {
                    const { data: likedCommentsData } = await supabase
                        .from("comment_likes")
                        .select("comment_id")
                        .eq("user_id", user.id)
                        .in("comment_id", commentsIds);

                    setLikedComments(
                        new Set(
                            likedCommentsData?.map((like) => like.comment_id) ??
                                [],
                        ),
                    );
                }
            }

            const { data: authorData, error: authorError } = await supabase
                .from("users")
                .select("user_name, avatar_url")
                .eq("id", postData.user_id)
                .single();

            if (authorError) {
                console.error(authorError);
            } else {
                setAuthor(authorData);
            }

            const { data: mediaData, error: mediaError } = await supabase
                .from("post_media")
                .select("*")
                .eq("post_id", id)
                .eq("media_type", "image");

            if (mediaError) {
                console.error(mediaError);
                return;
            }

            const imageUrls = mediaData.map((media) => {
                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from("posts")
                    .getPublicUrl(media.storage_path);
                return publicUrl;
            });

            setImages(imageUrls);
        }

        loadPost();
    }, [id]);

    if (!post) {
        return <p>Carregando...</p>;
    }

    function buildTree(comments) {
        const map = new Map();
        const roots = [];

        // ordena por likes antes de montar a árvore
        const sorted = [...comments].sort(
            (a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0),
        );

        sorted.forEach((c) => {
            map.set(c.id, { ...c, replies: [] });
        });

        sorted.forEach((c) => {
            const node = map.get(c.id);

            if (!c.parent_id) {
                roots.push(node);
                return;
            }

            const parent = map.get(c.parent_id);

            if (parent) {
                parent.replies.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    }

    async function handleLike() {
        if (loadingLike) return;

        setLoadingLike(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                alert(
                    "Você precisa estar logado em uma conta para curtir o post",
                );
                return;
            }

            if (liked) {
                const { error } = await supabase
                    .from("post_likes")
                    .delete()
                    .eq("post_id", post.id)
                    .eq("user_id", user.id);

                if (error) {
                    console.error(error);
                    return;
                }

                setLiked(false);
            } else {
                const { error } = await supabase.from("post_likes").insert({
                    post_id: post.id,
                    user_id: user.id,
                });

                if (error) {
                    console.error(error);
                    return;
                }

                setLiked(true);
            }

            const { data: updatedPost, error: postError } = await supabase
                .from("post")
                .select("likes_count, comments_count")
                .eq("id", post.id)
                .single();

            if (postError) {
                console.error(postError);
                return;
            }

            setPost((prev) => ({
                ...prev,
                likes_count: updatedPost.likes_count,
                comments_count: updatedPost.comments_count,
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingLike(false);
        }
    }

    async function handleComment() {
        const isRoot = replyTo === null;
        const text = isRoot ? rootComment : replyText;

        if (!text.trim()) return;

        setLoadingComment(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Você precisa estar logado!");
            setLoadingComment(false);
            return;
        }

        const { error } = await supabase.from("comments").insert({
            post_id: post.id,
            user_id: user.id,
            content: text,
            parent_id: replyTo,
        });

        if (error) {
            console.error(error);
            setLoadingComment(false);
            return;
        }

        setRootComment("");
        setReplyText("");
        setReplyTo(null);

        const { data } = await supabase
            .from("comments")
            .select(
                `
                id,
                content,
                created_at,
                parent_id,
                user_id,
                likes_count,
                users:user_id (
                    user_name,
                    avatar_url
                )
            `,
            )
            .eq("post_id", id)
            .order("created_at", { ascending: true });

        setComments(data);
        setLoadingComment(false);
    }

    async function handleCommentLike(commentId) {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Você precisa estar logado!");
            return;
        }

        const isLiked = likedComments.has(commentId);

        if (isLiked) {
            const { error } = await supabase
                .from("comment_likes")
                .delete()
                .eq("comment_id", commentId)
                .eq("user_id", user.id);

            if (error) {
                console.error(error);
                return;
            }

            setLikedComments((prev) => {
                const next = new Set(prev);
                next.delete(commentId);
                return next;
            });

            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? {
                              ...c,
                              likes_count: Math.max(
                                  0,
                                  (c.likes_count ?? 0) - 1,
                              ),
                          }
                        : c,
                ),
            );
        } else {
            const { error } = await supabase.from("comment_likes").insert({
                comment_id: commentId,
                user_id: user.id,
            });

            if (error) {
                console.error(error);
                return;
            }

            setLikedComments((prev) => {
                const next = new Set(prev);
                next.add(commentId);
                return next;
            });

            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? { ...c, likes_count: (c.likes_count ?? 0) + 1 }
                        : c,
                ),
            );
        }
    }

    async function handleEditComment(commentId, newContent) {
        const { error } = await supabase
            .from("comments")
            .update({ content: newContent })
            .eq("id", commentId);

        if (error) {
            console.error(error);
            return;
        }

        setComments((prev) =>
            prev.map((c) =>
                c.id === commentId ? { ...c, content: newContent } : c,
            ),
        );
    }

    async function handleDeleteComment(commentId) {
        const confirmDelete = window.confirm(
            "Você realmente deseja remover este comentário?",
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (error) {
            console.error(error);
            alert("Erro ao excluir comentário.");
            return;
        }

        setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

    return (
        <>
            <Navbar />

            {/* HEADER */}
            <div className="post-header">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <img src={Back} alt="Voltar" style={{ width: "24px" }} />
                </button>

                {author && (
                    <>
                        <img
                            src={author.avatar_url}
                            alt={author.user_name}
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                        <strong>{author.user_name}</strong>
                    </>
                )}
            </div>

            <div className="post-container">
                <div className="post-card">
                    <h1 className="post-title">{post.title}</h1>

                    {images.length > 0 && (
                        <div className="post-images">
                            {images.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Imagem ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    <p className="post-content">{post.content}</p>

                    <p className="post-categories">
                        <strong>Categorias:</strong>{" "}
                        {post.categories?.join(", ")}
                    </p>

                    <div className="post-actions">
                        <button
                            onClick={handleLike}
                            disabled={loadingLike}
                            className={`btn btn-like ${liked ? "liked" : ""}`}
                        >
                            {liked ? "❤️ Curtido" : "🤍 Curtir"}
                        </button>

                        <span>❤️ {post.likes_count ?? 0}</span>
                        <span>💬 {post.comments_count ?? 0}</span>
                    </div>

                    <p style={{ fontSize: 12, color: "#666" }}>
                        {new Date(post.created_at).toLocaleString()}
                    </p>
                </div>

                {replyTo === null && (
                    <div className="comment-input">
                        <input
                            value={rootComment}
                            onChange={(e) => setRootComment(e.target.value)}
                            placeholder="Escreva um comentário..."
                        />
                        <button
                            onClick={handleComment}
                            disabled={loadingComment}
                        >
                            Enviar
                        </button>
                    </div>
                )}

                <div className="comments-section">
                    <h3>Comentários</h3>

                    {commentTree.map((c) => (
                        <Comment
                            key={c.id}
                            comment={c}
                            replyTo={replyTo}
                            setReplyTo={setReplyTo}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            handleComment={handleComment}
                            loadingComment={loadingComment}
                            likedComments={likedComments}
                            handleCommentLike={handleCommentLike}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
