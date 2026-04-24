import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logout from '../assets/logout.svg';

export default function Home() {
    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/');
    }

    return (
        <>
        <h1>Seja bem vindo a tela de início!</h1>
        <p>Aqui será apresentado ao o seu feed</p>
        
        <button onClick={handleLogout}>
            <img 
                src={ Logout }
                alt="Sair da conta"
                />
        </button>
        </>
    )
}