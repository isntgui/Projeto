import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Logout from "../../assets/logout.svg";
import "../../css/home/Feed.css";

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
            user_id,
            likes_count,
            comments_count
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

            <div className="feed-container">
                <h2 className="feed-welcome">Seja bem vindo {userName}!</h2>

                <p>Aqui será apresentado seu feed</p>

                <hr />

                {posts.length === 0 ? (
                    <p>Nenhum post encontrado.</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="feed-post"
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            <h2 className="feed-post-title">{post.title}</h2>

                            <p className="feed-post-content">{post.content}</p>

                            <div className="feed-post-meta">
                                <span>
                                    Categorias: {post.categories.join(", ")}
                                </span>

                                <span> | </span>

                                <span>
                                    ❤️ {post.likes_count ?? 0} • 💬{" "}
                                    {post.comments_count ?? 0}
                                </span>

                                <span> | </span>

                                <span>
                                    {new Date(post.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
