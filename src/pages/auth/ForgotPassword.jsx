import React, { useState} from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
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
        <form
            className="form"
            onSubmit={(e) => {
            e.preventDefault();
            handleForgetPassword();
            }}
        >
            <h1>Recuperar senha</h1>

            <label>Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
            />

            <button
            type="submit"
            className="btn"
            disabled={loading}
            >
            {loading ? 'Enviando...' : 'Enviar'}
            </button>

            <button
            type="button"
            onClick={handleBack}
            className="link"
            >
            Voltar
            </button>
        </form>
        );
}