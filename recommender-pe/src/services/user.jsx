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