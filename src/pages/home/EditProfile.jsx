import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/navbar";
import { useNavigate } from "react-router-dom";
import "../../css/home/EditProfile.css";
import Back from "../../assets/arrow_back.svg";

export default function EditProfile() {
    const navigate = useNavigate();

    const hobbiesList = [
        "Viagem",
        "Corrida",
        "Academia",
        "Futebol",
        "Vôlei",
        "Basquete",
        "Ciclismo",
        "Natação",
        "Leitura",
        "Música",
        "Cinema",
        "Dança",
        "Yoga",
        "Passeios de carro",
        "Passeio ao ar livre",
        "Compras",
        "Jardinagem",
        "Escalada",
        "Praia",
        "Pescar",
        "Acampar",
        "Trilhas",
    ];

    const [hobbies, setHobbies] = useState([]);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [userNameComplete, setUserNameComplete] = useState("");
    const [userBio, setUserBio] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                alert("Você precisa estar logado!");
                navigate("/");
                return;
            }

            const currentUser = data.session.user;
            setUser(currentUser);

            const { data: profile } = await supabase
                .from("users")
                .select("*")
                .eq("id", currentUser.id)
                .single();

            if (profile) {
                setUserName(profile.user_name || "");
                setUserNameComplete(profile.name || "");
                setUserBio(profile.bio || "");
                setAvatarUrl(profile.avatar_url || "");
                setHobbies(profile.hobbies || []);
            }
        }

        loadProfile();
    }, [navigate]);

    function toggleHobby(hobby) {
        setHobbies((prev) =>
            prev.includes(hobby)
                ? prev.filter((h) => h !== hobby)
                : [...prev, hobby],
        );
    }

    async function uploadAvatar() {
        if (!file || !user) return null;

        const fileExt = file.type.split("/")[1];

        const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from("users")
            .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage.from("users").getPublicUrl(filePath);

        return data.publicUrl;
    }

    async function handleSave() {
        setLoading(true);

        try {
            let newAvatar = await uploadAvatar();

            const finalAvatar = newAvatar ?? avatarUrl ?? null;

            if (newAvatar) {
                setAvatarUrl(newAvatar);
                setPreview(null);
            }

            await supabase
                .from("users")
                .update({
                    user_name: userName,
                    name: userNameComplete,
                    bio: userBio,
                    avatar_url: finalAvatar,
                    hobbies,
                })
                .eq("id", user.id);

            alert("Perfil atualizado!");
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar perfil");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />

            <div className="edit-container">
                <div className="header-edit">
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <img src={Back} alt="Voltar" />
                    </button>

                    <h2>Editar perfil</h2>
                </div>

                <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const selected = e.target.files[0];
                        setFile(selected);

                        if (selected) {
                            setPreview(URL.createObjectURL(selected));
                        }
                    }}
                />

                <div className="avatar-container">
                    <label htmlFor="avatarInput" className="avatar-input">
                        {preview || avatarUrl ? (
                            <img
                                src={preview || avatarUrl}
                                alt="Avatar"
                                className="avatar"
                            />
                        ) : (
                            <div className="avatar placeholder">
                                <span>+</span>
                                <p>Adicionar foto</p>
                            </div>
                        )}
                    </label>
                </div>

                <div className="form-group">
                    <label>Nome de usuário</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Nome completo</label>
                    <input
                        type="text"
                        value={userNameComplete}
                        onChange={(e) => setUserNameComplete(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        value={userBio}
                        onChange={(e) => setUserBio(e.target.value)}
                    />
                </div>

                <div className="hobbies-section">
                    <label>Preferências</label>

                    <div className="hobbies-grid">
                        {hobbiesList.map((hobby) => (
                            <button
                                key={hobby}
                                type="button"
                                className={`hobby-card ${
                                    hobbies.includes(hobby) ? "selected" : ""
                                }`}
                                onClick={() => toggleHobby(hobby)}
                            >
                                {hobby}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>
        </>
    );
}
