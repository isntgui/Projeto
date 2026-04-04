import React, { useState} from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
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


    async function handleBack() {
        navigate('/');
    }

    return (
        <>
            <div className='container'>
                <h1>Email para recuperar sua senha</h1>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    placeholder='Email'
                    className="form-control mb-2" />
                <button 
                    onClick={handleForgetPassword}
                    className='btn btn-primary w-100 mb-2'
                    disabled={loading}
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                    onClick={handleBack}
                    className='btn btn-danger w-100 mt-2'>
                    Voltar
                </button>
            </div>
        </>
    );
}

export default ForgetPassword;