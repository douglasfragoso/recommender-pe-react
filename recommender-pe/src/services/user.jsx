import { api } from "./api";

export async function saveUser(user) {
    await api.post('/user/register', user)
        .then((resposta) => {
            if (resposta.status === 201) {
                alert("Usuário cadastrado com sucesso!");
            }
        })
        .catch((erro) => {
            alert("Erro ao cadastrar usuario.");
            console.error("Erro ao cadastro usuario: ", erro);
        });
}

export async function getAllUsers(page = 0, size = 10) {
    try {
        const response = await api.get(`/user?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao listar Usuários:", error);
        throw error;
    }
}