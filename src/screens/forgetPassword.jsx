import React, { useState} from 'react';
import { supabase } from '../lib/supabase';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    
    async function handleForgetPassword() {
        if (loading) return;

        if (!email) {
            alert('Preencha seu email!');
            return;
        }

        setLoading(true);
        
        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5173/reset-password'
        });

        setLoading(false);

        if (error) {
            alert('Erro: ' + error.message);
        } else {
            alert('Email de recuperação enviado!');
            console.log(data);
        }
    }

    return (
        <>
            <div className='container'>
                <h1>Email para recuperar sua senha</h1>
                <input type='email' onChange={(e) => {setEmail(e.target.value)}} placeholder='Email'/>
                <button onClick={handleForgetPassword}>
                    {loading ? 'Enviando' : 'Enviar'}
                </button>
            </div>
        </>
    );
}

export default ForgetPassword;