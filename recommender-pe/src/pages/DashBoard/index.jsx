import React, { useState, useEffect } from "react";
import { getGlobalEvaluation } from "../../services/evaluation";
import { getAllUsers } from "../../services/user";
import { getAllPOI } from "../../services/POI";
import { getAllRecommendations } from "../../services/recommender";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../App.css";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    pois: 0,
    recommendations: 0,
    evaluations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [poisList, setPoisList] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar métricas de avaliação
      const metricsResponse = await getGlobalEvaluation();
      if (metricsResponse.success) {
        setMetrics(metricsResponse.data);
      }
      
      // Buscar contagens de usuários, POIs, recomendações e avaliações
      const usersResponse = await getAllUsers();
      const poisResponse = await getAllPOI(0, 1000); // Buscar mais POIs para a lista
      const recommendationsResponse = await getAllRecommendations();
      
      if (usersResponse.success && poisResponse.success && recommendationsResponse.success) {
        setCounts({
          users: usersResponse.data.totalElements || 0,
          pois: poisResponse.data.totalElements || 0,
          recommendations: recommendationsResponse.data.totalElements || 0,
          evaluations: metricsResponse.success ? metricsResponse.data.evaluationCount || 0 : 0
        });
        
        // Armazenar lista de POIs para usar na tabela de frequência
        setPoisList(poisResponse.data.content || []);
      }
      
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="ms-3">Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 mt-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ paddingTop: '0' }}>
      <Header />
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <h1 className="h2 fw-bold" style={{ color: '#b8860b' }}>Dashboard do Sistema</h1>
        </div>

        {/* Cards de Estatísticas */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Usuários
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {counts.users.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-people-fill fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Pontos de Interesse
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {counts.pois.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-geo-alt-fill fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Recomendações
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {counts.recommendations.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-lightbulb-fill fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Avaliações
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {counts.evaluations.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-star-fill fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Avaliação */}
        {metrics && (
          <div className="row mb-4">
            <div className="col-lg-12 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-primary py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-white">Métricas Principais</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h6 className="card-title">Precisão Média (@K)</h6>
                          <h3 className="text-primary">{(metrics.averagePrecisionAtK * 100).toFixed(1)}%</h3>
                          <small className="text-muted">
                            IC: {(metrics.precisionConfidenceLower * 100).toFixed(1)}% - {(metrics.precisionConfidenceUpper * 100).toFixed(1)}%
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h6 className="card-title">Taxa de Acerto (@K)</h6>
                          <h3 className="text-success">{(metrics.hitRateAtK * 100).toFixed(1)}%</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h6 className="card-title">Cobertura de Itens</h6>
                          <h3 className="text-info">{(metrics.itemCoverage * 100).toFixed(1)}%</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h6 className="card-title">Similaridade Intra-lista</h6>
                          <h3 className="text-warning">{(metrics.intraListSimilarity * 100).toFixed(1)}%</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cobertura de Características e Frequência de POIs lado a lado */}
        {metrics && (
          <div className="row mb-4">
            <div className="col-lg-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-primary py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-white">Cobertura de Características</h6>
                </div>
                <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {metrics.globalFeatureCoverage && Object.entries(metrics.globalFeatureCoverage).map(([category, features]) => (
                    <div key={category} className="mb-3">
                      <h6 className="text-capitalize sectionHeader">
                        <i className="bi bi-tag-fill sectionIcon me-2"></i>
                        {category}
                      </h6>
                      {Object.entries(features)
                        .map(([feature, coverage]) => (
                        <div key={feature} className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-capitalize">{feature.toLowerCase()}</span>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '100px', height: '10px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${coverage * 100}%` }}
                                aria-valuenow={coverage * 100} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span className="text-muted small">{(coverage * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-primary py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-white">Frequência de Recomendação por POI</h6>
                </div>
                <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {metrics.poiFrequency && Object.entries(metrics.poiFrequency)
                    .sort(([,a], [,b]) => b - a)
                    .map(([poiId, frequency]) => {
                      const poi = poisList.find(p => p.id === parseInt(poiId));
                      return (
                        <div key={poiId} className="mb-3">
                          <h6 className="text-capitalize sectionHeader">
                            <i className="bi bi-geo-alt-fill sectionIcon me-2"></i>
                            {poi ? poi.name : `POI ${poiId}`}
                          </h6>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">ID: {poiId}</span>
                            <div className="d-flex align-items-center">
                              <div className="progress me-2" style={{ width: '100px', height: '10px' }}>
                                <div 
                                  className="progress-bar bg-success" 
                                  role="progressbar" 
                                  style={{ width: `${frequency * 100}%` }}
                                  aria-valuenow={frequency * 100} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="text-muted small">{(frequency * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {!metrics && !loading && (
          <div className="alert alert-warning" role="alert">
            Nenhuma métrica de avaliação disponível. Execute uma avaliação primeiro.
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;