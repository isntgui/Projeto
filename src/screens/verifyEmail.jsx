import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function VerifyEmail() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');

    async function handleCadasterEmail() {
        // Verificando se o email que vai ser cadastrado já está cadastrado na tabela
        const {data, error} = await supabase.from('users')
            .select('email')
            .eq('email', email);

        if (error) {
            console.log('Erro:', error);
        } else {
            if (data.length > 0) {
                alert('Email já cadastrado, tente outro por favor!');
            } else {
                const {data_user_signUP, error_user_signUp} = await supabase.auth.signUp({
                    email,
                    password: 'admin123',
                    options: {
                        emailRedirectTo: 'http://localhost:5173/cadaster-page'
                    }
                });
                
                if (error_user_signUp) {
                    console.log('Error:', error_user_signUp);
                } else {
                    console.log(data_user_signUP);
                }
                alert('Email enviado, confirme o seu email!');
            }
        }
    }

    function handleBackPage() {
        navigate("/");
    }

    return (
        <>
            <h1>Insira o seu email para Cadastrar no Site: </h1>
            <input
                type="email" 
                value={email}
                onChange={((e) => setEmail(e.target.value))}
                placeholder='Email'
                className=""
            ></input>
            <button type="submit" onClick={handleCadasterEmail}>Verificar Email</button>
            <button type="submit" onClick={handleBackPage}>Voltar</button>
        </>
    );
}

export default VerifyEmail;