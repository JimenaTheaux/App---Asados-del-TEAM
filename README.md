# 🥩 Asados del Team

Aplicación web para registrar y visualizar estadísticas de asados compartidos en equipo.  
Permite guardar cada asado con fecha, cortes y participantes, y visualizar métricas claras en un dashboard moderno e intuitivo.

👉 **Demo online**:  
https://jimenatheaux.github.io/App---Asados-del-TEAM/

## Funcionalidades
### Registro de asados
- Selección de **fecha**
- Selección múltiple de **cortes de asado**
- Selección múltiple de **participantes**
- Validaciones para evitar registros incompletos
- Persistencia de datos mediante Google Apps Script + Google Sheets

### 📊 Dashboard interactivo
- **Total de asados registrados**
- **Asados por mes** (gráfico de líneas)
- **Participación porcentual** por persona (barras horizontales)
- **Ranking de cortes más elegidos** (barras horizontales)
- Datos filtrados para evitar registros vacíos o inválidos

## 🛠️ Tecnologías utilizadas
- **HTML5**
- **CSS3** (Grid, diseño responsive, UI moderna)
- **JavaScript (Vanilla)**
- **Chart.js** (visualización de datos)
- **Google Apps Script** (API backend)
- **Google Sheets** (base de datos)
- **Git & GitHub**
- **GitHub Pages** (deploy)

## 🎨 Diseño y UI
- Paleta cálida inspirada en tonos madera / parrilla
- Gradientes suaves y cards elevadas
- Tipografía moderna (**Inter**)
- Diseño responsive (mobile-first)
- Experiencia visual clara para dashboards de datos

## Lógica destacada
- Normalización de datos antes de renderizar métricas
- Agrupación temporal por mes
- Cálculo de porcentajes dinámicos
- Rankings ordenados de mayor a menor
- Blindaje contra registros vacíos desde backend

## Estructura del proyecto
asados-app/
│
├── index.html
├── css/
│ ├── styles.css
│
├── js/
│ └── main.js
│
└── README.md

## Posibles mejoras futuras
- Filtros por rango de fechas
- Añadir registro de imagenes y mini carrusel 
- Autenticación de usuarios
- Edición y eliminación de registros

## 👩‍💻 Autora
**Jimena Theaux**  
Analista de datos / Desarrollo de soluciones digitales  
📍 Argentina  
- GitHub: https://github.com/JimenaTheaux  
- LinkedIn: www.linkedin.com/in/jimena-theaux



