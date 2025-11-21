"""
Shared domain keyword maps for inferring domains from text and skills.
Keeping this separate avoids duplication between inference functions.
"""

# Keywords to look for inside free text (job descriptions, resumes).
DOMAIN_KEYWORDS_TEXT = {
    "web": [
        "frontend", "backend", "full stack", "full-stack", "web",
        "react", "next", "angular", "vue", "svelte", "tailwind",
        "node.js", "typescript", "javascript"
    ],
    "mobile": [
        "mobile", "android", "ios", "flutter", "react native", "react-native",
        "jetpack", "swiftui", "kotlin", "swift"
    ],
    "cloud": [
        "cloud", "devops", "aws", "azure", "gcp", "kubernetes", "docker",
        "ci/cd", "terraform", "ansible", "helm", "sre"
    ],
    "data": [
        "data", "machine learning", "ml", "analytics", "ai", "nlp", "llm",
        "pandas", "numpy", "pytorch", "tensorflow", "spark"
    ],
    "security": [
        "security", "infosec", "owasp", "penetration", "pentest", "siem",
        "soc", "zero trust", "iam"
    ],
    "blockchain": [
        "blockchain", "web3", "smart contract", "solidity", "defi", "crypto", "nft"
    ],
    "product": ["ui", "ux", "design", "figma", "prototype", "wireframe"],
    "embedded": [
        "embedded", "firmware", "microcontroller", "arduino", "raspberry pi",
        "rtos", "iot"
    ],
    "game": ["game", "unity", "unreal", "godot"],
}

# Keywords to look for inside structured skill lists.
DOMAIN_KEYWORDS_SKILLS = {
    "web": [
        "react", "next", "vue", "angular", "svelte", "tailwind", "css", "html",
        "javascript", "typescript", "node", "express", "django", "flask", "fastapi"
    ],
    "mobile": [
        "react native", "flutter", "swift", "kotlin", "android", "ios", "swiftui"
    ],
    "cloud": [
        "aws", "azure", "gcp", "kubernetes", "docker", "terraform", "ansible",
        "helm", "devops", "ci/cd", "cloudwatch", "eks", "ecs"
    ],
    "data": [
        "pandas", "numpy", "sklearn", "scikit", "tensorflow", "pytorch", "ml",
        "nlp", "llm", "langchain", "spark", "airflow", "dbt"
    ],
    "security": [
        "owasp", "burp", "zap", "nessus", "siem", "soc", "iam", "kali", "nmap",
        "wireshark", "penetration"
    ],
    "blockchain": [
        "solidity", "web3", "ethers.js", "hardhat", "truffle", "rust (solana)",
        "defi", "crypto", "nft"
    ],
    "product": ["figma", "adobe xd", "ui", "ux", "prototyping", "wireframe"],
    "embedded": [
        "arduino", "raspberry pi", "embedded", "firmware", "rtos", "iot", "esp32",
        "stm32"
    ],
    "game": ["unity", "unreal", "godot", "blender"],
}
