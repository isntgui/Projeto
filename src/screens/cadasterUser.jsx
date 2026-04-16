import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function CadasterUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Você precisa confirmar o email primeiro!");
                navigate("/");
                return;
            }

            setUser(user);
        }

        loadUser();
    }, [navigate]);

    async function handleCadasterUser() {
        if (!password) {
            alert("Digite uma senha!");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.log(error);
            alert("Erro ao definir senha!");
        } else {
            alert("Cadastro finalizado com sucesso!");
            navigate("/");
        }
    }

    return (
        <>
            <h1>Cadastro de usuários</h1>

            <p>Email: {user?.email}</p>

            <input 
                type="file"
            />

            <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="text"
                placeholder='Bio'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />

            <button onClick={handleCadasterUser}>
                Finalizar Cadastro
            </button>
        </>
    );
}

export default CadasterUser;