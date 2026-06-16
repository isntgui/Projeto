import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Back from "../../assets/arrow_back2.svg";

export default function PostPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [images, setImages] = useState([]);
    const [author, setAuthor] = useState(null);

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

            // Buscar autor
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

            // Buscar imagens do post
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

    return (
        <>
            <Navbar />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "20px",
                }}
            >
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                    }}
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

            <div style={{ padding: "20px" }}>
                <h1>{post.title}</h1>

                {images.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "20px",
                        }}
                    >
                        {images.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Imagem ${index + 1}`}
                                style={{
                                    maxWidth: "300px",
                                    borderRadius: "8px",
                                }}
                            />
                        ))}
                    </div>
                )}

                <p>{post.content}</p>

                <p>
                    <strong>Categorias:</strong> {post.categories.join(", ")}
                </p>

                <p>{new Date(post.created_at).toLocaleString()}</p>
            </div>
        </>
    );
}
