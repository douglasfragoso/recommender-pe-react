import React, { useState, useEffect } from "react";
import { getGlobalEvaluation } from "../../services/evaluation";
import { getAllUsers } from "../../services/user";
import { getAllPOI } from "../../services/POI";
import { getAllRecommendations } from "../../services/recommender";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../App.css";
import "./Dashboard.css"; // Import do CSS separado

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
      
      const metricsResponse = await getGlobalEvaluation();
      if (metricsResponse.success) {
        setMetrics(metricsResponse.data);
      }
      
      const usersResponse = await getAllUsers();
      const poisResponse = await getAllPOI(0, 1000);
      const recommendationsResponse = await getAllRecommendations();
      
      if (usersResponse.success && poisResponse.success && recommendationsResponse.success) {
        setCounts({
          users: usersResponse.data.totalElements || 0,
          pois: poisResponse.data.totalElements || 0,
          recommendations: recommendationsResponse.data.totalElements || 0,
          evaluations: metricsResponse.success ? metricsResponse.data.evaluationCount || 0 : 0
        });
        
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
      <div className="container-fluid">
        <Header />
        <div className="d-flex justify-content-center align-items-center dashboard-loading-container">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3 dashboard-loading-spinner" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h5 className="dashboard-loading-text">Carregando dashboard...</h5>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="container py-4">
          <div className="alert alert-danger shadow-sm dashboard-alert" role="alert">
            <i className="bi bi-exclamation-triangle-fill dashboard-alert-icon"></i>
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container-fluid dashboard-container">
      <Header />
      <div className="container-fluid py-4 bg-light">
        
        <div className="text-center mb-5 dashboard-header">
          <h1 className="dashboard-header-title">Dashboard do Sistema</h1>
          <p className="dashboard-header-subtitle">Visão geral completa do sistema de recomendações</p>
          <div className="dashboard-header-divider"></div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-xl-3 col-md-6">
            <div className="card dashboard-stat-card dashboard-stat-card-primary">
              <div className="dashboard-stat-card-bg"></div>
              <div className="dashboard-stat-card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-primary dashboard-stat-card-label">
                      Usuários
                    </div>
                    <div className="dashboard-stat-card-value">
                      {counts.users.toLocaleString()}
                    </div>
                  </div>
                  <div className="dashboard-stat-card-icon">
                    <i className="bi bi-people-fill fs-1 text-primary"></i>
                  </div>
                </div>
              </div>
              <div className="dashboard-stat-card-footer bg-primary"></div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card dashboard-stat-card dashboard-stat-card-success">
              <div className="dashboard-stat-card-bg"></div>
              <div className="dashboard-stat-card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-success dashboard-stat-card-label">
                      Pontos de Interesse
                    </div>
                    <div className="dashboard-stat-card-value">
                      {counts.pois.toLocaleString()}
                    </div>
                  </div>
                  <div className="dashboard-stat-card-icon">
                    <i className="bi bi-geo-alt-fill fs-1 text-success"></i>
                  </div>
                </div>
              </div>
              <div className="dashboard-stat-card-footer bg-success"></div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card dashboard-stat-card dashboard-stat-card-info">
              <div className="dashboard-stat-card-bg"></div>
              <div className="dashboard-stat-card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-info dashboard-stat-card-label">
                      Recomendações
                    </div>
                    <div className="dashboard-stat-card-value">
                      {counts.recommendations.toLocaleString()}
                    </div>
                  </div>
                  <div className="dashboard-stat-card-icon">
                    <i className="bi bi-lightbulb-fill fs-1 text-info"></i>
                  </div>
                </div>
              </div>
              <div className="dashboard-stat-card-footer bg-info"></div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card dashboard-stat-card dashboard-stat-card-warning">
              <div className="dashboard-stat-card-bg"></div>
              <div className="dashboard-stat-card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-warning dashboard-stat-card-label">
                      Avaliações
                    </div>
                    <div className="dashboard-stat-card-value">
                      {counts.evaluations.toLocaleString()}
                    </div>
                  </div>
                  <div className="dashboard-stat-card-icon">
                    <i className="bi bi-star-fill fs-1 text-warning"></i>
                  </div>
                </div>
              </div>
              <div className="dashboard-stat-card-footer bg-warning"></div>
            </div>
          </div>
        </div>

        {metrics && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="card dashboard-metrics-card">
                <div className="card-header dashboard-metrics-card-header">
                  <div className="d-flex align-items-center">
                    <div className="dashboard-metrics-card-icon me-3">
                      <i className="bi bi-graph-up-arrow text-primary"></i>
                    </div>
                    <div>
                      <h3 className="dashboard-metrics-card-title">Métricas Principais</h3>
                      <p className="dashboard-metrics-card-subtitle">Performance do sistema de recomendações</p>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-3">
                      <div className="dashboard-metric-item">
                        <div className="dashboard-metric-icon text-primary">
                          <i className="bi bi-bullseye"></i>
                        </div>
                        <h6 className="dashboard-metric-label">
                          Precisão Média (@K)
                        </h6>
                        <h3 className="dashboard-metric-value text-primary">{(metrics.averagePrecisionAtK * 100).toFixed(1)}%</h3>
                        <small className="dashboard-metric-detail">
                          IC: {(metrics.precisionConfidenceLower * 100).toFixed(1)}% - {(metrics.precisionConfidenceUpper * 100).toFixed(1)}%
                        </small>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="dashboard-metric-item">
                        <div className="dashboard-metric-icon text-success">
                          <i className="bi bi-check-circle"></i>
                        </div>
                        <h6 className="dashboard-metric-label">
                          Taxa de Acerto (@K)
                        </h6>
                        <h3 className="dashboard-metric-value text-success">{(metrics.hitRateAtK * 100).toFixed(1)}%</h3>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="dashboard-metric-item">
                        <div className="dashboard-metric-icon text-info">
                          <i className="bi bi-collection"></i>
                        </div>
                        <h6 className="dashboard-metric-label">
                          Cobertura de Itens
                        </h6>
                        <h3 className="dashboard-metric-value text-info">{(metrics.itemCoverage * 100).toFixed(1)}%</h3>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="dashboard-metric-item">
                        <div className="dashboard-metric-icon text-warning">
                          <i className="bi bi-diagram-3"></i>
                        </div>
                        <h6 className="dashboard-metric-label">
                          Similaridade Intra-lista
                        </h6>
                        <h3 className="dashboard-metric-value text-warning">{(metrics.intraListSimilarity * 100).toFixed(1)}%</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {metrics && (
          <div className="row g-4 mb-5">
            <div className="col-lg-6">
              <div className="card dashboard-feature-card">
                <div className="card-header dashboard-feature-card-header">
                  <div className="d-flex align-items-center">
                    <div className="dashboard-feature-card-icon me-3">
                      <i className="bi bi-tags-fill text-primary"></i>
                    </div>
                    <div>
                      <h4 className="dashboard-feature-card-title">Cobertura de Características</h4>
                      <p className="dashboard-feature-card-subtitle">Distribuição por categoria</p>
                    </div>
                  </div>
                </div>
                <div className="dashboard-feature-card-body">
                  {metrics.globalFeatureCoverage && Object.entries(metrics.globalFeatureCoverage).map(([category, features]) => (
                    <div key={category} className="dashboard-category-container">
                      <h6 className="dashboard-category-title">
                        <span className="badge bg-primary me-2">{category}</span>
                      </h6>
                      {Object.entries(features).map(([feature, coverage]) => (
                        <div key={feature} className="dashboard-feature-item">
                          <span className="dashboard-feature-name">{feature.toLowerCase()}</span>
                          <div className="d-flex align-items-center">
                            <div className="progress dashboard-feature-progress">
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${coverage * 100}%` }}
                                aria-valuenow={coverage * 100} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span className="badge bg-dark dashboard-feature-value">{(coverage * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card dashboard-poi-card">
                <div className="card-header dashboard-poi-card-header">
                  <div className="d-flex align-items-center">
                    <div className="dashboard-poi-card-icon me-3">
                      <i className="bi bi-bar-chart-fill text-success"></i>
                    </div>
                    <div>
                      <h4 className="dashboard-poi-card-title">Frequência de Recomendação por POI</h4>
                      <p className="dashboard-poi-card-subtitle">Top POIs mais recomendados</p>
                    </div>
                  </div>
                </div>
                <div className="dashboard-poi-card-body">
                  {metrics.poiFrequency && Object.entries(metrics.poiFrequency)
                    .sort(([,a], [,b]) => b - a)
                    .map(([poiId, frequency], index) => {
                      const poi = poisList.find(p => p.id === parseInt(poiId));
                      return (
                        <div key={poiId} className="dashboard-poi-item">
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-primary dashboard-poi-rank">#{index + 1}</span>
                            <div className="flex-grow-1">
                              <h6 className="dashboard-poi-name">
                                {poi ? poi.name : `POI ${poiId}`}
                              </h6>
                              <small className="dashboard-poi-id">ID: {poiId}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="progress dashboard-poi-progress">
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${frequency * 100}%` }}
                                aria-valuenow={frequency * 100} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span className="badge bg-dark">{(frequency * 100).toFixed(1)}%</span>
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
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning shadow-sm dashboard-alert" role="alert">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill dashboard-alert-icon"></i>
                  <div>
                    <h5 className="dashboard-alert-heading">Nenhuma métrica disponível</h5>
                    <p className="mb-0">Execute uma avaliação primeiro para visualizar as métricas de performance do sistema.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;