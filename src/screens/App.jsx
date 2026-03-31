import { useState } from 'react'
import '../css/App.css'

function App() {
  function handleLogin() {
    console.log("Lidando com Login");
  }

  function handleForgetPassword() {
    console.log("Lidando com esqueceu a senha");
  }

  function handleRegisterUser() {
    console.log("Lidando com cadastrar novo usuário");
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <input type="email" placeholder="Email"></input>
      <input type="password" placeholder="Senha"></input>
      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleForgetPassword}>Esqueceu a senha?</button>
      <button onClick={handleRegisterUser}>Cadastrar</button>
    </div>
  )
}

export default App
