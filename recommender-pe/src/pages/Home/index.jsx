import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import "../../App.css";
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Home = () => {

  const navigate = useNavigate();

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
    },
    {
      icone: <i className="bi bi-passport fs-4 text-primary"></i>,
      titulo: 'Integração Passaporte PE',
      descricao: 'Gamificação e registro de visitas através do programa oficial'
    },
    {
      icone: <i className="bi bi-graph-up fs-4 text-primary"></i>,
      titulo: 'Dashboard Analítico',
      descricao: 'Visualização de dados de engajamento para parceiros'
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      <Header />

      {/* Seção Hero */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="display-4 fw-bold text-dark mb-4">
            Vamu!Rec - Sistema de Recomendação Turística
          </h2>
          <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            Sistema de filtragem baseada em conteúdo que recomenda Pontos de Interesse (POIs)
            personalizados no Recife, utilizando algoritmos de IA com 79% de precisão.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-4 small text-muted">
            <div className="d-flex align-items-center gap-3 mb-4">
              <Button
                tamanho="sm"
                aoClicar={() => navigate('/register')}
                className="homeButton px-3"
              >
                Cadastre-se e Teste
              </Button>
              <Button
                outline
                tamanho="sm"
                aoClicar={() => window.open('https://github.com/douglasfragoso/recommender-pe', '_blank')}
                className="homeButton px-3"
              >
                <i className="bi bi-github"></i>
                <span className="d-none d-md-inline">Ver no GitHub</span>
              </Button>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-4 small text-muted">
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-star-fill text-warning"></i>
              <span>Baseado em Pesquisa Científica</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-geo-alt text-danger"></i>
              <span>Recife, Brasil</span>
            </div>
          </div>
        </div>
      </section>


      {/* História da Startup */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Nossa História</h3>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <p className="lead text-muted text-center">
                A Vamu! nasceu como projeto de pesquisa acadêmica na USP,
                com o objetivo de resolver problemas reais do turismo em Recife.<br /><br />
                Recife tem grande potencial turístico, mas necessita de soluções digitais para promover seus Pontos de Interesse (POIs). A implementação de um sistema inteligente representa uma oportunidade de inovação no setor. Foi proposto um Sistema de Recomendação via Filtragem Baseada em Conteúdo, que usa TF-IDF e métricas de similaridade para correlacionar as preferências dos usuários com as características dos POIs. O sistema obteve 79% de precisão, 100% de taxa mínima de acerto e 86% de cobertura, demonstrando bom desempenho em cenários de cold start. Sendo assim, o modelo mostrou eficácia na recomendação personalizada, apresentando potencial para impulsionar o turismo local.
              </p>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <Button
                  outline
                  tamanho="sm"
                  aoClicar={() => window.open('https://github.com/douglasfragoso/recommender-pe', '_blank')}
                  className="homeButton"
                >
                  <i className="bi bi-journal-text me-2"></i>
                  Ver Artigo Científico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-5">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Missão, Visão e Valores</h3>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-bullseye fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Missão</h5>
                  <p className="card-text">
                    Promover o turismo local através de recomendações personalizadas de Pontos
                    de Interesse, integrando-se a iniciativas locais como o Passaporte Pernambuco.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-eye fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Visão</h5>
                  <p className="card-text">
                    Ser a infraestrutura padrão de inteligência turística do Brasil, transformando
                    dados em desenvolvimento econômico local e experiências únicas para milhões
                    de viajantes.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-heart fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Valores</h5>
                  <ul className="list-unstyled">
                    <li>• Inovação com propósito</li>
                    <li>• Personalização real</li>
                    <li>• Integração com a comunidade local</li>
                    <li>• Base científica</li>
                    <li>• Sustentabilidade Local</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Funcionalidades</h3>
          <div className="row">
            {funcionalidades.map((item, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
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

      {/* Seção Passaporte Pernambuco */}
       <section className="py-5 bg-primary bg-opacity-10">
        <div className="container text-center">
          <h3 className="h2 fw-bold mb-4">Integração com Passaporte Pernambuco</h3>
          <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            Integração com a iniciativa de turismo da Secretaria de Turismo e Lazer de Pernambuco,
            contendo mais de 36 atrações turísticas do Recife para explorar.
          </p>
           <div className="card mx-auto" style={{ maxWidth: '600px' }}>
            <div className="card-body text-center">
              <h5 className="card-title fw-semibold mb-2">Principais Atrações:</h5>
              <p className="card-text small text-muted">
                Instituto Ricardo Brennand • Museu do Homem do Nordeste • Paço do Frevo •
                Capela Dourada • Casa da Cultura • Teatro de Santa Isabel • e mais...
              </p>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
              <Button
                outline
                tamanho="sm"
                aoClicar={() => navigate('/POIs/cards')}
                className="homeButton"
              >
                Explorar Todos os POIs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Autores */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="h2 fw-bold text-center mb-5">Equipe</h3>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">Douglas Inácio Fragoso Ferreira</h5>
                  <h6 className="card-subtitle mb-3 text-muted">Autor Correspondente</h6>
                  <p className="card-text small text-muted">
                    Universidade de São Paulo (USP)<br />
                    MBA em Engenharia de Software<br />
                    Escola Superior de Agricultura Luiz de Queiroz (Esalq), Pecege<br />
                    <span className="text-primary">douglas.iff@gmail.com</span>
                  </p>
                   <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                    <Button
                      outline
                      tamanho="sm"
                      aoClicar={() => window.open('https://www.linkedin.com/in/douglas-fragoso20221/', '_blank')}
                      className="homeButton"
                    >
                      <i className="bi bi-linkedin me-2"></i>
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">Everton Gomede</h5>
                  <h6 className="card-subtitle mb-3 text-muted">Orientador</h6>
                  <p className="card-text small text-muted">
                    Faculdade de Engenharia Elétrica e Computação<br />
                    Universidade Estadual de Campinas (FEEC/UNICAMP)<br />
                    Doutor em Ciência da Computação<br />
                    <span className="text-primary">gomede@unicamp.br</span>
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                  <Button
                    outline
                    tamanho="sm"
                    aoClicar={() => window.open('https://www.linkedin.com/in/everton-gomede-phd-092b442b2/', '_blank')}
                    className="homeButton"
                  >
                    <i className="bi bi-linkedin me-2"></i>
                    LinkedIn
                  </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;