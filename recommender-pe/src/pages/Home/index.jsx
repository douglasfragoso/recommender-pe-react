import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

function Home() {
  const tecnologias = [
    { nome: 'Java 21', descricao: 'Desenvolvimento backend' },
    { nome: 'Spring Boot', descricao: 'Framework para APIs' },
    { nome: 'Spring Security', descricao: 'Autenticação e autorização' },
    { nome: 'MySQL', descricao: 'Banco de dados relacional' },
    { nome: 'Apache Common Math3', descricao: 'Cálculos de similaridade' },
    { nome: 'JUnit5 & Mockito', descricao: 'Testes unitários' }
  ];

  const metricas = [
    { nome: 'TF-IDF', descricao: 'Análise de frequência de termos' },
    { nome: 'Similaridade Cosseno', descricao: 'Medida vetorial de similaridade' },
    { nome: 'Distância Euclidiana', descricao: 'Cálculo de distância geométrica' },
    { nome: 'Correlação de Pearson', descricao: 'Análise de relação linear' }
  ];

  const funcionalidades = [
    {
      icone: <i className="bi bi-people fs-4 text-primary"></i>,
      titulo: 'Modelagem de Preferências',
      descricao: 'Perfil avançado de usuários baseado em interesses'
    },
    {
      icone: <i className="bi bi-geo-alt fs-4 text-primary"></i>,
      titulo: 'Recomendações de POIs',
      descricao: 'Sugestões personalizadas de pontos turísticos do Recife'
    },
    {
      icone: <i className="bi bi-lightning-charge fs-4 text-primary"></i>,
      titulo: 'Processamento em Tempo Real',
      descricao: 'Cálculos rápidos usando algoritmos otimizados'
    },
    {
      icone: <i className="bi bi-book fs-4 text-primary"></i>,
      titulo: 'Base Acadêmica',
      descricao: 'Desenvolvido com fundamentação científica rigorosa'
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      <Header />

      {/* Seção Hero */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="display-4 fw-bold text-dark mb-4">
            Sistema de Recomendação Turística
          </h2>
          <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            Sistema de filtragem baseada em conteúdo que recomenda Pontos de Interesse (POIs)
            personalizados no Recife, utilizando algoritmos de similaridade avançados.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-4 small text-muted">
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-star-fill text-warning"></i>
              <span>Projeto Acadêmico</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-geo-alt text-primary"></i>
              <span>Recife, Brasil</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 py-1 px-2 m-0"
                onClick={() => window.open('https://github.com/douglasfragoso/recommender-pe', '_blank')}
              >
                <i className="bi bi-github fs-6"></i>
                <span className="d-none d-sm-inline">Ver no GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Autores */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Equipe de Pesquisa</h3>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Douglas Inácio Fragoso Ferreira</h5>
                  <h6 className="card-subtitle mb-3 text-muted">Autor Correspondente</h6>
                  <p className="card-text small text-muted">
                    Universidade de São Paulo (USP)<br />
                    MBA em Engenharia de Software<br />
                    Escola Superior de Agricultura Luiz de Queiroz (Esalq), Pecege<br />
                    <span className="text-primary">douglas.iff@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Everton Gomede</h5>
                  <h6 className="card-subtitle mb-3 text-muted">Orientador de Doutorado</h6>
                  <p className="card-text small text-muted">
                    Faculdade de Engenharia Elétrica e Computação<br />
                    Universidade Estadual de Campinas (FEEC/UNICAMP)<br />
                    Doutor em Ciência da Computação
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="py-5">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Funcionalidades Principais</h3>
          <div className="row">
            {funcionalidades.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 text-center card-hover">
                  <div className="card-body">
                    <div className="mb-3">
                      {item.icone}
                    </div>
                    <h5 className="card-title h6">{item.titulo}</h5>
                    <p className="card-text small text-muted">{item.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Tecnologias */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Tecnologias Utilizadas</h3>
          <div className="row">
            {tecnologias.map((tech, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-3">
                <div className="card card-hover">
                  <div className="card-body">
                    <h6 className="card-title">{tech.nome}</h6>
                    <p className="card-text small text-muted">{tech.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Métricas */}
      <section className="py-5">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Algoritmos de Similaridade</h3>
          <div className="row">
            {metricas.map((metrica, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 text-center card-hover">
                  <div className="card-body">
                    <h6 className="card-title">{metrica.nome}</h6>
                    <p className="card-text small text-muted">{metrica.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Passaporte Pernambuco */}
      <section className="py-5 bg-primary bg-opacity-10">
        <div className="container text-center">
          <h3 className="h2 fw-bold mb-4">Integração com Passaporte Pernambuco</h3>
          <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            Integração com a iniciativa de turismo da Secretaria de Turismo e Lazer de Pernambuco,
            contendo mais de 36 atrações turísticas do Recife para explorar.
          </p>
          <div className="card mx-auto" style={{ maxWidth: '600px' }}>
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">Principais Atrações:</h5>
              <p className="card-text small text-muted">
                Instituto Ricardo Brennand • Museu do Homem do Nordeste • Paço do Frevo •
                Capela Dourada • Casa da Cultura • Teatro de Santa Isabel • e mais...
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;