import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const hash = window.location.hash;

        if (hash.includes('error')) {
            alert('Link inválido ou expirado. Solicite outro.');
            return;
        }

        async function handleRecovery() {
            if (hash) {
                const { error } = await supabase.auth.exchangeCodeForSession(hash);

                if (error) {
                    console.error('Erro ao recuperar sessão:', error.message);
                } else {
                    console.log('Sessão recuperada com sucesso!');
                    window.history.replaceState({}, document.title, "/reset-password");
                }
            }
        }

        handleRecovery();
    }, []);

    async function handleNewPassword() {
        if (!password || !confirmPassword) {
            alert('Preencha todos os campos!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Suas senhas estão diferentes!');
            return;
        }

        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
            alert('Sessão inválida ou expirada.');
            navigate('/forget-password');
            return;
        }

        const { data, error } = await supabase.auth.updateUser({
            password
        });

        if (error) {
            alert('Erro: ' + error.message);
        } else {
            alert('Senha mudada com sucesso!');
            console.log(data);
            navigate('/');
        }
    }

    return (
        <div className='container'>
            <h1>Escreva sua nova senha</h1>
            <input type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Senha' />
            <input type='password' onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirme a senha' />
            <button onClick={handleNewPassword}>Nova Senha</button>
        </div>
    );
}

export default ResetPassword;