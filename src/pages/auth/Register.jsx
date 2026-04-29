import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../css/global.css';
import EyeIcon from '../../assets/eye.svg';
import EyeOffIcon from '../../assets/eyeoff.svg';

export default function Register() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCadasterUser() {
        if (!email || !password) {
            alert("Preencha todos os campos");
            return;
        }

        if (password.length < 6) {
            alert("Senha precisa ter pelo menos 6 caracteres");
            return;
        }

        try {
            setLoading(true);

            await supabase.auth.signOut();

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'http://localhost:5173/complete-profile'
                }
            });

            if (error) {
                alert(error.message);
                return;
            }

            alert('Email enviado! Confirme seu email antes de continuar.');

        } catch (err) {
            console.error(err);
            alert("Erro inesperado");
        } finally {
            setLoading(false);
        }
    }

    function handleBackPage() {
        navigate("/");
    }

    return (
        <form className="form" onSubmit={(e) => { e.preventDefault(); handleCadasterUser(); }}>
            <h1>Cadastrar</h1>

            <label>Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
            />

            <label>Senha</label>
            <div className="input-group">
            <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="input"
            />

            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((prev) => !prev)}
                className="toggle-password"
            >
                <img
                src={showPassword ? EyeOffIcon : EyeIcon}
                alt="Mostrar/Esconder senha"
                />
            </button>
            </div>

            <button type="submit" className="btn" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar usuário"}
            </button>

            <button
            type="button"
            onClick={handleBackPage}
            className="link"
            >
            Voltar
            </button>
        </form>
    );
}