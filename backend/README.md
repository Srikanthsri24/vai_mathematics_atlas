# VisionicX account and symbolic API

The frontend remains independently hosted on GitHub Pages. This service is prepared for deployment; it is not automatically hosted by GitHub Pages.

## Local development

Use Python 3.12+, create a virtual environment and install `requirements.txt`. Set `ATLAS_DEBUG=true`; then run `python manage.py migrate`, `python manage.py createsuperuser`, and `python manage.py runserver 127.0.0.1:8000`. SQLite is permitted only for development/tests. For PostgreSQL locally, set `POSTGRES_PASSWORD` and `DJANGO_SECRET_KEY`, run `docker compose up --build -d`, then `docker compose exec api python manage.py migrate` and create the administrator. Docker's local PostgreSQL connection disables SSL deliberately; production defaults to required SSL.

Run `ATLAS_TESTING=true python manage.py test` (set the environment variable using your shell). CI uses a PostgreSQL 16 service and validates migration drift before deployment.

## AWS-compatible deployment

1. Build this directory's Docker image and publish it to your Amazon ECR repository.
2. Provision RDS PostgreSQL in private subnets. Store `DATABASE_URL` and `DJANGO_SECRET_KEY` in Secrets Manager, injected into the container; use a URL-encoded database password. Give the task only the secret/database access it needs.
3. Run the image on ECS Fargate behind an HTTPS Application Load Balancer. Keep database access restricted to the service's security group. Route the API domain to the ALB. Configure `/api/health/` as the ALB target health path. This read-only endpoint is exempt from HTTPS redirection so direct HTTP target health checks receive 200; public traffic still passes through the HTTPS listener. Never expose the development HTTP service publicly.
4. Set `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS=https://srikanthsri24.github.io`, `CSRF_TRUSTED_ORIGINS`, and production `DB_SSLMODE=require`. Set `TRUST_PROXY=true` only when the trusted ALB overwrites `X-Forwarded-Proto`. HTTPS redirection is enabled in production.
5. Run migrations as a one-off ECS task before replacing service tasks. Back up RDS and test restoration. Create the initial administrator in a controlled terminal. No initial credentials are committed.
6. Serve collected Django admin static assets through your chosen static origin/reverse proxy. Run `python manage.py collectstatic --noinput` using deployment environment variables. The React site is already independently hosted.
7. In the frontend Learning Desk, enter the HTTPS API origin and sign in. Connect only a backend you control. Tokens are session-only in the browser; local progress is never uploaded without an explicit sync action.

No AWS resources are provisioned by this repository and no paid service is started automatically.

## Access and endpoints

`/api/symbolic/` accepts differentiation, bounded expansion and exact evaluation with a restricted grammar. Numerical graph results are not proof. Original function domains must still be respected after simplification.

`/api/login/` issues an account token, with a dedicated rate limit. `/api/attempts/` grades supported question IDs on the server; client `correct` flags are ignored. An ID is immutable after first sync. Speed attempts require understanding mastery. `/api/progress/` is personal; `/api/notes/` is owner-only.

Staff teachers create their own `/api/assignments/` and view `/api/teacher-report/` only for enrolled students. Administrators link a teacher's initial students through Django admin or the enrolment endpoint; a teacher cannot arbitrarily enumerate or enrol unknown accounts. Teachers can then enrol their existing students via `/api/assignments/{id}/enroll/`.

Content publishing additionally requires `learning.change_contentrecord`. `/api/content/publish/` validates data and creates an immutable revision; `/api/content/rollback/` creates a new revision restoring an earlier version. Public `/api/content/` contains published content only. Editing the served frontend curriculum still follows the Git review/build pipeline. The backend does not turn unreviewed drafts into public lessons automatically.

Example request: `{"expression":"a*x**2+b*x+c","operation":"differentiate","values":{"a":2,"b":3,"c":1}}` returns the exact derivative `4*x + 3`.
