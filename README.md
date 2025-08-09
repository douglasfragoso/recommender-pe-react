## License

This project is proprietary. The source code is made available exclusively for academic study and evaluation purposes.

[![License: Proprietary](https://img.shields.io/badge/license-proprietary-red.svg)](https://github.com/douglasfragoso/recommender-pe-react?tab=License-1-ov-file)

## Authors and Affiliations

**Douglas Inácio Fragoso Ferreira¹\***; **Everton Gomede²**

1. University of São Paulo (USP). MBA in Software Engineering, Luiz de Queiroz College of Agriculture (Esalq), Pecege.
2. School of Electrical and Computer Engineering, State University of Campinas (FEEC/UNICAMP). PhD in Computer Science.

\*Corresponding author: douglas.iff@gmail.com

# Points of Interest Recommendation System in Recife with Content-Based Filtering and Pernambuco Passport

## Project Overview

Recife has significant tourism potential but requires digital solutions to promote its Points of Interest (POIs). Thus, the implementation of an intelligent system represents an innovation opportunity for the sector. A Content-Based Recommendation System was proposed, which uses similarity metrics to correlate user preferences with POI characteristics. 
The system achieved 79% precision, 100% minimum hit rate, and 86% coverage, demonstrating strong performance in cold start scenarios despite the overexposure of some POIs. Therefore, the model proved effective in providing personalized recommendations, showing potential to boost local tourism.

---

## Features  

### User Management
- User login  
- User registration  
- User management  

### POI Management  
- Register Points of Interest  
- Browse available POIs  

### Recommendation Engine  
- Generate personalized recommendations  
- Rate and evaluate recommendations  

---

## 🛠️ Tech Stack  

### Frontend  
| Technology       | Purpose                |
|------------------|------------------------|
| Vite             | Build tool             |
| React.js         | UI Framework           |
| Bootstrap        | Styling                |
| Axios            | HTTP Client            |
| Jwt-decode       | Authentication         |
| React-router-dom | Navigation             |

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (v22.13.1 recommended)  
- npm/yarn/pnpm  

### Installation  

- Clone repository
```bash
git clone https://github.com/douglasfragoso/recommender-pe-react
```

- Enter project directory
```bash
cd recommender-pe
```
- Install dependencies
```bash
npm install
```
- Launch development server
```bash
npm run dev
```
- Access the app at: - http://localhost:3000

Important: Ensure the [Backend Service](https://github.com/douglasfragoso/recommender-pe) is running before starting the frontend.
