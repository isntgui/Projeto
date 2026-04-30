import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/navbar';
import '../../css/feed/Profile.css';

export default function Profile() {
    
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

    return (
        <>
            <Navbar />

            <div>
                <h2>Perfil do usuário</h2>

                {avatarUrl && (
                    <img 
                        src={avatarUrl}
                        alt='Foto do perfil'
                        className='photo-profile'
                    />
                )}

                <p><strong>Usuário:</strong> {userName}</p>
                <p><strong>Nome Completo</strong> {userNameComplete}</p>
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Bio:</strong> {userBio}</p>
            </div>
        </>
    );
}