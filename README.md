# これはなに

SVG画像のsvgタグをHTMLに埋め込むようにするJavaScriptを生成する機械

# 使い方

1. `resources/` 配下にSVG画像を配置する
    - ファイル名は `*.svg` とする
2. `docker compose build && docker compose up && docker compose down` を実行する
3. `build/svg.js` を取り出す
    - 適宜ファイル名は変更してください
4. HTMLから呼び出す

(例)

```bash
curl -o resources/nogizaka46.svg "https://upload.wikimedia.org/wikipedia/commons/6/65/Nogizaka46_logo.svg"
docker compose build && docker compose up && docker compose down
mv build/svg.js /var/www/html/svg.js
cat > /var/www/html/index.html
<html>
  <head>
    <script src="./svg.js"></script>
  </head>
  <body>
    <div icon-data="nogizaka46"></div>
  </body>
</html>
```
