# Dwayne Pugh

DevOps Lead / Site Reliability Engineer — CI/CD, Kubernetes, GitHub Enterprise & SRE

Sacramento, CA (open to remote) · [dwayne.pugh@icloud.com](mailto:dwayne.pugh@icloud.com) · [linkedin.com/in/dpugh143](https://linkedin.com/in/dpugh143) · [github.com/dpugh143](https://github.com/dpugh143) · [staging-ground.github.io/dwayne.pugh](https://staging-ground.github.io/dwayne.pugh/)

## Summary

DevOps lead and site reliability engineer with 10 years in production operations, from California's power-grid market systems to 120+ AWS microservices at Rivian. Currently leading DevOps for California's statewide licensing platform: re-architecting CI/CD on OpenShift 4, standing up GitHub Enterprise and Copilot for the department, and introducing SLOs and error budgets. Builds safe-by-default delivery with immutable artifacts, one-step rollback, least-privilege access, and everything as code. Writes production Python for platform tooling, and has trained enterprise engineering teams in SRE, DevOps, and OpenShift since 2022.

## Skills

- **SRE & observability:** SLIs/SLOs, error budgets, on-call, incident response, root cause analysis, Prometheus, Grafana (LGTM stack), OpenTelemetry, Elastic (APM, ES|QL), Datadog, Splunk, cost optimization
- **CI/CD & GitOps:** GitHub Enterprise, GitHub Actions, GitHub Copilot, ARC self-hosted runners, OIDC, Jenkins (Groovy shared libraries), ArgoCD, Tekton, Artifactory, image versioning and promotion, Flyway/Maven
- **AI-assisted engineering:** GitHub Copilot enablement and governance; AI assistants (Claude) for design docs, runbooks, and code
- **Containers & cloud:** Kubernetes (OpenShift 4, EKS), OpenShift Virtualization, Kustomize, Docker/Podman, AWS, Terraform, Terragrunt
- **Languages:** Python (Typer, Pydantic, pytest), Bash, Groovy, SQL, YAML
- **Security & identity:** least-privilege RBAC and SCCs, Entra ID SSO, secrets management (Delinea), secret scanning, hardened non-root images, RHEL/Linux
- **Practice:** ADRs, docs-as-code (MkDocs), runbooks, release management, Oracle Exadata cutovers, Jira, Agile/Scrum, technical training

## Experience

### California Department of Consumer Affairs — Sacramento, CA

#### DevOps Lead (IT Specialist I) · Oct 2024 – Present

Lead DevOps for BreEZe, the state's licensing and enforcement platform, and for the department's source control, CI/CD, and observability platforms. Driving the move from legacy Jenkins and Bitbucket to OpenShift 4, GitHub Enterprise with Copilot, and SRE practices.

- **Re-architecting BreEZe CI/CD (Pipeline 2.0) on OpenShift 4.** Designed a config-driven orchestrator and job model (YAML environment, release, and issue maps plus a Jenkins shared library) to replace ~20 hand-configured legacy jobs on end-of-support VMs, serving 8 environments on 4 clusters across 2 data centers. Built an interim bridge pipeline so jobs migrate one at a time without disrupting the 4–5-week release cycle.
- **Leading DCA's SRE transformation.** Defined SLIs, SLOs, and an error-budget ownership model for BreEZe, the batch scheduler, and the CI/CD platform, with business-approved targets and vendor accountability written into the contract. Planning developer self-service deployments and a release-captain rotation.
- **Stood up GitHub Enterprise Cloud for the department from scratch, laying the foundation for AI-assisted development with GitHub Copilot:** Entra ID SSO, enterprise rulesets, branching and CODEOWNERS model, token policy, and least-privilege team access. Onboarded the first team by the MVP deadline and designed the multi-organization model for every board and bureau.
- **Driving AI-assisted engineering.** Use AI assistants (Claude) to speed up design docs, ADRs, runbooks, and automation code across the modernization program. Helping lead the GitHub Copilot rollout: policy and seat management, data-protection and content-exclusion rules, and developer training and adoption.
- **Leading the Bitbucket-to-GitHub migration** (Bitbucket retires Oct 2027). Wrote the migration ADR and a tested migration script with secret scanning, history rewrites, and commit-map traceability. Led secrets hardening, moving credentials out of git into Jenkins credentials and Delinea, with least-privilege RBAC across all 4 clusters.
- **Modernized build and release delivery.** Designed immutable image versioning with alias-based promotion and one-step rollback, plus a scope lock that pins the release commit so post-freeze code can't ship. Moved image builds to GitHub Actions with ArgoCD-driven rollouts, and designed self-hosted runners on OpenShift (ARC + OIDC) to reach firewalled Artifactory.
- **Building a Python orchestration engine** (Typer CLI, Pydantic v2) to move pipeline logic out of Groovy and remove plugin dependencies; prototyped parallel per-environment deployment backed by 290 automated tests.
- **Cut observability costs.** Analyzed Elastic Cloud ingest (300–350 GB/day, ~80 TB retained) and identified an estimated $12–16K/year in savings through retention engineering. Proposed an unprivileged parallel log and metrics pipeline that needs no application changes.
- **Built a docs-as-code program:** an MkDocs site with 17 ADRs, 6 standards, 19 runbooks, and 6 guides; reusable GitHub Actions PR guardrails (lint, naming, release-version checks); and an OIDC-authenticated Microsoft Graph sync to SharePoint.
- **Ran the Exadata X11 database cutover** for staging and production: wrote the cutover runbook and coordinated the DBA, network/firewall, and testing teams.

#### Agile Project Analyst · Nov 2022 – Oct 2024 (concurrent with Rivian through Apr 2023)

- Cut licensing application types 20% and development time 60% by redesigning form workflows with engineering teams.
- Translated business rules into technical specs; ran sprint planning, backlog grooming, and QA across multiple bureaus.

#### DevOps Engineer · Jul 2019 – May 2021

- Cut deployment cycle time 75% by rebuilding CI/CD pipelines and reducing job count by more than 45%.
- Led the migration of application source from IBM RTC to Bitbucket and Jira, building the Jenkins automation and training DevOps staff and developers on the new workflow.
- Planned and ran DevOps tasks for the BreEZe production database migration to Oracle Exadata Gen2.
- Migrated the Jenkins data-obfuscation pipeline from Windows to RHEL and extended it to support multiple environments.

### Rivian Automotive — Palo Alto, CA

#### Software Engineer II · May 2021 – Apr 2023

- Deployed and operated 120+ AWS-hosted microservices supporting customer-facing platforms.
- Built reusable Terraform modules and automation scripts that removed manual infrastructure work for service teams.
- Maintained Jenkins CI/CD pipelines and ran PR and production-readiness reviews.
- Implemented Apache Flink on EKS and wrote the end-to-end deployment documentation.
- Served on the on-call rotation; led incident root cause analysis with Datadog, Grafana, Prometheus, and Splunk.

### California ISO (state power-grid operator) — Folsom, CA

#### Critical Systems Analyst II · Nov 2015 – Oct 2018

- Deployed patches and updates to energy-market applications supporting California's power grid, coordinating vendors and internal teams to protect availability and security.
- Supported developers, DBAs, and grid operators with system monitoring, production deployments, and troubleshooting.

## Teaching & Mentoring

### Technical Trainer & Courseware Developer, SRE/DevOps — Remote · Jan 2022 – Present (part-time)

*Clients include TEKsystems Global Services and Interview Kickstart*

- Teach multi-day, lab-driven courses to cohorts of 10–20 enterprise engineers, including Site Reliability Engineering, Modern Tooling & DevOps Integration, and OpenShift fundamentals for a mainframe-to-modern development bootcamp; taught its 4-week, 96-hour DevOps/SRE/CI/CD portion.
- Build hands-on labs on observability (Grafana LGTM + OpenTelemetry on AWS), Terraform drift detection, OpenShift workloads and scaling, API security with pytest, and ECS-to-EKS migration planning with ArgoCD.
- Develop courseware and complete instructor packages (delivery scripts, facilitation guides, answer keys and rubrics, LogQL/PromQL/TraceQL references) and modular 2-hour courseware that combines into a capstone; developed OpenShift Virtualization (KubeVirt) course material.
- Teach Interview Kickstart sessions on Kubernetes, deployment strategies, and incident response; run mock interviews and 1:1 coaching for engineers targeting FAANG roles (rated 4.5/5).

## Education & Certifications

### B.S., Cloud and Network Engineering – Amazon Web Services — Western Governors University · Expected May 2027

- Includes AWS Solutions Architect – Associate, AWS Cloud Practitioner, CompTIA Network+, and CompTIA Security+ (in progress)

### A.S., Information Security and A.S., Network Design — Sacramento City College · 2020

**Certifications:** CompTIA Cloud+ · CompTIA Project+ · LPI Linux Essentials · ITIL Foundation · CompTIA A+ · CIW Site Development Associate
