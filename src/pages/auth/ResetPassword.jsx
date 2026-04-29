import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import '../../css/global.css';
import EyeIcon from '../../assets/eye.svg';
import EyeOffIcon from '../../assets/eyeoff.svg';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes('error')) {
      alert('Link inválido ou expirado. Solicite outro.');
      return;
    }

    async function handleRecovery() {
      if (hash) {
        const { error } = await supabase.auth.exchangeCodeForSession(hash);

        if (error) {
          console.error('Erro ao recuperar sessão:', error.message);
        } else {
          window.history.replaceState({}, document.title, "/reset-password");
        }
      }
    }

    handleRecovery();
  }, []);

  async function handleNewPassword() {
    if (loading) return;

    if (!password || !confirmPassword) {
      alert('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      alert('Sessão inválida ou expirada.');
      navigate('/forgot-password');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      alert('Erro: ' + error.message);
    } else {
      alert('Senha atualizada com sucesso!');
      navigate('/');
    }
  }

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleNewPassword();
      }}
    >
      <h1>Nova senha</h1>

      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="input"
        />
      </div>

      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a senha"
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
        {loading ? 'Salvando...' : 'Salvar nova senha'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="link"
      >
        Voltar para login
      </button>
    </form>
  );
}