import { React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Logout from '../../assets/logout.svg';

export default function Feed() {
    const navigate = useNavigate();

    // =============== dados dos usuários ===============
    const [userName, setUserName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userNameComplete, setUserNameComplete] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userBio, setUserBio] = useState('');

    useEffect(() => {
        async function getProfile() {
            const { data: { user }} = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('users')
                    .select('user_name, name, email, bio, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUserName(data.user_name);
                    setUserNameComplete(data.name);
                    setUserEmail(data.email);
                    setUserBio(data.bio);
                    setAvatarUrl(data.avatar_url);
                }
            }
        }

        getProfile();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/');
    }

    return (
        <>
        <h3>Dados do Usuário:</h3>
        <p>Foto de perfil: </p>
        { avatarUrl && (
            <img 
                src={avatarUrl}
                alt='Foto de perfil'
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                }}
            />
        )}
        <p>Nome de usuário: {userName}</p>
        <p>Nome completo do usuário: {userNameComplete}</p>
        <p>Email de usuário: {userEmail}</p>
        <p>Bio do usuário: {userBio}</p>
        <hr></hr>
        <h1>Seja bem vindo a sua tela de ínicio!</h1>
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