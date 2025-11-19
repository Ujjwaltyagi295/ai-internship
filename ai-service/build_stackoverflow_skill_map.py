import json
from pathlib import Path


# Curated StackOverflow-style skills list (languages, frameworks, tools, DBs, cloud, ML)
LANGUAGES = [
    "python", "javascript", "typescript", "java", "c", "c++", "c#", "go", "rust",
    "ruby", "php", "swift", "kotlin", "scala", "dart", "r", "matlab", "perl",
    "objective-c", "shell", "bash", "powershell", "sql"
]

FRAMEWORKS = [
    "react", "next.js", "angular", "vue", "svelte", "express", "fastapi",
    "django", "flask", "spring", "spring boot", "laravel", "rails", "nest.js",
    "asp.net", "asp.net core", "gin", "fiber", "nuxt.js", "gatsby", "remix"
]

LIBRARIES = [
    "pandas", "numpy", "matplotlib", "scipy", "scikit-learn", "pytorch",
    "tensorflow", "keras", "opencv", "xgboost", "lightgbm", "catboost",
    "plotly", "seaborn", "d3.js", "three.js", "redux", "rxjs"
]

TOOLS = [
    "docker", "kubernetes", "git", "github actions", "gitlab ci", "jenkins",
    "ansible", "terraform", "helm", "vagrant", "webpack", "vite", "rollup",
    "npm", "yarn", "pnpm", "eslint", "prettier", "babel"
]

DATABASES = [
    "postgresql", "mysql", "mariadb", "sqlite", "mongodb", "redis", "dynamodb",
    "cassandra", "elasticsearch", "neo4j", "cosmos db", "snowflake", "bigquery",
    "redshift", "clickhouse"
]

CLOUD = [
    "aws", "gcp", "azure", "vercel", "netlify", "heroku", "digitalocean",
    "cloudflare", "firebase", "supabase"
]

TESTING = [
    "jest", "vitest", "mocha", "chai", "pytest", "unittest", "cypress",
    "playwright", "selenium", "junit", "pytest-django"
]

DEVOPS = [
    "ci/cd", "observability", "prometheus", "grafana", "datadog", "new relic",
    "sentry", "opentelemetry", "logstash", "kibana"
]

SECURITY = [
    "oauth", "oidc", "jwt", "csrf", "cors", "owasp", "sast", "dast", "sso"
]

MOBILE = [
    "react native", "flutter", "android", "ios", "swiftui", "jetpack compose"
]

PLATFORMS = [
    "node.js", "deno", "bun", "electron", "tauri"
]


def build_stackoverflow_skill_map():
    base = Path(__file__).resolve().parent
    out_path = base / "ai" / "skills" / "skill_map.json"

    buckets = [
        LANGUAGES, FRAMEWORKS, LIBRARIES, TOOLS,
        DATABASES, CLOUD, TESTING, DEVOPS, SECURITY,
        MOBILE, PLATFORMS
    ]

    skill_map = {}
    for bucket in buckets:
        for name in bucket:
            key = name.lower().strip()
            if key:
                skill_map[key] = key

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(skill_map, f, indent=2, ensure_ascii=False)

    print(f"Generated StackOverflow skill_map.json with {len(skill_map)} skills at {out_path}")


if __name__ == "__main__":
    build_stackoverflow_skill_map()
