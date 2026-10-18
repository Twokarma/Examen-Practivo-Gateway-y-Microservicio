# Biblioteca Digital — API Gateway + Microservicio (NestJS)

Arquitectura orientada a servicios: **API Gateway (NestJS + proxy inverso)** → **Microservicio NestJS** → **PostgreSQL**, orquestados con Docker Compose en una red bridge.

## Requisitos
- Docker y Docker Compose
- Git

## Clonar y ejecutar
```bash
git clone <URL_DE_TU_REPO>
cd biblioteca-microservicios
cp .env.example .env
docker-compose up --build
```
Espera a que los 3 contenedores estén `healthy` (`docker ps`). El único puerto expuesto es el del gateway: **http://localhost:3000**

## Características del Gateway
- Proxy inverso (`/api/*` → microservicio)
- CORS
- Logging/tracing con `x-request-id`
- Rate limiting (100 req/min por IP)

## Endpoints (todos vía gateway)
| Verbo | URL | Descripción |
|---|---|---|
| POST | /api/autores | Crear autor |
| GET | /api/autores | Listar autores |
| GET | /api/autores/:id | Ver autor (con sus libros) |
| PATCH | /api/autores/:id | Actualizar autor |
| DELETE | /api/autores/:id | Eliminar autor |
| POST | /api/libros | Crear libro |
| GET | /api/libros | Listar libros |
| GET | /api/libros/:id | Ver libro |
| PATCH | /api/libros/:id | Actualizar libro |
| DELETE | /api/libros/:id | Eliminar libro |

Swagger: http://localhost:3000/api/docs

## Pruebas con cURL
```bash
# Crear autor
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Gabriel García Márquez","nacionalidad":"Colombiana"}'

# Crear libro
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Cien años de soledad","isbn":"978-0307474728","anioPublicacion":1967,"autorId":1}'

# Listar
curl http://localhost:3000/api/libros

# Actualizar
curl -X PATCH http://localhost:3000/api/libros/1 \
  -H "Content-Type: application/json" -d '{"disponible":false}'

# Eliminar
curl -X DELETE http://localhost:3000/api/libros/1
```

## Logs
```bash
docker logs biblioteca-gateway
docker logs biblioteca-backend
```

## Git Flow
Ramas: `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`.
