import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import "../../css/home/CreatePost.css";

export default function CreatePost() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [userHobbies, setUserHobbies] = useState([]);

    useEffect(() => {
        async function loadUserHobbies() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from("users")
                .select("hobbies")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error(error);
                return;
            }

            setUserHobbies(data?.hobbies ?? []);
        }

        loadUserHobbies();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category],
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = e.target;

            const title = form.feedTitle.value;
            const content = form.feedContent.value;

            if (selectedCategories.length === 0) {
                alert("Selecione pelo menos uma categoria.");
                return;
            }

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                alert("Você precisa estar logado.");
                return;
            }

            const { data: post, error: postError } = await supabase
                .from("post")
                .insert({
                    user_id: user.id,
                    title,
                    content,
                    categories: selectedCategories,
                })
                .select()
                .single();

            if (postError) {
                console.error(postError);
                alert("Erro ao criar o post.");
                return;
            }

            for (const image of images) {
                const extension = image.name.split(".").pop();

                const fileName = `${crypto.randomUUID()}.${extension}`;

                const filePath = `${post.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("posts")
                    .upload(filePath, image);

                if (uploadError) {
                    console.error(uploadError);
                    continue;
                }

                const { error: mediaError } = await supabase
                    .from("post_media")
                    .insert({
                        user_id: user.id,
                        post_id: post.id,
                        media_type: "image",
                        storage_path: filePath,
                    });

                if (mediaError) {
                    console.error(mediaError);
                }
            }

            alert("Post criado com sucesso!");

            form.reset();
            setSelectedCategories([]);
            setImages([]);
        } catch (error) {
            console.error(error);
            alert("Erro inesperado.");
        }
    };
    return (
        <>
            <Navbar />
            <div className="create-post-container">
                <form onSubmit={handleSubmit} className="create-post-form">
                    <h1>Crie o seu feed</h1>

                    <div>
                        <label>Título do feed</label>
                        <input
                            type="text"
                            id="feedTitle"
                            name="feedTitle"
                            required
                        />
                    </div>

                    <div>
                        <label>Conteúdo do feed</label>
                        <textarea
                            id="feedContent"
                            name="feedContent"
                            rows="6"
                        />
                    </div>

                    <div>
                        <h3>Categorias</h3>

                        <div className="create-post-categories">
                            {userHobbies.map((hobby) => (
                                <label key={hobby}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(
                                            hobby,
                                        )}
                                        onChange={() =>
                                            handleCategoryChange(hobby)
                                        }
                                    />
                                    {hobby}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="create-post-file">
                        <label>Adicionar imagens</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                                setImages(Array.from(e.target.files || []))
                            }
                        />
                    </div>

                    <button className="create-post-btn" type="submit">
                        Publicar
                    </button>
                </form>
            </div>
        </>
    );
}
