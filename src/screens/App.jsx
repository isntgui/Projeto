import React, {useState} from 'react';
import '../css/App.css';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../assets/eye.svg';
import EyeOffIcon from '../assets/eyeoff.svg';

function App() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      alert('Preencha email e senha!');
      return;
    }

    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

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

  async function handleForgetPassword() {
    navigate('/forget-password');
  }

  async function handleRegisterUser() {
    navigate('/cadaster-user');
  }

  return (
    <>
      <div className="container">
        <h1>Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-control mb-2"
        />
        <div className="input-password-wrapper mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="form-control"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="eye-button btn p-0"
          >
            <img
              src={showPassword ? EyeOffIcon : EyeIcon}
              alt="Mostrar/Esconder senha"
              width={20}
              height={20}
            />
          </button>
        </div>

        <button onClick={handleLogin} className="btn btn-primary w-100 mb-2">
          Entrar
        </button>
        <button onClick={handleRegisterUser} className="btn btn-success w-100 mb-2">
          Cadastrar
        </button>
        <button onClick={handleForgetPassword} className="btn btn-link w-100">
          Esqueceu a senha?
        </button>
      </div>
    </>
  )
}

export default App;