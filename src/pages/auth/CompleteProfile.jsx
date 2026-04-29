import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../css/global.css';
import '../../css/completeUser.css';

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        alert("Você precisa estar logado!");
        navigate("/");
        return;
      }

      setUser(data.session.user);
    }

    loadSession();
  }, [navigate]);

  async function uploadAvatar() {
    if (!file) return null;
    if (!user) throw new Error("Usuário não carregado");

    const fileExt = file.type.split('/')[1];
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error } = await supabase.storage
      .from('users')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('users')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async function handleCompleteUser(e) {
    e.preventDefault();

    if (!user) {
      alert("Usuário ainda não carregou");
      return;
    }

    try {
      setLoading(true);

      const avatarUrl = await uploadAvatar();

      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name,
          user_name: userName,
          bio,
          avatar_url: avatarUrl ?? null
        });

      if (dbError) throw dbError;

      alert("Cadastro finalizado com sucesso!");
      navigate("/home");

    } catch (err) {
      console.error(err);
      alert(err.message || "Erro no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleCompleteUser}>
      <h1>Complete seu perfil</h1>

      <p className="form-info">{user?.email}</p>

      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          setFile(selectedFile);

          if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
          }
        }}
      />

      <div className="avatar-container">
        <label htmlFor="avatarInput" style={{ cursor: 'pointer' }}>
          {preview ? (
            <img
              src={preview}
              alt="Preview photo-profile"
              className="avatar"
            />
          ) : (
            <div className="avatar placeholder">
              <span>+</span>
            </div>
          )}
        </label>
      </div>

      <input
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />

      <input
        type="text"
        placeholder="Nome de usuário"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="textarea"
      />

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Salvando..." : "Finalizar Cadastro"}
      </button>
    </form>
  );
}