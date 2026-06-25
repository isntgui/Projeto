import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { supabase } from "../../lib/supabase";
import "../../css/home/ManagePost.css";

export default function ManagePost() {
    const [posts, setPosts] = useState([]);
    const [userHobbies, setUserHobbies] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        title: "",
        content: "",
        categories: [],
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const [{ data: postsData, error: postsError }, { data: profile }] =
            await Promise.all([
                supabase
                    .from("post")
                    .select(
                        `;
(id,
    title,
    content,
    categories,
    created_at`,
                    )
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false }),

                supabase
                    .from("users")
                    .select("hobbies")
                    .eq("id", user.id)
                    .single(),
            ]);

        if (postsError) {
            console.error(postsError);
            return;
        }

        setPosts(postsData ?? []);
        setUserHobbies(profile?.hobbies ?? []);
    }

    function startEdit(post) {
        setEditingId(post.id);

        setEditData({
            title: post.title ?? "",
            content: post.content ?? "",
            categories: post.categories ?? [],
        });
    }

    function cancelEdit() {
        setEditingId(null);

        setEditData({
            title: "",
            content: "",
            categories: [],
        });
    }

    function toggleCategory(category) {
        setEditData((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    }

    async function saveEdit() {
        if (!editData.title.trim()) {
            alert("Informe um título.");
            return;
        }

        if (!editData.content.trim()) {
            alert("Informe um conteúdo.");
            return;
        }

        if (editData.categories.length === 0) {
            alert("Selecione pelo menos uma categoria.");
            return;
        }

        const { error } = await supabase
            .from("post")
            .update({
                title: editData.title,
                content: editData.content,
                categories: editData.categories,
            })
            .eq("id", editingId);

        if (error) {
            console.error(error);
            alert("Erro ao atualizar post.");
            return;
        }

        setPosts((prev) =>
            prev.map((post) =>
                post.id === editingId
                    ? {
                          ...post,
                          title: editData.title,
                          content: editData.content,
                          categories: editData.categories,
                      }
                    : post,
            ),
        );

        cancelEdit();
    }

    async function handleDeletePost(postId) {
        const confirmDelete = window.confirm(
            "Tem certeza que deseja excluir este post?",
        );

        if (!confirmDelete) return;

        const { error } = await supabase.from("post").delete().eq("id", postId);

        if (error) {
            console.error(error);
            alert("Erro ao excluir post.");
            return;
        }

        setPosts((prev) => prev.filter((p) => p.id !== postId));
    }

    return (
        <>
            <Navbar />

            <div className="manage-post-container">
                <h1 className="manage-post-title">Gerenciar Meus Posts</h1>

                {posts.length === 0 ? (
                    <p className="empty-posts">
                        Você ainda não publicou nenhum post.
                    </p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="post-manage-card">
                            {editingId === post.id ? (
                                <>
                                    <input
                                        className="post-edit-input"
                                        value={editData.title}
                                        onChange={(e) =>
                                            setEditData((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                    />

                                    <textarea
                                        className="post-edit-textarea"
                                        value={editData.content}
                                        onChange={(e) =>
                                            setEditData((prev) => ({
                                                ...prev,
                                                content: e.target.value,
                                            }))
                                        }
                                    />

                                    <div className="edit-categories">
                                        <h4>Categorias</h4>

                                        <div className="edit-categories-grid">
                                            {userHobbies.map((hobby) => (
                                                <label
                                                    key={hobby}
                                                    className={
                                                        editData.categories.includes(
                                                            hobby,
                                                        )
                                                            ? "category-chip selected"
                                                            : "category-chip"
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={editData.categories.includes(
                                                            hobby,
                                                        )}
                                                        onChange={() =>
                                                            toggleCategory(
                                                                hobby,
                                                            )
                                                        }
                                                    />

                                                    {hobby}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="post-edit-actions">
                                        <button
                                            className="btn-save"
                                            onClick={saveEdit}
                                        >
                                            💾 Salvar
                                        </button>

                                        <button
                                            className="btn-cancel"
                                            onClick={cancelEdit}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>{post.title}</h2>

                                    <p className="post-manage-content">
                                        {post.content}
                                    </p>

                                    <p className="post-categories">
                                        <strong>Categorias:</strong>{" "}
                                        {post.categories?.length
                                            ? post.categories.join(", ")
                                            : "Nenhuma"}
                                    </p>

                                    <small className="post-manage-date">
                                        {new Date(
                                            post.created_at,
                                        ).toLocaleString()}
                                    </small>

                                    <div className="post-manage-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => startEdit(post)}
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleDeletePost(post.id)
                                            }
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
