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

    useEffect(() => {
        async function loadPost() {
            const { data, error } = await supabase
                .from("post")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error(error);
                return;
            }

            setPost(data);
        }

        loadPost();
    }, [id]);

    if (!post) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <Navbar />

            <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <img src={Back} alt="Voltar" />
            </button>

            <div style={{ padding: "20px" }}>
                <h1>{post.title}</h1>

                <p>{post.content}</p>

                <p>
                    <strong>Categorias:</strong> {post.categories.join(", ")}
                </p>

                <p>{new Date(post.created_at).toLocaleString()}</p>
            </div>
        </>
    );
}
