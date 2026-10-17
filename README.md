# TransitGo — Bus & Train Ticket Booking (Demo)

Responsive Flask project for practicing Python, Docker, Git and Jenkins. Search sample routes, select a journey and create a **demo-only** booking reference. No real payments, seat allocation or tickets.

## Structure

```text
TransitGo-Booking/
├── app.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── Jenkinsfile
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Open http://localhost:5000

## Docker

```bash
docker build -t transitgo:v1 .
docker run -d --name transitgo-container -p 5002:5000 transitgo:v1
docker ps
docker logs transitgo-container
curl http://localhost:5002/health
```
Open http://SERVER_PUBLIC_IP:5002 (allow inbound TCP 5002 in EC2 security group).

## Docker Compose

```bash
docker compose up -d --build
docker compose logs -f
```
Do not run Compose and the standalone container simultaneously on the same port.

## Jenkins

Push all files to GitHub, create a Pipeline job using **Pipeline script from SCM**, select Git and the repository URL, branch `*/main`, script path `Jenkinsfile`. The Jenkins agent must have Docker installed and permission to access the Docker daemon. The pipeline builds, replaces the container and checks `/health`. On EC2 allow inbound TCP 5002 only as appropriate.

## Practice

- Search Bus: Hyderabad → Bengaluru (2 options).
- Search Train: Hyderabad → Vijayawada (1 option).
- Change travel date and passenger count; complete demo booking.
- Add routes to `ROUTES` in `app.py`, rebuild the image and redeploy.
- Extend with a database and actual inventory before any production use.

**Limitations:** Routes and seat counts are sample data; booking records live in memory and disappear on restart; no authentication, payment, or live railway/bus inventory.
