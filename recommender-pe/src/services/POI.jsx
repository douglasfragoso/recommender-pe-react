import { api } from "./api";

export async function savePOI(POI) {
    await api.post('/POI/register', POI)
        .then((resposta) => {
            if (resposta.status === 201) {
                alert("POI cadastrado com sucesso!");
            }
        })
        .catch((erro) => {
            alert("Erro ao cadastrar POI.");
            console.error("Erro ao cadastro POI: ", erro);
        });
}