import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Logout from "../assets/logout.svg";
import "../css/navbar.css";

export default function Navbar() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    async function confirmLogout() {
        await supabase.auth.signOut();
        navigate("/");
    }

    return (
        <>
            <nav className="navbar">
                <div className="nav-left">
                    <button
                        className="menu-btn"
                        onClick={() => setMenuOpen(true)}
                    >
                        ☰
                    </button>

                    <h2 className="app-name">Undefined</h2>
                </div>

                <div className="nav-center">
                    <button
                        className="nav-btn"
                        onClick={() => navigate("/home")}
                    >
                        Início
                    </button>

                    <button
                        className="nav-btn"
                        onClick={() => navigate("/profile")}
                    >
                        Ver Perfil
                    </button>

                    <button
                        className="nav-btn"
                        onClick={() => navigate("/create-post")}
                    >
                        Postar
                    </button>

                    <button
                        className="nav-btn"
                        onClick={() => navigate("/manage-post")}
                    >
                        Gerenciar Post(s)
                    </button>
                </div>

                <div className="nav-right">
                    <button
                        className="nav-btn logout-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="28"
                            viewBox="0 -960 960 960"
                            width="28"
                            className="logout-icon"
                        >
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                        </svg>
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <>
                    <div
                        className="drawer-overlay"
                        onClick={() => setMenuOpen(false)}
                    />

                    <aside className="drawer">
                        <button
                            className="close-btn"
                            onClick={() => setMenuOpen(false)}
                        >
                            ✕
                        </button>

                        <button
                            className="drawer-btn"
                            onClick={() => {
                                navigate("/home");
                                setMenuOpen(false);
                            }}
                        >
                            🏠 Início
                        </button>

                        <button
                            className="drawer-btn"
                            onClick={() => {
                                navigate("/profile");
                                setMenuOpen(false);
                            }}
                        >
                            👤 Ver Perfil
                        </button>

                        <button
                            className="drawer-btn"
                            onClick={() => {
                                navigate("/create-post");
                                setMenuOpen(false);
                            }}
                        >
                            ➕ Postar
                        </button>

                        <button
                            className="drawer-btn"
                            onClick={() => {
                                navigate("/manage-post");
                                setMenuOpen(false);
                            }}
                        >
                            📄 Gerenciar Post(s)
                        </button>
                    </aside>
                </>
            )}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>Você realmente quer sair da sua conta?</p>

                        <div className="modal-actions">
                            <button onClick={confirmLogout}>Sim</button>

                            <button onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
