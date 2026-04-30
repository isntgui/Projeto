import { React, useEffect, useState} from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/navbar';
import Logout from '../../assets/logout.svg';

export default function Feed() {
    const [userName, setUserName] = useState('');

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
                }
            }
        }

        getProfile();
    }, []);

    return (
        <>
            <Navbar />
            <h1>Seja bem vindo { userName } a sua tela de ínicio!</h1>
            <p>Aqui será apresentado ao o seu feed</p>
        </>
    )
}