import React, {useState} from 'react';
import '../css/App.css';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';


function App() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

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
    }
  }

  async function handleForgetPassword() {
    navigate('/forget-password');
  }

  async function handleRegisterUser() {
    if (!email || !senha) {
      alert('Preencha email e senha!');
      return;
    }
    
    const {data, error} = await supabase.auth.signUp({
      email,
      password: senha
    });

    if (error) {
      alert('Erro: ' + error.message);
    } else {
      alert('Usuário cadastro! Verifique seu email email!');
      console.log(data);
    }
  }

  return (
    <>
      <div className="container">
        <h1>Login</h1>
        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
        <input type="password" onChange={(e) => setSenha(e.target.value)} placeholder="Senha"></input>
        <button onClick={handleLogin}>Entrar</button>
        <button onClick={handleForgetPassword}>Esqueceu a senha?</button>
        <button onClick={handleRegisterUser}>Cadastrar</button>
      </div>
    </>
  )
}

export default App;