import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Button from '../../../components/Button'
import { GlobalContext } from "../../../context/GlobalContext";
import { getAllUsers } from "../../../services/user";
import '../../../App.css';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { usuarioLogado } = useContext(GlobalContext);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await getAllUsers(currentPage, itemsPerPage);

            if (response.success) {
                setUsers(response.data?.content ?? []);
                setTotalPages(response.data?.totalPages ?? 0);
                setTotalElements(response.data?.totalElements ?? 0);
            } else {
                console.error("Erro ao buscar usuários:", response.messages);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i >= 0 && i < totalPages) {
                pages.push(i);
            }
        }

        return pages;
    };

    // Função para mascarar parte do CPF
    const maskCPF = (cpf) => {
        if (!cpf) return '';
        return cpf.substring(0, 3) + '.***.***-' + cpf.substring(9);
    };

    return (
        <div className="listContainer">
            <Header />

            <div className="listBox">
                <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Header Section */}
                <div className="text-center mb-5 default-list-header">
                    <h1 className="default-list-header-title">Usuários</h1>
                    <p className="default-list-header-subtitle">Gerencie todos os usuários cadastrados no sistema</p>
                    <div className="default-list-header-divider"></div>
                </div>

                

                    <div className="formBody">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="sectionHeader">
                                <i className="bi bi-person-lines-fill sectionIcon"></i>
                                Lista de Usuários Cadastrados
                            </h5>
                            <div className="d-flex align-items-center">
                                <span className="me-3">
                                    Total: {totalElements} usuários
                                </span>
                                {usuarioLogado && (usuarioLogado.role === "ADMIN" || usuarioLogado.role === "MASTER") && (
                                    <Button
                                        aoClicar={() => navigate("/register")}
                                        cor="primary"
                                        tamanho="md"
                                        className="submitButton"
                                    >
                                        <i className="bi bi-plus-circle"></i>
                                        Novo Usuário
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Data de Nasc.</th>
                                        <th scope="col">Gênero</th>
                                        <th scope="col">CPF</th>
                                        <th scope="col">Telefone</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Perfil</th>
                                        <th scope="col">Status</th>
                                        {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                            <th scope="col">Opções</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 9 : 8}
                                                className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <th scope="row">{user.id}</th>
                                                <td>{user.firstName} {user.lastName}</td>
                                                <td>{user.birthDate}</td>
                                                <td>{user.gender}</td>
                                                <td>{maskCPF(user.cpf)}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.status}</td>
                                                {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                                    <td>
                                                        <Button
                                                            cor="secondary"
                                                            outline={true}
                                                            tamanho="sm"
                                                            aoClicar={() => navigate(`/users/${user.id}`)}
                                                            className="me-2"
                                                        >
                                                            Editar
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 9 : 8}
                                                className="text-center">
                                                {currentPage === 0 ? "Nenhum usuário encontrado" : "Nenhum usuário nesta página"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Componente de Paginação */}
                        {totalPages > 1 && (
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center mt-4">
                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(0)}
                                            disabled={currentPage === 0}
                                        >
                                            &laquo; Primeira
                                        </button>
                                    </li>

                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            disabled={currentPage === 0}
                                        >
                                            Anterior
                                        </button>
                                    </li>

                                    {getPageNumbers().map(number => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(number)}
                                            >
                                                {number + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={currentPage === totalPages - 1}
                                        >
                                            Próxima
                                        </button>
                                    </li>

                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(totalPages - 1)}
                                            disabled={currentPage === totalPages - 1}
                                        >
                                            Última &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}

                        <div className="text-center text-muted mt-2">
                            Página {currentPage + 1} de {totalPages} - Mostrando {users.length} de {totalElements} itens
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default UserList;