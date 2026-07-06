import glob
import re

snippet = '''<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "cd4a9923052e4bfeb8d309f77c47c7a3"}'></script><!-- End Cloudflare Web Analytics -->'''

# Matches any existing Cloudflare beacon snippet, with or without the comment wrappers, regardless of token
old_pattern = re.compile(
    r'(<!--\s*Cloudflare Web Analytics\s*-->)?\s*<script[^>]*cloudflareinsights\.com[^>]*>.*?</script>\s*(<!--\s*End Cloudflare Web Analytics\s*-->)?',
    re.DOTALL
)

for path in glob.glob("**/*.html", recursive=True):
    with open(path, "r") as f:
        content = f.read()

    if old_pattern.search(content):
        content = old_pattern.sub(snippet, content)
        print("replaced existing snippet in:", path)
    elif "</head>" in content:
        content = content.replace("</head>", snippet + "\n</head>", 1)
        print("added new snippet to:", path)
    else:
        print("NO </head> FOUND, skipped:", path)
        continue

    with open(path, "w") as f:
        f.write(content)
