pandoc -f gfm --standalone --to html5 --embed-resources --standalone --css https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css -H .\res\github-markdown-h.html -B .\res\github-markdown-b.html -A .\res\github-markdown-a.html -V pagetitle="Cat in a superposition" -V lang=ja -o ..\index.html index.md
pandoc -f gfm --standalone --to html5 --embed-resources --standalone --css https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css -H .\res\github-markdown-h.html -B .\res\github-markdown-b.html -A .\res\github-markdown-a.html -V pagetitle="Cat in a superposition - 課題とコンクールの進め方" -V lang=ja -o ..\rule.html rule.md