import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import EyeIcon from '../assets/eye.svg';
import EyeOffIcon from '../assets/eyeoff.svg';

function CadasterUser() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [bio, setBio] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleBack() {
        navigate('/');
    }

    async function handleCadaster() {
        if (loading) return;
        setLoading(true);

        if (!email || !senha || !confirmarSenha) {
            alert('Preencha todos os campos!');
            setLoading(false);
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
        });

        if (error) {
            alert('Erro ao cadastrar: ' + error.message);
            setLoading(false);
            return;
        }

        const userId = data.user?.id;
        let avatarUrl = null;

        if (file && userId) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    upsert: true
                });

            if (uploadError) {
                console.log(uploadError);
                alert('Erro ao enviar imagem');
                setLoading(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            avatarUrl = publicUrlData.publicUrl;
        }

        const { error: insertError } = await supabase
            .from('users')
            .insert({
                id: userId,
                email: email,
                bio: bio,
                avatar_url: avatarUrl
            });

        if (insertError) {
            alert('Erro ao salvar perfil');
            setLoading(false);
            return;
        }

        alert('Usuário cadastrado com sucesso!');
        navigate('/');
        setLoading(false);
    }

    return (
        <div className='container'>
            <h1>Cadastro de Usuário</h1>

            <input 
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className='form-control mb-2'
            />

            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='form-control mb-2'
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

            <input
                type={showPassword ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirmar Senha"
                className="form-control mb-2"
            />

            <input
                type='text'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder='Bio'
                className='form-control mb-2'
            />

            <button 
                onClick={handleCadaster}
                disabled={loading}
                className='btn btn-primary w-100 mb-2'>
                {loading ? 'Cadastrando...' : 'Cadastrar Novo Usuário'}
            </button>

            <button
                onClick={handleBack}
                className='btn btn-danger w-100 mt-2'>
                Voltar
            </button>
        </div>
    )
}

export default CadasterUser;