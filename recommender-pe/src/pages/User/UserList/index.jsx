import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/Button';
import { GlobalContext } from "../../../context/globalContext";
import { getAllUsers } from "../../../services/user";

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { usuarioLogado } = useContext(GlobalContext);
    const itemsPerPage = 10;

    // Mapeamentos para tradução
    const roleLabels = {
        ADMIN: "Administrador",
        USER: "Usuário",
        MASTER: "Master"
    };

    const statusLabels = {
        ACTIVE: "Ativo",
        INACTIVE: "Inativo"
    };

    const genderLabels = {
        MALE: "Masculino",
        FEMALE: "Feminino",
        OTHER: "Outro"
    };

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

    // Função para formatar data no padrão brasileiro
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Função para truncar texto longo
    const truncateText = (text, maxLength) => {
        return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="container-fluid default-list-container">
            <Header />

            <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Header Section */}
                <div className="text-center mb-5 default-list-header">
                    <h1 className="default-list-header-title">Usuários</h1>
                    <p className="default-list-header-subtitle">Gerencie todos os usuários cadastrados no sistema</p>
                    <div className="default-list-header-divider"></div>
                </div>

                {/* Main Content Card */}
                <div className="row">
                    <div className="col-12">
                        <div className="card default-list-card">
                            {/* Card Header with Actions */}
                            <div className="card-header default-list-card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="default-list-card-icon me-3">
                                            <i className="bi bi-person-lines-fill text-dark"></i>
                                        </div>
                                        <div>
                                            <h4 className="default-list-card-title">Lista de Usuários</h4>
                                            <p className="default-list-card-subtitle">
                                                {totalElements} {totalElements === 1 ? 'item encontrado' : 'itens encontrados'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <span className="default-list-page-badge">
                                            Página {currentPage + 1} de {totalPages}
                                        </span>
                                        {usuarioLogado && (usuarioLogado.role === "ADMIN" || usuarioLogado.role === "MASTER") && (
                                            <Button
                                                cor="dark"
                                                aoClicar={() => navigate("/register?from=list")}
                                                className="default-list-new-button"
                                            >
                                                <i className="bi bi-plus-circle"></i>
                                                Novo Usuário
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 default-list-table">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3 px-4">ID</th>
                                                <th scope="col" className="py-3">Nome</th>
                                                <th scope="col" className="py-3">Data de Nasc.</th>
                                                <th scope="col" className="py-3">Gênero</th>
                                                <th scope="col" className="py-3">CPF</th>
                                                <th scope="col" className="py-3">Telefone</th>
                                                <th scope="col" className="py-3">Email</th>
                                                <th scope="col" className="py-3">Perfil</th>
                                                <th scope="col" className="py-3">Status</th>
                                                {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                                    <th scope="col" className="py-3">Ações</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr>
                                                    <td
                                                        colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 10 : 9}
                                                        className="text-center py-5"
                                                    >
                                                        <div className="d-flex flex-column align-items-center default-list-loading-container">
                                                            <div className="spinner-border text-dark mb-3 default-list-loading-spinner" role="status">
                                                                <span className="visually-hidden">Carregando...</span>
                                                            </div>
                                                            <span className="text-muted">Carregando usuários...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : users.length > 0 ? (
                                                users.map((user, index) => (
                                                    <tr
                                                        key={user.id}
                                                        style={{
                                                            borderBottom: index === users.length - 1 ? 'none' : '1px solid #f0f0f0'
                                                        }}
                                                    >
                                                        <td className="px-4">
                                                            <span className="default-list-id-badge">
                                                                {user.id}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="fw-medium text-dark">
                                                                {truncateText(`${user.firstName} ${user.lastName}`, 20)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {formatDate(user.birthDate)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {genderLabels[user.gender] || user.gender}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {maskCPF(user.cpf)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {user.phone || '-'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {truncateText(user.email, 25)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {roleLabels[user.role] || user.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`default-list-status-badge ${user.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                                                {statusLabels[user.status] || user.status}
                                                            </span>
                                                        </td>
                                                        {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                                            <td>
                                                                <Button
                                                                    outline
                                                                    cor="dark"
                                                                    tamanho="sm"
                                                                    aoClicar={() => navigate(`/users/${user.id}`)}
                                                                    className="default-list-edit-button"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                    Editar
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 10 : 9}
                                                        className="text-center py-5"
                                                    >
                                                        <div className="d-flex flex-column align-items-center default-list-empty-container">
                                                            <div className="default-list-empty-icon mb-3">
                                                                <i className="bi bi-inbox display-6 text-muted"></i>
                                                            </div>
                                                            <h5 className="text-dark mb-2 default-list-empty-title">
                                                                {currentPage === 0 ? "Nenhum usuário encontrado" : "Nenhum usuário nesta página"}
                                                            </h5>
                                                            <p className="text-muted mb-0">
                                                                {currentPage === 0 ? "Cadastre o primeiro usuário para começar" : "Tente navegar para outra página"}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination Footer */}
                            {totalPages > 1 && (
                                <div className="card-footer default-list-pagination">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-center mb-0">
                                            <li className={`default-list-page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(0)}
                                                    disabled={currentPage === 0}
                                                >
                                                    <i className="bi bi-chevron-double-left"></i>
                                                </button>
                                            </li>

                                            <li className={`default-list-page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    disabled={currentPage === 0}
                                                >
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                            </li>

                                            {getPageNumbers().map(number => (
                                                <li key={number} className={`default-list-page-item ${currentPage === number ? 'active' : ''}`}>
                                                    <button
                                                        className="default-list-page-link"
                                                        onClick={() => setCurrentPage(number)}
                                                    >
                                                        {number + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`default-list-page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    disabled={currentPage === totalPages - 1}
                                                >
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                            </li>

                                            <li className={`default-list-page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(totalPages - 1)}
                                                    disabled={currentPage === totalPages - 1}
                                                >
                                                    <i className="bi bi-chevron-double-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

                                    <div className="text-center default-list-pagination-info">
                                        Mostrando {users.length} de {totalElements} registros
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default UserList;