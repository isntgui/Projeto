import React, { useState } from 'react';
import '../../css/auth/Login.css';
import '../../css/global.css';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../../assets/eye.svg';
import EyeOffIcon from '../../assets/eyeoff.svg';

export default function Login() {
  const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');

  const [email, setEmail] = useState('agnelosouza2007@gmail.com');
  const [senha, setSenha] = useState('teste10');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert('Preencha email e senha!');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        alert('Email ou senha estão incorretos');
      } else {
        alert('Erro: ' + error.message);
      }
    } else {
      alert('Logado!');
      console.log(data);
      navigate('/home');
    }
  }

  function handleForgetPassword() {
    navigate('/forgot-password');
  }

  function handleRegisterUser() {
    navigate('/register');
  }

  return (
    <form className="form" onSubmit={handleLogin}>
      <h1>Login</h1>

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
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          className="input"
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPassword((prev) => !prev)}
          className="toggle-password"
          aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
        >
          <img
            src={showPassword ? EyeOffIcon : EyeIcon}
            className=''
          />
        </button>
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <button
        type="button"
        onClick={handleRegisterUser}
        className="btn btn-secondary"
      >
        Cadastrar
      </button>

      <button
        type="button"
        onClick={handleForgetPassword}
        className="link"
      >
        Esqueceu a senha?
      </button>
    </form>
  );
}