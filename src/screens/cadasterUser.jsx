import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function CadasterUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadSession() {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                alert("Você precisa estar logado!");
                navigate("/");
                return;
            }

            setUser(data.session.user);
        }

        loadSession();
    }, [navigate]);

    // Upload do avatar
    async function uploadAvatar() {
        if (!file) return null;
        if (!user) throw new Error("Usuário não carregado");

        const fileExt = file.type.split('/')[1];
        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error } = await supabase.storage
            .from('users')
            .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from('users')
            .getPublicUrl(filePath);
            
        return urlData.publicUrl;
    }

    async function handleCadasterUser() {
        if (!user) {
            alert("Usuário ainda não carregou");
            return;
        }

        if (!password) {
            alert("Digite uma senha!");
            return;
        }

        if (password.length < 6) {
            alert("Senha precisa ter pelo menos 6 caracteres");
            return;
        }

        try {
            setLoading(true);

            const { error: passwordError } = await supabase.auth.updateUser({
                password
            });

            if (passwordError) throw passwordError;

            const avatarUrl = await uploadAvatar();

            const { error: dbError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    email: user.email,
                    bio,
                    avatar_url: avatarUrl ?? undefined
                });

            if (dbError) throw dbError;

            alert("Cadastro finalizado com sucesso!");
            navigate("/");

        } catch (err) {
            console.error(err);
            alert(err.message || "Erro no cadastro");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1>Cadastro de usuários</h1>

            <p>Email: {user?.email}</p>

            <input 
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="text"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />

            <button onClick={handleCadasterUser} disabled={loading}>
                {loading ? "Salvando..." : "Finalizar Cadastro"}
            </button>
        </>
    );
}

export default CadasterUser;