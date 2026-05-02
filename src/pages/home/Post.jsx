import { React, useEffect, useState} from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/navbar';
import Logout from '../../assets/logout.svg';

export default function Post() {
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
            <h2>Criar post</h2>
        </>
    )
}