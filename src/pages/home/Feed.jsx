import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Logout from "../../assets/logout.svg";

export default function Feed() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getProfile() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data: profile } = await supabase
                .from("users")
                .select("user_name, hobbies")
                .eq("id", user.id)
                .single();

            if (!profile) return;

            setUserName(profile.user_name);

            const { data: postsData, error } = await supabase
                .from("post")
                .select(
                    `
            id,
            title,
            content,
            categories,
            created_at,
            user_id
        `,
                )
                .overlaps("categories", profile.hobbies)
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            setPosts(postsData);
        }

        getProfile();
    }, []);

    return (
        <>
            <Navbar />

            <h1>Seja bem vindo {userName}!</h1>

            <p>Aqui será apresentado seu feed</p>

            <hr />

            {posts.length === 0 ? (
                <p>Nenhum post encontrado.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => navigate(`/post/${post.id}`)}
                        style={{
                            border: "1px solid #ccc",
                            padding: "16px",
                            marginBottom: "16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        <h2>{post.title}</h2>

                        <p>{post.content}</p>

                        <small>Categorias: {post.categories.join(", ")}</small>

                        <br />

                        <small>
                            {new Date(post.created_at).toLocaleString()}
                        </small>
                    </div>
                ))
            )}
        </>
    );
}
