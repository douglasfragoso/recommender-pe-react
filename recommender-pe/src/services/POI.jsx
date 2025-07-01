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


export async function updatePOI(dadosPOI, setExibirModal) {
    await api.put('/poi', dadosPOI)
        .then((resposta) => {
            if (resposta.status === 200) {
                setExibirModal(true);
            }
        })
        .catch((erro) => {
            alert("Erro ao atualizar POI.");
            console.error("Erro ao atualizar POI: ", erro);
        });
}

export async function getAllPOI(page = 0, size = 10) {
    try {
        const response = await api.get(`/poi?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao listar POIs:", error);
        throw error;
    }
}

export async function getPOIById(
    id,
    setName,
    setDescription,
    setMotivations,
    setHobbies,
    setThemes,
    setAddress
) {
    await api.get(`/poi/id/${id}`)
        .then((resposta) => {
            if (resposta.status === 200) {
                setName(resposta.data.name);
                setDescription(resposta.data.description);
                setMotivations(resposta.data.motivations);
                setHobbies(resposta.data.hobbies);
                setThemes(resposta.data.themes);
                setAddress(resposta.data.address);
            }
        })
        .catch((erro) => {
            alert("Erro ao obter POI.");
            console.error("Erro ao obter POI: ", erro);
        });
}

export async function deletePOIById(id) {
    await api.delete(`/poi/id/${id}`)
        .then((resposta) => {
            if (resposta.status === 204) {
                setExibirModal(false);
            }
        })
        .catch((erro) => {
            alert("Erro ao excluir POI.");
            console.error("Erro ao excluir POI: ", erro);
        });

}